import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isThemeId, type ThemeId } from "./theme";

const ADMIN_EMAILS = ["gustavpjvr@gmail.com", "jacojvr@gmail.com"];

export const getActiveTheme = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ theme: ThemeId }> => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const { data } = await supabaseAdmin
        .from("site_settings")
        .select("theme")
        .eq("id", 1)
        .maybeSingle();
      const theme = data?.theme;
      return { theme: isThemeId(theme) ? theme : "default" };
    } catch {
      return { theme: "default" };
    }
  },
);

const SetSchema = z.object({
  theme: z.string().refine(isThemeId, "Invalid theme"),
});

export const setActiveTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SetSchema.parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const email = (context.claims as { email?: string } | undefined)?.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.includes(email)) {
      throw new Error("Forbidden");
    }
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ id: 1, theme: data.theme, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
