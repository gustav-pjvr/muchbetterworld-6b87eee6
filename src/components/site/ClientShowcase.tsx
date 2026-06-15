import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { previewSite } from "@/lib/firecrawl.functions";
import { ExternalLink, Loader2, Globe2 } from "lucide-react";
import { toast } from "sonner";

type ClientSite = {
  id: string;
  name: string;
  url: string;
  description: string | null;
};

export function ClientShowcaseButton() {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<ClientSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ClientSite | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("client_sites")
      .select("id,name,url,description")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load clients");
        setSites((data as ClientSite[]) ?? []);
        setLoading(false);
      });
  }, [open]);

  return (
    <>
      <Button size="lg" variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Globe2 className="h-4 w-4" /> View our work
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Some of our clients</DialogTitle>
            <DialogDescription>
              A selection of websites built by MuchBetter.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sites.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Client showcase coming soon.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {sites.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s)}
                    className="w-full text-left py-3 px-2 rounded hover:bg-secondary transition-colors"
                  >
                    <div className="font-medium text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.url}</div>
                    {s.description && (
                      <div className="mt-1 text-sm text-muted-foreground">{s.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <PreviewDialog site={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function PreviewDialog({ site, onClose }: { site: ClientSite | null; onClose: () => void }) {
  const fetchPreview = useServerFn(previewSite);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!site) {
      setScreenshot(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setScreenshot(null);
    fetchPreview({ data: { url: site.url } })
      .then((r) => {
        if (!r.ok) setError(r.error || "Couldn't load preview");
        else setScreenshot(r.screenshot ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't load preview"))
      .finally(() => setLoading(false));
  }, [site, fetchPreview]);

  return (
    <Dialog open={!!site} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{site?.name}</DialogTitle>
          <DialogDescription className="truncate">{site?.url}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
          {!loading && error && (
            <p className="p-6 text-sm text-muted-foreground text-center">{error}</p>
          )}
          {!loading && screenshot && (
            <img src={screenshot} alt={`Preview of ${site?.name}`} className="w-full h-auto" />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {site && (
            <Button asChild className="gap-2">
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                Visit website <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
