import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, Trash2, LogOut } from "lucide-react";

const ADMIN_EMAILS = ["gustavpjvr@gmail.com", "jacojvr@gmail.com"];

type ClientSite = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  created_at: string;
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    setSaving(true);
    const { error } = await supabase.from("client_sites").insert({
      name: name.trim(),
      url: finalUrl,
      description: description.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    setUrl("");
    setDescription("");
    toast.success("Client added");
    load();
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
            {sites.map((s) => (
              <li key={s.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate block">{s.url}</a>
                  {s.description && <div className="mt-1 text-sm text-muted-foreground">{s.description}</div>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
