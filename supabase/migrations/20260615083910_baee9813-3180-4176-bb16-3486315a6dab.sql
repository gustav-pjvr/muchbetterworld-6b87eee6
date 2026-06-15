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

create policy "anyone can submit a conversation"
  on public.conversations for insert
  to anon, authenticated
  with check (true);