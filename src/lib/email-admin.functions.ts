import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = ["gustavpjvr@gmail.com", "jacojvr@gmail.com"];

async function assertAdmin(context: { claims?: unknown }) {
  const email = (context.claims as { email?: string } | undefined)?.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) throw new Error("Forbidden");
}

const QuerySchema = z.object({
  sinceIso: z.string(),
  untilIso: z.string(),
  template: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

export type EmailLogRow = {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type EmailStats = {
  total: number;
  sent: number;
  failed: number;
  suppressed: number;
  pending: number;
  other: number;
};

export type EmailDashboardData = {
  stats: EmailStats;
  rows: EmailLogRow[];
  templates: string[];
};

export const getEmailDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => QuerySchema.parse(d))
  .handler(async ({ data, context }): Promise<EmailDashboardData> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Pull a generous window of rows in range, then dedupe by message_id in JS.
    const { data: raw, error } = await supabaseAdmin
      .from("email_send_log")
      .select("id, message_id, template_name, recipient_email, status, error_message, created_at")
      .gte("created_at", data.sinceIso)
      .lte("created_at", data.untilIso)
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);

    const latestByKey = new Map<string, EmailLogRow>();
    for (const r of (raw ?? []) as EmailLogRow[]) {
      const key = r.message_id ?? `__noid__${r.id}`;
      if (!latestByKey.has(key)) latestByKey.set(key, r);
    }
    let rows = Array.from(latestByKey.values());

    // Templates list (from the full range, before status/template filters)
    const templates = Array.from(new Set(rows.map((r) => r.template_name))).sort();

    if (data.template) rows = rows.filter((r) => r.template_name === data.template);
    if (data.status) {
      if (data.status === "failed") {
        rows = rows.filter((r) => r.status === "dlq" || r.status === "failed" || r.status === "bounced");
      } else {
        rows = rows.filter((r) => r.status === data.status);
      }
    }

    rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    const stats: EmailStats = {
      total: rows.length,
      sent: 0,
      failed: 0,
      suppressed: 0,
      pending: 0,
      other: 0,
    };
    for (const r of rows) {
      if (r.status === "sent") stats.sent++;
      else if (r.status === "dlq" || r.status === "failed" || r.status === "bounced") stats.failed++;
      else if (r.status === "suppressed" || r.status === "complained") stats.suppressed++;
      else if (r.status === "pending") stats.pending++;
      else stats.other++;
    }

    const limit = data.limit ?? 50;
    return { stats, rows: rows.slice(0, limit), templates };
  });
