# Phase 5 — Guided tour

**Size:** S · **Depends on:** Phases 2–4 · **Status:** Done

## Goal

A five-step walkthrough that takes a first-time visitor through the best parts of
the demo without them having to explore.

## Why it matters for the pitch

Whoever opens this at iHR will give it two or three minutes. Left alone they
might land on an empty screen and close the tab. The tour guarantees they see
the payroll run, the recruiter swipe, and the compliance hub — the three things
worth hiring you for.

## Scope

**In**

- A dismissible "Take the tour" prompt on first visit to `/console`, remembered
  per browser in `localStorage`.
- Five steps: dashboard → run payroll → pipeline / recruiter swipe → compliance
  hub → the candidate app. Each step: one sentence, a highlighted element, and
  Next / Skip.
- Restart from the Demo menu, next to "Reset demo data".
- Progress persists, so a refresh mid-tour resumes rather than restarts.

**Out**

- A video or animated intro — too heavy for a static site and quickly stale.

## Files

```
components/tour/tour-provider.tsx    step state, storage, restart
components/tour/tour-popover.tsx     the bubble, anchored to a target element
lib/dict/tour.ts                     step copy, bilingual
```

Anchor by `data-tour="payroll-cta"` attributes rather than CSS selectors, so
restyling does not silently break the tour.

## UX notes

- Steps must be skippable at every point, and Escape ends the tour.
- The bubble must flip sides in RTL and stay inside the viewport on mobile.
- Keep the copy to one short sentence per step, written for an HR reader rather
  than a developer.
- Never block interaction: the tour points at things, it does not trap focus in
  a modal the reviewer cannot escape.

## Acceptance criteria

- [x] A fresh browser profile lands on `/console` and is offered the tour.
- [x] All five steps land on the right elements in both languages.
- [x] Tour state survives refresh; restart works from the Demo menu.
- [x] Dismissing is remembered and never nags again.
- [x] `npm run typecheck && npm run build` pass.

