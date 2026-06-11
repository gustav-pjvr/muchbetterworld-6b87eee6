import { useEffect, useState } from "react";
import { Menu, X, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "why-us", label: "Why Us" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      // If still in the hero area, clear active
      const hero = document.getElementById("top");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
      if (window.scrollY + 80 < heroBottom) {
        setActive("");
        return;
      }
      let current = "";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.offsetTop <= probe) current = n.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={handleClick("top")}
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <Globe2 className="h-6 w-6 text-accent" />
          <span>MuchBetterWorld</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={handleClick(n.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active === n.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur px-6 py-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={handleClick(n.id)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium",
                active === n.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
