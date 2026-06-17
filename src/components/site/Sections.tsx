import { useState } from "react";
import { z } from "zod";
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
import SideRays from "@/components/ui/SideRays";
import { Highlighter } from "@/components/ui/Highlighter";

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
          highlight="Better Businesses Through Better Solutions"
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
          <Card className="p-10 border-border text-center bg-card">
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
            <Card key={s.title} className="p-8 border-border hover:shadow-lg hover:-translate-y-1 transition-all group cursor-default bg-card h-full">
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
            <li key={s.title} className="relative h-full">
              <div className="relative rounded-2xl p-6 bg-card h-full">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shadow z-10">
                  {i + 1}
                </div>
                <s.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
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
            <div key={p.title} className="rounded-2xl p-8 bg-primary-foreground/5 h-full">
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

const PROJECT_TYPES = [
  "business-analysis",
  "consulting",
  "website-development",
  "custom-solution",
] as const;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name (min 2 characters)." })
    .max(120, { message: "Name must be 120 characters or fewer." })
    .regex(/^[\p{L}\p{M}''\-.\s]+$/u, {
      message: "Name can only contain letters, spaces, hyphens and apostrophes.",
    }),
  company: z
    .string()
    .trim()
    .min(1, { message: "Company is required." })
    .max(120, { message: "Company must be 120 characters or fewer." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .max(255, { message: "Email must be 255 characters or fewer." })
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." })
    .max(40, { message: "Phone number must be 40 characters or fewer." })
    .regex(/^\+?[0-9\s().\-]{7,}$/, {
      message: "Please enter a valid phone number.",
    }),
  projectType: z.enum(PROJECT_TYPES, {
    errorMap: () => ({ message: "Please select a project type." }),
  }),
  message: z
    .string()
    .trim()
    .max(4000, { message: "Message must be 4000 characters or fewer." })
    .optional()
    .or(z.literal("")),
});

export function Contact() {
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [projectType, setProjectType] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof contactSchema>, string>>>({});
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      name: String(fd.get("name") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      projectType: projectType,
      message: String(fd.get("message") ?? "").trim(),
    };
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "Please fix the errors and try again.");
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setProjectType("");
      setSubmittedName(parsed.data.name);
      setConfirmOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32 bg-background overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1.0}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6">
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
        <Card className="p-8 border-border bg-card">
          <h3 className="mb-6 text-2xl font-semibold text-foreground">Send Us a Message</h3>
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" required maxLength={120} autoComplete="name" aria-invalid={!!errors.name} className="mt-2" placeholder="Your name" />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="company">Company <span className="text-destructive">*</span></Label>
                <Input id="company" name="company" required maxLength={120} autoComplete="organization" aria-invalid={!!errors.company} className="mt-2" placeholder="Company name" />
                {errors.company && <p className="mt-1 text-sm text-destructive">{errors.company}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" required maxLength={255} autoComplete="email" aria-invalid={!!errors.email} className="mt-2" placeholder="you@company.com" />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" aria-invalid={!!errors.phone} className="mt-2" placeholder="+27 67 833 7199" />
                {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="project-type">Project Type <span className="text-destructive">*</span></Label>
              <Select name="projectType" value={projectType} onValueChange={setProjectType} required>
                <SelectTrigger id="project-type" aria-invalid={!!errors.projectType} className="mt-2 w-full">
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-analysis">Business Analysis</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="website-development">Website Development</SelectItem>
                  <SelectItem value="custom-solution">Custom Solution</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="mt-1 text-sm text-destructive">{errors.projectType}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea id="message" name="message" rows={5} maxLength={4000} aria-invalid={!!errors.message} className="mt-2" placeholder="Tell us about your goals…" />
              {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending…" : "Start a Conversation"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Message received</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {submittedName ? `Thanks, ${submittedName}!` : "Thanks!"} We&apos;ve received your
              message and a confirmation has been sent to your inbox. Gustav will be in touch
              shortly at gustav@muchbetter.world or +27 67 833 7199.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setConfirmOpen(false)} size="lg">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
