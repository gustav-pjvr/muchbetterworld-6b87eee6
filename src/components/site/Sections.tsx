import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BarChart3,
  Lightbulb,
  Code2,
  Search,
  ClipboardCheck,
  Rocket,
  LifeBuoy,
  ShieldCheck,
  Handshake,
  TrendingUp,
  Mail,
} from "lucide-react";

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center mb-14">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="About"
          title="Smarter strategy. Sharper execution."
          intro="MuchBetterWorld partners with ambitious teams to unlock growth through clear analysis, pragmatic consulting, and beautifully built websites — all under one roof."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "10+", l: "Years of combined experience" },
            { n: "60+", l: "Projects delivered globally" },
            { n: "100%", l: "Focused on measurable outcomes" },
          ].map((s) => (
            <Card key={s.l} className="p-8 text-center border-border">
              <div className="text-4xl font-semibold text-primary">{s.n}</div>
              <div className="mt-2 text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const services = [
    {
      icon: BarChart3,
      title: "Business Analysis",
      desc: "Deep-dive audits, data modeling, and requirements that turn complex operations into clear decisions.",
    },
    {
      icon: Lightbulb,
      title: "Consulting",
      desc: "Strategic advisory across product, process, and go-to-market — grounded in evidence, focused on impact.",
    },
    {
      icon: Code2,
      title: "Website Development",
      desc: "Performant, conversion-focused websites and web apps built with modern stacks and clean design.",
    },
  ];
  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Services"
          title="Three disciplines. One outcome."
          intro="We combine analysis, consulting, and development so your strategy and your software finally pull in the same direction."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card
              key={s.title}
              className="p-8 border-border hover:shadow-lg transition-shadow group"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { icon: Search, title: "Discover", desc: "We listen, audit, and map the real problem before proposing a solution." },
    { icon: ClipboardCheck, title: "Analyze", desc: "Data and stakeholder insight shape a focused, prioritized plan." },
    { icon: Rocket, title: "Build", desc: "We deliver in tight iterations — strategy, systems, or shipped software." },
    { icon: LifeBuoy, title: "Support", desc: "Ongoing measurement and refinement so results compound over time." },
  ];
  return (
    <section id="process" className="scroll-mt-24 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Process"
          title="A clear path from idea to impact."
        />
        <ol className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border p-6 bg-card">
              <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shadow">
                {i + 1}
              </div>
              <s.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhyUs() {
  const points = [
    { icon: TrendingUp, title: "Results-driven", desc: "Every recommendation ties back to a measurable business outcome." },
    { icon: ShieldCheck, title: "Transparent", desc: "Clear scope, honest tradeoffs, no jargon-filled surprises." },
    { icon: Handshake, title: "True partnership", desc: "We work alongside your team — not above it, not around it." },
  ];
  return (
    <section id="why-us" className="scroll-mt-24 py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why us</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            The kind of partner you actually want around.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-primary-foreground/15 p-8 bg-primary-foreground/5">
              <p.icon className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-primary-foreground/80">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thanks! We'll be in touch shortly.");
    }, 600);
  };
  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something much better."
          intro="Tell us a little about your project. We'll reply within one business day."
        />
        <Card className="p-8 border-border">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="message">How can we help?</Label>
              <Textarea id="message" name="message" required rows={5} className="mt-2" placeholder="A few lines about your goals…" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href="mailto:hello@muchbetterworld.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hello@muchbetterworld.com
              </a>
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MuchBetterWorld. All rights reserved.</p>
        <p>Better solutions. Much better World.</p>
      </div>
    </footer>
  );
}
