# Plan: Contact form → conversation record → app email notification

## Goal
When a visitor submits the "Send Us a Message" form on the home page:
1. Save the submission to a `conversations` table.
2. Enqueue a `signup-notification` app email to a notification address (to be supplied later).
3. All queue / suppression / unsubscribe / DLQ infrastructure ready so that the moment the email domain is connected, sending starts working with zero further code changes.

The notification recipient address and the email domain are deferred — both will be filled in by the user later. The plan stubs them as configurable constants so swapping them in is a one-line change.

## Prerequisites (run as part of implementation)
1. **Enable Lovable Cloud** (`supabase--enable`) — required for DB + queues + email.
2. **Run `email_domain--setup_email_infra`** — provisions pgmq queues (`transactional_emails`, dlq), RPC wrappers (`enqueue_email`, `read_email_batch`, `delete_email`, `move_to_dlq`), `email_send_log`, `email_send_state`, `suppressed_emails`, `email_unsubscribe_tokens`, the `/lovable/email/queue/process` route, vault secrets, and the pg_cron job that hits it every 5s.
3. **Run `email_domain--scaffold_transactional_email`** — generates `/lovable/email/transactional/send`, `/lovable/email/transactional/preview`, `/email/unsubscribe` (validation API), `/lovable/email/suppression`, the template registry, and a sample template.
4. Skip `email_domain--check_email_domain_status` setup dialog — user has stated they will connect the domain later. Note in the closing message that emails will queue but not actually deliver until the domain is verified.

## Database
Create one new table via migration:

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  project_type text,
  message text not null,
  created_at timestamptz not null default now()
);

grant insert on public.conversations to anon, authenticated;
grant all on public.conversations to service_role;

alter table public.conversations enable row level security;

-- Public form: anyone can insert; nobody can read from the client.
create policy "anyone can submit a conversation"
  on public.conversations for insert
  to anon, authenticated
  with check (true);
```

No SELECT policy — submissions are only readable via service-role (admin / future inbox UI).

## Email template
Create `src/lib/email-templates/signup-notification.tsx`:
- React Email components only, inline styles, white body.
- Props: `name`, `email`, `company?`, `phone?`, `projectType?`, `message`, `submittedAt`.
- Subject: `New conversation from {name}`.
- Register in `src/lib/email-templates/registry.ts` under key `signup-notification`.

## Server route — public contact submission
New route `src/routes/api/public/contact.ts`:
- `POST` handler.
- Zod-validate body (trim, length caps, email format).
- `await import('@/integrations/supabase/client.server')` then insert into `conversations`.
- Call internal helper to enqueue email to the notification address with the conversation payload as `templateData`. Idempotency key: `signup-notification-{conversation.id}`.
- Return `{ ok: true }` on success; never leak DB errors.
- CORS not needed (same-origin), but the route lives under `/api/public/*` so it works without auth on the published site.

The notification recipient lives in one place:
```ts
// src/lib/email/notification-recipient.ts
export const NOTIFICATION_RECIPIENT = process.env.NOTIFICATION_EMAIL ?? "hello@muchbetter.world";
```
User swaps the env var (or the fallback) when they're ready.

## Frontend wiring
Edit `src/components/site/Sections.tsx` `Contact` component:
- Replace the 600ms fake `setTimeout` with a real `fetch('/api/public/contact', { method: 'POST', body: JSON.stringify(...) })`.
- Keep the existing UI, button states, and toast.
- On non-2xx: show error toast with friendly message.
- Client-side Zod validation mirrors server schema for fast feedback.

## Unsubscribe page
Scaffold creates `/email/unsubscribe` as the validation API. Per scaffold output, also add the branded user-facing page (path reported by the scaffold tool — likely `/unsubscribe`) that:
- Reads `?token=`, GETs validation, shows confirm UI, POSTs to confirm, shows success.
- Branded with site styles (matches existing Card / Button components).

## What works after this is shipped
- Form submissions persist to `conversations` immediately.
- Emails enqueue into `transactional_emails` and the cron worker tries to send every 5s.
- Until the domain is connected, sends fail at the provider step; the queue's retry + DLQ + TTL behavior handles that cleanly. As soon as the user connects `notify.<their-domain>` via the email setup dialog, the next cron tick starts delivering — no code change needed.
- Suppression list, unsubscribe tokens, and the unsubscribe page are all live from day one.

## Out of scope
- Admin inbox UI for viewing conversations (DB rows are accessible via Cloud → Tables).
- Multiple templates / marketing emails.
- File attachments.
- Rate limiting on the public contact endpoint (per project policy — only added on explicit request).
