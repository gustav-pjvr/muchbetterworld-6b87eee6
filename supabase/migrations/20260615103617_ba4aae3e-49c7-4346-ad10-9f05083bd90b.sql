
REVOKE EXECUTE ON FUNCTION public.is_admin_email() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_email() TO service_role;
