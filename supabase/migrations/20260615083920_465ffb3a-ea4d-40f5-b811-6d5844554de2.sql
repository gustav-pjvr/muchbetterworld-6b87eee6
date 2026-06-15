drop policy if exists "anyone can submit a conversation" on public.conversations;
revoke insert on public.conversations from anon, authenticated;