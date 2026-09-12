# iHR Platform concept demo — build phases

A plan for turning the Masari job-swipe app into a Gusto-style HR platform demo,
branded with iHR's colors, to pitch [ihr.sa](https://ihr.sa) for freelance work.

Each phase has its own file. Phases 1–5 are the minimum needed to send the demo;
6–7 are stretch; 8 packages it for sending.

| Phase | File | Status | Size |
| --- | --- | --- | --- |
| 0 · Rebrand & foundation | (this file, below) | **Done** | M |
| 1 · Marketing homepage | [phase-1-marketing-site.md](phase-1-marketing-site.md) | **Done** | M |
| 2 · People & payroll | [phase-2-people-and-payroll.md](phase-2-people-and-payroll.md) | **Done** | L |
| 3 · Hiring | [phase-3-hiring.md](phase-3-hiring.md) | **Done** | L |
| 4 · Compliance hub | [phase-4-compliance-hub.md](phase-4-compliance-hub.md) | **Done** | M |
| 5 · Guided tour | [phase-5-guided-tour.md](phase-5-guided-tour.md) | **Done** | S |
| 6 · Remaining HR modules | [phase-6-hr-modules.md](phase-6-hr-modules.md) | **Done** | L |
| 7 · Employee self-service | [phase-7-employee-self-service.md](phase-7-employee-self-service.md) | **Done** | M |
| 8 · Packaging & pitch | [phase-8-packaging.md](phase-8-packaging.md) | **Done** | S |

## The product, in one line

Two sides of one platform: an **employer console** (Gusto-style: people, payroll,
hiring, compliance) and the existing **candidate app** (swipe to apply), mapped
onto iHR's real product line — iHR Platform, iHR Recruiter, iHR Jobs, iHR Vision.

## Phase 0 — what already exists

**Brand**

- iHR palette in [`app/globals.css`](../../app/globals.css): primary `#7A0C0C`,
  accent `#B62B46`, secondary `#FFF1F4`, neutral `#EAEAEA`, taken from the
  Elementor global kit on ihr.sa.
- `--brand` / `--brand-deep` stay maroon in both themes, for full-bleed
  surfaces (hero, sidebar) and footers. `success` / `warning` / `destructive`
  are status colors only — never brand decoration.
- **Zain** (the typeface ihr.sa uses) via `next/font/google`, Arabic + Latin.
- Arabic-first: `<html lang="ar" dir="rtl">`, and the i18n default is `ar`.
  An inline script applies a saved English preference before paint.
- A typographic `iHR` mark, deliberately **not** a copy of iHR's logo, plus a
  disclaimer component naming this an unofficial concept demo with fictional data.

**Structure**

```
app/(marketing)/page.tsx   →  /          demo hub (Phase 1 grows this into the homepage)
app/(candidate)/…          →  /jobs, /discover, /matches, /chat, /interviews, /profile
app/console/…              →  /console   employer console (sidebar shell + dashboard)
```

Route groups keep the candidate URLs unchanged; only the old `/` landing moved
to `/jobs`.

**Demo data**

- A fictional company, Wadi Al-Noor Trading Co., with 25 employees
  ([`lib/hr/seed.ts`](../../lib/hr/seed.ts)): 15 Saudi, 10 expat, one person
  onboarding, one on leave, five Iqamas expiring or expired.
- Dates are stored as **offsets from today**, so "expires in 12 days" stays true
  whenever the demo is opened.
- State lives in [`lib/hr/store.tsx`](../../lib/hr/store.tsx) under
  `ihr.hr.v1`, separate from the candidate store (`masari.state.v1`).

## Conventions every later phase follows

- **Strings**: add a dictionary file in `lib/dict/`, merge it in
  [`lib/i18n.tsx`](../../lib/i18n.tsx). Every string is bilingual. Use
  `fill(t('key'), { name })` for placeholders.
- **Numbers and dates**: use [`lib/hr/format.ts`](../../lib/hr/format.ts) —
  `formatSAR`, `formatPercent`, `formatDays`, `formatDate`, `formatHijri`.
  Arabic renders Arabic-Indic digits; Gregorian dates in Arabic need
  `-u-ca-gregory` because `ar-SA` defaults to Umm al-Qura.
- **Dates in data**: local ISO (`yyyy-mm-dd`) via `lib/hr/dates.ts`. Never
  `toISOString()` — it shifts the day in UTC+3.
- **New console module**: add its `href` to
  [`components/console/console-nav.ts`](../../components/console/console-nav.ts)
  to turn the "Soon" label into a link.
- **Static export**: `output: 'export'`, no server code, no route handlers. Every
  dynamic route needs `generateStaticParams`. Downloads are client-side Blobs.
- **State**: extend the HR store with actions; bump `KEY` to `ihr.hr.v2` when the
  shape changes so stale saved data is discarded.
- **Rendering**: console pages render only after the store loads, so
  `useHr()` is safe and there is no hydration mismatch from date math.
- **RTL**: use logical classes (`ps-`, `me-`, `start-0`) and mirror directional
  icons with `rtl:-scale-x-100`. Check every screen in both directions.
- **Honesty**: fictional data everywhere; Saudi rules shown as *illustrative*,
  never as legal or actuarial fact.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # static export to ./out
```
