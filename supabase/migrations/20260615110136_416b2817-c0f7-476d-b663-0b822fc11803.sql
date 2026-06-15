ALTER TABLE public.client_sites
  ADD COLUMN IF NOT EXISTS preview_url text,
  ADD COLUMN IF NOT EXISTS preview_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS preview_error text,
  ADD COLUMN IF NOT EXISTS preview_updated_at timestamptz;