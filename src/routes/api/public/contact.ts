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

const SITE_NAME = "muchbetterworld";
const SENDER_DOMAIN = "notify.muchbetter.world";
const FROM_DOMAIN = "muchbetter.world";

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

        // Best-effort: render + enqueue the admin notification email directly,
        // so the submission isn't lost if the email infra is still warming up.
        try {
          const React = await import("react");
          const { render } = await import("@react-email/components");
          const { template } = await import(
            "@/lib/email-templates/signup-notification"
          );

          const templateData = {
            name: data.name,
            email: data.email,
            company: data.company || null,
            phone: data.phone || null,
            projectType: data.projectType || null,
            message: data.message || "",
            submittedAt: inserted.created_at,
          };

          const element = React.createElement(
            template.component,
            templateData,
          );
          const html = await render(element);
          const text = await render(element, { plainText: true });
          const subject =
            typeof template.subject === "function"
              ? template.subject(templateData)
              : template.subject;

          const messageId = crypto.randomUUID();

          await supabaseAdmin.from("email_send_log").insert({
            message_id: messageId,
            template_name: "signup-notification",
            recipient_email: NOTIFICATION_RECIPIENT,
            status: "pending",
          });

          const { error: enqueueError } = await supabaseAdmin.rpc(
            "enqueue_email",
            {
              queue_name: "transactional_emails",
              payload: {
                message_id: messageId,
                to: NOTIFICATION_RECIPIENT,
                from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
                sender_domain: SENDER_DOMAIN,
                subject,
                html,
                text,
                purpose: "transactional",
                label: "signup-notification",
                idempotency_key: `signup-notification-${inserted.id}`,
                queued_at: new Date().toISOString(),
              },
            },
          );

          if (enqueueError) {
            console.warn("[contact] enqueue failed:", enqueueError);
            await supabaseAdmin.from("email_send_log").insert({
              message_id: messageId,
              template_name: "signup-notification",
              recipient_email: NOTIFICATION_RECIPIENT,
              status: "failed",
              error_message: `enqueue_email: ${enqueueError.message}`,
            });
          }
        } catch (err) {
          console.warn("[contact] notification render/enqueue failed:", err);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
