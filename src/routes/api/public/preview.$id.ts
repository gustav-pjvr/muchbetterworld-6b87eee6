import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/preview/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Try png first, then jpg
        for (const ext of ["png", "jpg"]) {
          const { data, error } = await supabaseAdmin.storage
            .from("client-previews")
            .download(`${id}.${ext}`);
          if (!error && data) {
            const buf = new Uint8Array(await data.arrayBuffer());
            return new Response(buf, {
              status: 200,
              headers: {
                "Content-Type": ext === "jpg" ? "image/jpeg" : "image/png",
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }

        return new Response("Not found", { status: 404 });
      },
    },
  },
});
