## MuchBetterWorld — Single-page Site Plan

A professional one-page site at `/` with a sticky top navigation whose tabs smooth-scroll to in-page sections. Hero features the headline "Better solutions. Much better World." with a continuously spinning Earth animation behind it.

### Sections (all on `src/routes/index.tsx`)
1. **Hero** — spinning Earth behind heading + sub-tagline + primary CTA ("Get in touch")
2. **About** — short story / mission of MuchBetterWorld
3. **Services** — three cards:
   - Business Analysis
   - Consulting
   - Website Development
4. **Process / Approach** — 3–4 step workflow (Discover → Analyze → Build → Support)
5. **Why Us** — credibility points (results-driven, transparent, partnership)
6. **Contact** — simple contact form (name, email, message) + email link
7. **Footer** — copyright, small nav repeat

### Top Navigation (tabs)
Sticky header with: About · Services · Process · Why Us · Contact. Each tab is an anchor link that smooth-scrolls to its section id. Active tab highlights based on scroll position. Mobile: collapses to a hamburger sheet.

### Spinning Earth (behind hero heading)
A pure-CSS animated globe layered behind the H1:
- Circular gradient sphere (ocean blues) with a repeating continents background image
- `@keyframes spin` rotating the texture horizontally on infinite linear loop (~40s)
- Soft inner shadow for sphere depth, soft outer glow for atmosphere
- Positioned absolute, centered behind the heading, ~480px on desktop / ~280px mobile
- `pointer-events-none`, `aria-hidden`, and `prefers-reduced-motion` disables the spin
- Heading sits above with `z-10`; subtle backdrop so text stays readable

No 3D library needed — keeps it lightweight and SSR-safe. (If later you want a true 3D globe with three.js we can swap it in.)

### Design Direction
- Professional, modern, trustworthy. Cool blue/teal accents evoking the globe, generous whitespace, clean sans-serif typography.
- Semantic tokens added to `src/styles.css` (primary deep blue, accent teal, soft surface). No hardcoded colors in components.
- Subtle fade-in / scale-in on section reveal using existing animation utilities.

### Technical Details
- Edit `src/routes/index.tsx` only (plus `src/styles.css` for tokens and the spin keyframe).
- New components in `src/components/site/`: `SiteHeader.tsx`, `SpinningEarth.tsx`, `Hero.tsx`, `About.tsx`, `Services.tsx`, `Process.tsx`, `WhyUs.tsx`, `Contact.tsx`, `SiteFooter.tsx`.
- Smooth scrolling via `html { scroll-behavior: smooth }` + `scroll-margin-top` on each section to offset the sticky header.
- Active-tab detection with `IntersectionObserver`.
- Contact form is presentational (logs / toast on submit). Wiring it to email delivery would need Lovable Cloud — not included unless you ask.
- SEO: update page `head()` with title "MuchBetterWorld — Better solutions. Much better World." and a one-sentence meta description; single H1 in the hero; semantic `<section>` tags with ids.

### Out of Scope (ask if you want these)
- Real form submission / email delivery (needs Lovable Cloud)
- True WebGL 3D globe
- Multi-page routing, blog, or CMS
- Light/dark theme toggle