import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  url: z.string().url().max(2048),
});

type PreviewResult = {
  ok: boolean;
  screenshot?: string;
  title?: string;
  description?: string;
  error?: string;
};

export const previewSite = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<PreviewResult> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "Firecrawl is not configured." };
    }

    try {
      const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: data.url,
          formats: ["screenshot"],
          onlyMainContent: true,
        }),
      });

      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; data?: { screenshot?: string; metadata?: { title?: string; description?: string } }; error?: string }
        | null;

      if (!res.ok || !json?.success) {
        return { ok: false, error: json?.error || `Preview failed (${res.status})` };
      }

      return {
        ok: true,
        screenshot: json.data?.screenshot,
        title: json.data?.metadata?.title,
        description: json.data?.metadata?.description,
      };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Preview failed" };
    }
  });
