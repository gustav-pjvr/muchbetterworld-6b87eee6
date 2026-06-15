
CREATE TABLE public.client_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_sites TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.client_sites TO authenticated;
GRANT ALL ON public.client_sites TO service_role;

ALTER TABLE public.client_sites ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce((auth.jwt() ->> 'email')::text, '')) IN ('gustavpjvr@gmail.com', 'jacojvr@gmail.com')
$$;

CREATE POLICY "Anyone can view client sites"
  ON public.client_sites FOR SELECT
  USING (true);

CREATE POLICY "Admin emails can insert client sites"
  ON public.client_sites FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_email());

CREATE POLICY "Admin emails can update client sites"
  ON public.client_sites FOR UPDATE
  TO authenticated
  USING (public.is_admin_email())
  WITH CHECK (public.is_admin_email());

CREATE POLICY "Admin emails can delete client sites"
  ON public.client_sites FOR DELETE
  TO authenticated
  USING (public.is_admin_email());
