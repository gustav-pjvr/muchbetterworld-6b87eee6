import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SpinningEarth } from "@/components/site/SpinningEarth";
import { CodeStreams } from "@/components/site/CodeStreams";
import {
  About,
  Services,
  Process,
  WhyUs,
  Contact,
  SiteFooter,
} from "@/components/site/Sections";
import { ClientShowcaseButton } from "@/components/site/ClientShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MuchBetter — Better solutions. Much better World." },
      {
        name: "description",
        content:
          "MuchBetter delivers business analysis, consulting, and website development that turn strategy into measurable results for growing organizations.",
      },
      { property: "og:title", content: "MuchBetter — Better solutions. Much better World." },
      {
        property: "og:description",
        content:
          "MuchBetter delivers business analysis, consulting, and website development that turn strategy into measurable results for growing organizations.",
      },
      { property: "og:url", content: "https://muchbetterworld.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://muchbetterworld.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MuchBetter",
          url: "https://muchbetterworld.lovable.app/",
          description:
            "MuchBetter helps organizations identify opportunities, solve operational challenges, and ship modern digital solutions.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Business Analysis",
          provider: { "@type": "Organization", name: "MuchBetter", url: "https://muchbetterworld.lovable.app/" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Business Consulting",
          provider: { "@type": "Organization", name: "MuchBetter", url: "https://muchbetterworld.lovable.app/" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Website Development",
          provider: { "@type": "Organization", name: "MuchBetter", url: "https://muchbetterworld.lovable.app/" },
        }),
      },
    ],
  }),
  component: Index,
});

function Hero() {
  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section
      id="top"
      className="relative isolate min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      <CodeStreams />
      <SpinningEarth />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <p
          className="animate-hero text-sm font-semibold uppercase tracking-[0.25em] text-accent"
          style={{ animationDelay: "0ms" }}
        >
          MuchBetter
        </p>
        <h1
          className="animate-hero mt-6 text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[1.05]"
          style={{ animationDelay: "120ms" }}
        >
          Better solutions.
          <br />
          <span className="text-primary">Much better World.</span>
        </h1>
        <p
          className="animate-hero mx-auto mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          Business analysis, consulting, and website development — crafted to move
          your organization forward, measurably.
        </p>
        <div
          className="animate-hero mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "380ms" }}
        >
          <Button size="lg" onClick={scrollTo("contact")} className="gap-2">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={scrollTo("services")}>
            Explore services
          </Button>
          <ClientShowcaseButton />
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <WhyUs />
        <Contact />
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}
