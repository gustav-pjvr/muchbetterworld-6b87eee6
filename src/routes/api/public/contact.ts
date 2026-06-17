import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[\p{L}\p{M}'’\-.\s]+$/u),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^\+?[0-9\s().\-]{7,}$/),
  projectType: z.enum([
    "business-analysis",
    "consulting",
    "website-development",
    "custom-solution",
  ]),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

const NOTIFICATION_RECIPIENT =
  process.env.NOTIFICATION_EMAIL ?? "gustav@muchbetter.world";

async function sendTransactional(
  origin: string,
  serviceKey: string,
  body: {
    templateName: string;
    recipientEmail: string;
    idempotencyKey: string;
    templateData: Record<string, unknown>;
  },
): Promise<void> {
  try {
    const res = await fetch(`${origin}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[contact] transactional send failed", {
        template: body.templateName,
        status: res.status,
        body: text.slice(0, 500),
      });
    }
  } catch (err) {
    console.warn("[contact] transactional send threw", {
      template: body.templateName,
      err,
    });
  }
}

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
            message: data.message || "",
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

        const origin = new URL(request.url).origin;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (serviceKey) {
          // Notify the site owner
          await sendTransactional(origin, serviceKey, {
            templateName: "signup-notification",
            recipientEmail: NOTIFICATION_RECIPIENT,
            idempotencyKey: `signup-notification-${inserted.id}`,
            templateData: {
              name: data.name,
              email: data.email,
              company: data.company || null,
              phone: data.phone || null,
              projectType: data.projectType || null,
              message: data.message || "",
              submittedAt: inserted.created_at,
            },
          });

          // Confirmation to the submitter
          await sendTransactional(origin, serviceKey, {
            templateName: "contact-confirmation",
            recipientEmail: data.email,
            idempotencyKey: `contact-confirmation-${inserted.id}`,
            templateData: {
              name: data.name,
              message: data.message || "",
            },
          });
        } else {
          console.warn("[contact] SUPABASE_SERVICE_ROLE_KEY missing — skipping email send");
        }

        return Response.json({ ok: true });
      },
    },
  },
});
