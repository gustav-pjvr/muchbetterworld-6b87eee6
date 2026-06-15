import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2, Globe2 } from "lucide-react";
import { toast } from "sonner";

type ClientSite = {
  id: string;
  name: string;
  url: string;
  description: string | null;
  preview_url: string | null;
  preview_status: string;
  display_order: number;
};

export function ClientShowcaseButton() {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<ClientSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ClientSite | null>(null);

  useEffect(() => {
    supabase
      .from("client_sites")
      .select("id,name,url,description,preview_url,preview_status")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load clients");
        setSites((data as ClientSite[]) ?? []);
      });
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("client_sites")
      .select("id,name,url,description,preview_url,preview_status")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load clients");
        setSites((data as ClientSite[]) ?? []);
        setLoading(false);
      });
  }, [open]);

  if (sites.length === 0) return null;

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
                    className="w-full text-left py-3 px-2 rounded hover:bg-secondary transition-colors flex gap-3 items-center cursor-pointer"
                  >
                    <div className="w-20 h-14 shrink-0 rounded border border-border bg-secondary/40 overflow-hidden">
                      {s.preview_url && s.preview_status === "ready" ? (
                        <img src={s.preview_url} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground">{s.name}</div>
                      {s.description && (
                        <div className="mt-1 text-sm text-muted-foreground line-clamp-1">{s.description}</div>
                      )}
                    </div>
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
  return (
    <Dialog open={!!site} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{site?.name}</DialogTitle>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary/40 overflow-hidden min-h-[280px] flex items-center justify-center">
          {site?.preview_url && site.preview_status === "ready" ? (
            <img src={site.preview_url} alt={`Preview of ${site.name}`} className="w-full h-auto" />
          ) : site?.preview_status === "pending" ? (
            <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              Preview is being captured…
            </div>
          ) : (
            <p className="p-6 text-sm text-muted-foreground text-center">
              No preview available yet.
            </p>
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
