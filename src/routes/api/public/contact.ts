import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(4000),
});

// Address that receives signup-notification emails.
// Swap this when ready (or set NOTIFICATION_EMAIL env var).
const NOTIFICATION_RECIPIENT =
  process.env.NOTIFICATION_EMAIL ?? "hello@muchbetter.world";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = ContactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid input", issues: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const data = parsed.data;
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("conversations")
          .insert({
            name: data.name,
            company: data.company || null,
            email: data.email,
            phone: data.phone || null,
            project_type: data.projectType || null,
            message: data.message,
          })
          .select("id, created_at")
          .single();

        if (insertError || !inserted) {
          console.error("[contact] insert failed:", insertError);
          return Response.json(
            { error: "Could not save your message. Please try again." },
            { status: 500 },
          );
        }

        // Enqueue notification email. Best-effort: if the email infra isn't
        // set up yet (no domain connected), we log and still return success
        // so the submission isn't lost.
        try {
          const origin = new URL(request.url).origin;
          const sendRes = await fetch(
            `${origin}/lovable/email/transactional/send`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // The send route requires the service role to allow
                // unauthenticated internal callers like this one.
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
              },
              body: JSON.stringify({
                templateName: "signup-notification",
                recipientEmail: NOTIFICATION_RECIPIENT,
                idempotencyKey: `signup-notification-${inserted.id}`,
                templateData: {
                  name: data.name,
                  email: data.email,
                  company: data.company || null,
                  phone: data.phone || null,
                  projectType: data.projectType || null,
                  message: data.message,
                  submittedAt: inserted.created_at,
                },
              }),
            },
          );
          if (!sendRes.ok) {
            const body = await sendRes.text().catch(() => "");
            console.warn(
              `[contact] email enqueue returned ${sendRes.status}: ${body}`,
            );
          }
        } catch (err) {
          console.warn("[contact] email enqueue failed:", err);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
