import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = ["gustavpjvr@gmail.com", "jacojvr@gmail.com"];

const InputSchema = z.object({
  siteId: z.string().uuid(),
});

type Result = { ok: boolean; status: "ready" | "failed"; error?: string; previewUrl?: string };

export const capturePreview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }): Promise<Result> => {
    const email = (context.claims as { email?: string } | undefined)?.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.includes(email)) {
      throw new Error("Forbidden");
    }

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("Firecrawl is not configured.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Load site
    const { data: site, error: siteErr } = await supabaseAdmin
      .from("client_sites")
      .select("id,url")
      .eq("id", data.siteId)
      .single();
    if (siteErr || !site) {
      throw new Error("Site not found");
    }

    // Mark pending
    await supabaseAdmin
      .from("client_sites")
      .update({ preview_status: "pending", preview_error: null })
      .eq("id", site.id);

    const fail = async (error: string): Promise<Result> => {
      await supabaseAdmin
        .from("client_sites")
        .update({
          preview_status: "failed",
          preview_error: error.slice(0, 500),
          preview_updated_at: new Date().toISOString(),
        })
        .eq("id", site.id);
      return { ok: false, status: "failed", error };
    };

    try {
      const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: site.url,
          formats: ["screenshot"],
          onlyMainContent: true,
        }),
      });

      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; data?: { screenshot?: string }; error?: string }
        | null;

      if (!res.ok || !json?.success || !json.data?.screenshot) {
        return await fail(json?.error || `Preview failed (${res.status})`);
      }

      // Download the image bytes from Firecrawl's hosted URL
      const imgRes = await fetch(json.data.screenshot);
      if (!imgRes.ok) {
        return await fail(`Failed to download screenshot (${imgRes.status})`);
      }
      const contentType = imgRes.headers.get("content-type") || "image/png";
      const ext = contentType.includes("jpeg") ? "jpg" : "png";
      const buffer = new Uint8Array(await imgRes.arrayBuffer());

      const path = `${site.id}.${ext}`;
      const { error: uploadErr } = await supabaseAdmin.storage
        .from("client-previews")
        .upload(path, buffer, {
          contentType,
          upsert: true,
          cacheControl: "31536000",
        });
      if (uploadErr) {
        return await fail(uploadErr.message);
      }

      const previewUrl = `/api/public/preview/${site.id}?v=${Date.now()}`;
      await supabaseAdmin
        .from("client_sites")
        .update({
          preview_url: previewUrl,
          preview_status: "ready",
          preview_error: null,
          preview_updated_at: new Date().toISOString(),
        })
        .eq("id", site.id);

      return { ok: true, status: "ready", previewUrl };
    } catch (e) {
      return await fail(e instanceof Error ? e.message : "Preview failed");
    }
  });
