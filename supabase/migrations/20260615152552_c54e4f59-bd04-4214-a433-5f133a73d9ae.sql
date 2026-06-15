ALTER TABLE public.client_sites ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Preserve existing order: assign display_order based on created_at DESC (newest first)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS new_order
  FROM public.client_sites
)
UPDATE public.client_sites
SET display_order = ranked.new_order
FROM ranked
WHERE public.client_sites.id = ranked.id;

-- Create index for fast ordering
CREATE INDEX idx_client_sites_display_order ON public.client_sites(display_order);