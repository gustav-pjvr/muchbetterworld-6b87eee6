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
import { Loader2, Trash2, LogOut, RefreshCw, Check, Mail, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmailDashboard, retryFailedEmail, type EmailDashboardData } from "@/lib/email-admin.functions";

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
  display_order: number;
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

      <EmailDashboard />

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

const RANGES: { id: "24h" | "7d" | "30d"; label: string; hours: number }[] = [
  { id: "24h", label: "Last 24h", hours: 24 },
  { id: "7d", label: "7 days", hours: 24 * 7 },
  { id: "30d", label: "30 days", hours: 24 * 30 },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "sent")
    return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" variant="outline">Sent</Badge>;
  if (s === "dlq" || s === "failed" || s === "bounced")
    return <Badge variant="destructive" className="text-xs">{s === "dlq" ? "Failed" : s.charAt(0).toUpperCase() + s.slice(1)}</Badge>;
  if (s === "suppressed" || s === "complained")
    return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" variant="outline">{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>;
  if (s === "pending")
    return <Badge variant="outline" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" />Pending</Badge>;
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

function EmailDashboard() {
  const fetchFn = useServerFn(getEmailDashboard);
  const retryFn = useServerFn(retryFailedEmail);
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "custom">("7d");
  const [customFrom, setCustomFrom] = useState<string>(() =>
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [customTo, setCustomTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [template, setTemplate] = useState<string>("__all__");
  const [status, setStatus] = useState<string>("__all__");
  const [data, setData] = useState<EmailDashboardData | null>(null);
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeRange = () => {
    if (range === "custom") {
      const since = new Date(customFrom + "T00:00:00").toISOString();
      const until = new Date(customTo + "T23:59:59.999").toISOString();
      return { since, until };
    }
    const hours = RANGES.find((r) => r.id === range)!.hours;
    return {
      since: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
      until: new Date().toISOString(),
    };
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { since, until } = computeRange();
      const r = await fetchFn({
        data: {
          sinceIso: since,
          untilIso: until,
          template: template === "__all__" ? null : template,
          status: status === "__all__" ? null : status,
          limit: 50,
        },
      });
      setData(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, customFrom, customTo, template, status]);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Email activity</h2>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Deduplicated by message — each email is counted once with its latest status.
      </p>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <Button
              key={r.id}
              size="sm"
              variant={range === r.id ? "default" : "outline"}
              onClick={() => setRange(r.id)}
            >
              {r.label}
            </Button>
          ))}
          <Button size="sm" variant={range === "custom" ? "default" : "outline"} onClick={() => setRange("custom")}>
            Custom
          </Button>
        </div>

        {range === "custom" && (
          <div className="flex items-end gap-2">
            <div>
              <Label htmlFor="from" className="text-xs">From</Label>
              <Input id="from" type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-9" />
            </div>
            <div>
              <Label htmlFor="to" className="text-xs">To</Label>
              <Input id="to" type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-9" />
            </div>
          </div>
        )}

        <div className="min-w-[180px]">
          <Label className="text-xs">Template</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All templates</SelectItem>
              {(data?.templates ?? []).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[160px]">
          <Label className="text-xs">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="suppressed">Suppressed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={data?.stats.total ?? 0} loading={loading} />
        <StatCard label="Sent" value={data?.stats.sent ?? 0} tone="success" loading={loading} />
        <StatCard label="Failed" value={data?.stats.failed ?? 0} tone="danger" loading={loading} />
        <StatCard label="Suppressed" value={data?.stats.suppressed ?? 0} tone="warning" loading={loading} />
      </div>

      {/* Log table */}
      <div className="mt-6 rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Template</th>
                <th className="text-left p-3 font-medium">Recipient</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">When</th>
                <th className="text-right p-3 font-medium w-px"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {error ? (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-destructive">{error}</td></tr>
              ) : loading && !data ? (
                <tr><td colSpan={4} className="p-6 text-center"><Loader2 className="h-4 w-4 animate-spin inline text-muted-foreground" /></td></tr>
              ) : !data || data.rows.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No emails in this range.</td></tr>
              ) : (
                data.rows.map((r) => {
                  const isFailed = r.status === "dlq" || r.status === "failed" || r.status === "bounced";
                  const canRetry = isFailed && !!r.message_id;
                  const busy = !!(r.message_id && retrying[r.message_id]);
                  const handleRetry = async () => {
                    if (!r.message_id) return;
                    setRetrying((m) => ({ ...m, [r.message_id!]: true }));
                    try {
                      const res = await retryFn({ data: { messageId: r.message_id } });
                      if (res.ok) toast.success(`Re-queued for delivery (${res.queue})`);
                      else toast.error(res.reason || "Could not retry");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Retry failed");
                    } finally {
                      setRetrying((m) => ({ ...m, [r.message_id!]: false }));
                      load();
                    }
                  };
                  return (
                    <tr key={r.id} className="hover:bg-secondary/30">
                      <td className="p-3 font-medium">{r.template_name}</td>
                      <td className="p-3 text-muted-foreground truncate max-w-[220px]" title={r.recipient_email}>{r.recipient_email}</td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={r.status} />
                          {r.error_message && isFailed && (
                            <span className="text-xs text-destructive truncate max-w-[260px]" title={r.error_message}>{r.error_message}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{fmtTime(r.created_at)}</td>
                      <td className="p-3">
                        {canRetry ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRetry}
                            disabled={busy}
                            className="gap-1 h-8"
                            title={r.status === "bounced" ? "Bounced addresses rarely succeed on retry" : "Re-queue this email for delivery"}
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
                            {busy ? "Retrying…" : "Retry"}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {data && data.rows.length >= 50 && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
            Showing the 50 most recent matches. Narrow the filters to see more.
          </div>
        )}
      </div>
    </Card>
  );
}

function StatCard({
  label,
  value,
  tone,
  loading,
}: {
  label: string;
  value: number;
  tone?: "success" | "danger" | "warning";
  loading?: boolean;
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
        ? "text-destructive"
        : tone === "warning"
          ? "text-amber-600 dark:text-amber-400"
          : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${toneClass}`}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : value}
      </div>
    </div>
  );
}
