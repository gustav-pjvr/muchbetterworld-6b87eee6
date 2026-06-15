import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart3,
  Lightbulb,
  Code2,
  Search,
  ClipboardCheck,
  Rocket,
  ShieldCheck,
  Handshake,
  TrendingUp,
  
  Eye,
  Wrench,
  Puzzle,
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
          title="Building Better Businesses Through Better Solutions"
          intro="MuchBetter helps organizations identify opportunities, solve operational challenges, and implement digital solutions."
        />
        <div className="mx-auto max-w-4xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            We combine business analysis, strategic consulting, and modern website development
            to help businesses adapt, grow, and thrive in a rapidly changing world.
          </p>
          <p>
            Whether you&apos;re a startup looking for direction or an established company seeking
            efficiency, we work closely with your team to transform ideas into practical outcomes.
          </p>
        </div>
        <div className="mt-14 mx-auto max-w-3xl">
          <Card className="p-10 border-border text-center">
            <Eye className="h-7 w-7 text-accent mx-auto" />
            <h3 className="mt-5 text-2xl font-semibold text-foreground">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Making your business better. Much Better. We exist to give every organization
              the clarity, tools, and digital craftsmanship needed to reach its full potential
              and create lasting, meaningful growth.
            </p>
          </Card>
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
      desc: "We identify inefficiencies, uncover opportunities, and provide data-driven recommendations that improve performance.",
    },
    {
      icon: Lightbulb,
      title: "Consulting",
      desc: "Expert guidance to help organizations navigate challenges and make confident decisions.",
    },
    {
      icon: Code2,
      title: "Website Development",
      desc: "Modern websites designed to strengthen your brand and support your business goals.",
    },
    {
      icon: Puzzle,
      title: "Custom Solutions",
      desc: "Every organization is unique. We create tailored solutions that align with your objectives, challenges, and budget.",
    },
  ];
  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Services"
          title="Better solutions for every stage of growth."
          intro="Strategy, analysis, and digital delivery brought together around your business goals."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card
              key={s.title}
              className="p-8 border-border hover:shadow-lg hover:-translate-y-1 transition-all group cursor-default"
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
    { icon: Search, title: "Discover", desc: "We take time to understand your business, objectives, challenges, and opportunities through collaborative discussions and research." },
    { icon: ClipboardCheck, title: "Analyze", desc: "Our team evaluates your current processes, systems, and requirements to identify areas where improvements can create meaningful impact." },
    { icon: Lightbulb, title: "Strategize", desc: "We develop a clear roadmap with practical recommendations, defined priorities, and achievable milestones tailored to your goals." },
    { icon: Rocket, title: "Implement", desc: "Solutions are put into action through careful execution, development, and project support to ensure successful delivery." },
    { icon: Wrench, title: "Optimize", desc: "We measure outcomes, gather feedback, and continuously refine solutions to maximize long-term value and performance." },
  ];
  return (
    <section id="process" className="scroll-mt-24 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Process"
          title="How We Work"
        />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
    { icon: TrendingUp, title: "Results-Focused", desc: "Everything we do is designed to create measurable business value and meaningful outcomes." },
    { icon: Wrench, title: "Practical Solutions", desc: "We deliver recommendations and solutions that are realistic, achievable, and aligned with your organization's needs." },
    { icon: Code2, title: "Technology + Strategy", desc: "Our approach combines business expertise with modern digital capabilities to drive innovation and growth." },
    { icon: Handshake, title: "Collaborative Approach", desc: "We work closely with your team throughout every stage of the project, ensuring transparency and alignment." },
    { icon: Puzzle, title: "Tailored Service", desc: "Every business is different. We customize our solutions to fit your specific objectives and challenges." },
    { icon: ShieldCheck, title: "Long-Term Partnership", desc: "We aim to build lasting relationships by supporting your organization beyond project completion." },
  ];
  return (
    <section id="why-us" className="scroll-mt-24 py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why us</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Why Choose MuchBetter?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      projectType: String(fd.get("projectType") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setSubmittedName(payload.name);
      setConfirmOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };
  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Lets make something better, much better."
        />
        <div className="mb-10 text-center">
          <h3 className="text-xl font-semibold text-foreground">Get In Touch</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <a href="mailto:gustav@muchbetter.world" className="hover:text-foreground">Email: gustav@muchbetter.world</a>
            <a href="tel:+27678337199" className="hover:text-foreground">Phone: +27 67 833 7199</a>
            <span>Location: South Africa</span>
          </div>
        </div>
        <Card className="p-8 border-border">
          <h3 className="mb-6 text-2xl font-semibold text-foreground">Send Us a Message</h3>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" className="mt-2" placeholder="Company name" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required className="mt-2" placeholder="you@company.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-2" placeholder="+27" />
              </div>
            </div>
            <div>
              <Label htmlFor="project-type">Project Type</Label>
              <Select name="projectType">
                <SelectTrigger id="project-type" className="mt-2 w-full">
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-analysis">Business Analysis</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="website-development">Website Development</SelectItem>
                  <SelectItem value="custom-solution">Custom Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required rows={5} className="mt-2" placeholder="Tell us about your goals…" />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending…" : "Start a Conversation"}
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
        <p>© {new Date().getFullYear()} MuchBetter. All rights reserved.</p>
        <p>Better solutions. Much better World.</p>
      </div>
    </footer>
  );
}
