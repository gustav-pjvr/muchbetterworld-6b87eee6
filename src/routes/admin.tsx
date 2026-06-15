import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { capturePreview } from "@/lib/client-sites.functions";
import { getActiveTheme, setActiveTheme } from "@/lib/site-settings.functions";
import { THEMES, type ThemeId, isThemeId } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Trash2, LogOut, RefreshCw, Check } from "lucide-react";

const ADMIN_EMAILS = ["gustavpjvr@gmail.com", "jacojvr@gmail.com"];

type ClientSite = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  preview_url: string | null;
  preview_status: string;
  preview_error: string | null;
  preview_updated_at: string | null;
};

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — MuchBetter" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    // 1. Instant restore from persisted localStorage session — no flash of the login screen.
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
        setChecking(false);
      }
      // 2. Then revalidate with the Auth server in the background.
      supabase.auth.getUser().then(({ data: userData, error }) => {
        if (cancelled) return;
        if (!error) setEmail(userData.user?.email ?? null);
        setChecking(false);
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) toast.error("Sign-in failed");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setEmail(null);
    navigate({ to: "/" });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isAllowed = email && ADMIN_EMAILS.includes(email.toLowerCase());

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <Toaster />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          {email && (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          )}
        </div>

        {!email ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-6">
              Sign in with your authorized Google account to continue.
            </p>
            <Button onClick={handleSignIn} size="lg">Sign in with Google</Button>
          </Card>
        ) : !isAllowed ? (
          <Card className="p-8 text-center">
            <p className="font-medium">Access denied</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {email} is not an authorized admin account.
            </p>
            <Button onClick={handleSignOut} variant="outline" className="mt-6">
              Sign out
            </Button>
          </Card>
        ) : (
          <AdminContent email={email} />
        )}
      </div>
    </div>
  );
}

function AdminContent({ email }: { email: string }) {
  const [sites, setSites] = useState<ClientSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState<Record<string, boolean>>({});
  const captureFn = useServerFn(capturePreview);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_sites")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setSites((data as ClientSite[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Poll while any site is pending
  useEffect(() => {
    const anyPending = sites.some((s) => s.preview_status === "pending");
    if (!anyPending) return;
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [sites]);

  const runCapture = async (siteId: string) => {
    setCapturing((c) => ({ ...c, [siteId]: true }));
    try {
      const r = await captureFn({ data: { siteId } });
      if (r.ok) toast.success("Preview saved");
      else toast.error(r.error || "Preview failed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setCapturing((c) => ({ ...c, [siteId]: false }));
      load();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    setSaving(true);
    const { data: inserted, error } = await supabase
      .from("client_sites")
      .insert({
        name: name.trim(),
        url: finalUrl,
        description: description.trim() || null,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error || !inserted) {
      toast.error(error?.message || "Failed");
      return;
    }
    setName("");
    setUrl("");
    setDescription("");
    toast.success("Client added — capturing preview…");
    await load();
    // Kick off capture in background
    runCapture(inserted.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("client_sites").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Removed");
    load();
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{email}</span></p>

      <ThemePicker />

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Add client site</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Label htmlFor="name">Client / site name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Adding…" : "Add site"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Client sites</h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No client sites yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {sites.map((s) => {
              const busy = capturing[s.id] || s.preview_status === "pending";
              return (
                <li key={s.id} className="py-4 flex items-start gap-3">
                  <div className="w-24 h-16 shrink-0 rounded border border-border bg-secondary/40 overflow-hidden flex items-center justify-center">
                    {s.preview_url && s.preview_status === "ready" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.preview_url} alt="" className="w-full h-full object-cover" />
                    ) : busy ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">no preview</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{s.name}</span>
                      <PreviewBadge status={busy ? "pending" : s.preview_status} />
                    </div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate block">{s.url}</a>
                    {s.description && <div className="mt-1 text-sm text-muted-foreground">{s.description}</div>}
                    {s.preview_status === "failed" && s.preview_error && (
                      <div className="mt-1 text-xs text-destructive">{s.preview_error}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => runCapture(s.id)}
                      disabled={busy}
                      aria-label="Re-scrape preview"
                      title="Re-scrape preview"
                    >
                      <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function PreviewBadge({ status }: { status: string }) {
  if (status === "ready") return <Badge variant="secondary" className="text-xs">Preview ready</Badge>;
  if (status === "pending") return <Badge variant="outline" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Capturing</Badge>;
  if (status === "failed") return <Badge variant="destructive" className="text-xs">Failed</Badge>;
  return <Badge variant="outline" className="text-xs">No preview</Badge>;
}

const THEME_SWATCHES: Record<ThemeId, string[]> = {
  default: ["#0a2540", "#1b4965", "#2a9d8f", "#e0fbfc"],
  bert: ["#0B0C10", "#1F2833", "#45A29E", "#66FCF1"],
  desert: ["#1E2640", "#DC9750", "#E8B884", "#F5EBDD"],
  pieces: ["#1A1A1D", "#4E4E50", "#950740", "#C3073F"],
  curve: ["#2A2420", "#567257", "#896A58", "#D9D8D5"],
};

function ThemePicker() {
  const getFn = useServerFn(getActiveTheme);
  const setFn = useServerFn(setActiveTheme);
  const router = useRouter();
  const [current, setCurrent] = useState<ThemeId>("default");
  const [saving, setSaving] = useState<ThemeId | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFn()
      .then((r) => {
        if (isThemeId(r.theme)) setCurrent(r.theme);
      })
      .finally(() => setLoading(false));
  }, [getFn]);

  const choose = async (id: ThemeId) => {
    if (id === current) return;
    setSaving(id);
    try {
      await setFn({ data: { theme: id } });
      setCurrent(id);
      toast.success("Theme updated");
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(null);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Website color theme</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick the active color palette. The site loads in this theme on every visit.
      </p>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const active = current === t.id;
            const busy = saving === t.id;
            return (
              <button
                key={t.id}
                onClick={() => choose(t.id)}
                disabled={!!saving}
                className={`group relative text-left rounded-xl border p-4 transition-all ${
                  active
                    ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/40"
                } ${saving && !busy ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.label}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                  {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <div className="mt-3 flex h-8 overflow-hidden rounded-md border border-border">
                  {THEME_SWATCHES[t.id].map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
