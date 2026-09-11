# Phase 1 — Marketing homepage

**Size:** M · **Depends on:** Phase 0 · **Status:** Done

## Goal

Replace the demo hub at `/` with a real marketing homepage in the style of
gusto.com, rendered in iHR's brand. This is the first screen anyone at iHR sees,
so it carries most of the first impression.

## Why it matters for the pitch

It shows you can build the thing iHR sells to its own customers: a bilingual,
RTL-first product site with a clear value proposition. It also frames the demo —
a reviewer lands here, understands what the platform claims to do, and then walks
into the console to see it working.

## Scope

**In**

- Hero: maroon full-bleed, white type, headline, subhead, two CTAs
  ("Explore the console" → `/console`, "See the job app" → `/jobs`).
- Product sections, one per module, each with a one-line benefit and a visual:
  payroll, people, hiring, time off, compliance. Reuse real screenshots of the
  console once Phase 2–4 exist; use simple mock UI cards before then.
- "Built for Saudi compliance" band: GOSI, WPS/Mudad, Qiwa, Nitaqat, Iqama
  tracking, Arabic-first — as labelled capability chips.
- Pricing: three tiers in SAR per employee per month (Basic / Plus / Premium),
  mirroring Gusto's Simple / Plus / Premium shape. Marked illustrative.
- Social proof section using the *fictional* demo company only.
- Footer in the darker maroon (`--brand-deep`) with the demo disclaimer.
- The role picker from the Phase 0 hub, kept as a "Try the demo" section.

**Out**

- Any real iHR customer names, logos, or testimonials. Inventing those would
  misrepresent a real company — fictional only, and labelled as such.
- Sign-up, contact forms, or anything that collects data.

## Routes & files

```
app/(marketing)/page.tsx        rewrite: hub → full homepage
app/(marketing)/layout.tsx      new: marketing header + footer shell
components/marketing/           new: hero, feature-section, pricing-table, cta-band
lib/dict/marketing.ts           new: all homepage strings, bilingual
```

## UX notes

- Section rhythm alternates: maroon band → light section → blush (`--secondary`)
  section → maroon band. This is how ihr.sa reads.
- Headline sizes need checking in Arabic: Zain's Arabic runs taller and narrower
  than its Latin, so test both before settling type scale.
- Keep the page under ~2500 words total; a pitch site is skimmed, not read.
- Mobile: sections stack, pricing becomes a horizontal snap-scroll of cards.

## Acceptance criteria

- [x] `/` is the homepage; the role picker still reaches `/console` and `/jobs`.
- [x] Reads correctly in Arabic RTL and English LTR, light and dark.
- [x] Pricing, testimonials and stats are visibly marked as illustrative.
- [x] Disclaimer visible in the footer on every marketing page.
- [x] Lighthouse: no contrast failures, all images have alt text.
- [x] `npm run typecheck && npm run build` pass.
