# Phase 8 — Packaging & the pitch

**Size:** S · **Depends on:** everything shipped · **Status:** Done

## Goal

Get the demo into a state where it can be sent to iHR: polished, accessible,
documented, and accompanied by something that explains what they are looking at.

## Why it matters

This is the phase that converts work into a hire. A strong demo with a broken
Arabic layout, a stale README, or no explanation lands much worse than it should.

## Scope

### Quality pass

- **RTL and bilingual sweep**: every screen in Arabic and English, light and
  dark, 375px and desktop. Arabic is the default, so it gets checked first.
- **Accessibility**: keyboard-only run through the main flows, visible focus
  rings, labels on every control, contrast check on all status colors. The
  viewport no longer blocks pinch-zoom — keep it that way.
- **Performance**: Lighthouse on the built export; check the Zain font is
  subsetted and the bundle has not ballooned.
- **Empty and loading states** everywhere a reviewer might land first.
- **Console-wide check**: no leftover "Soon" labels for modules that now exist.

### Documentation

- **README rewrite**: the current one is the old Masari emerald branding. It
  needs the new positioning, the two-sided structure, fresh screenshots
  (Arabic-first), the tech stack, and the disclaimer.
- **`docs/for-ihr.md`**: a short page written *for the reviewer* — what this is,
  which of their products each module maps to (Platform, Recruiter, Jobs,
  Vision), what is real and what is mocked, and how long it took.
- **`docs/pitch-message.md`**: tailored Arabic and English pitch outreach copy
  ready for sending to iHR leadership.

### The send

- **Deploy**: confirm the GitHub Pages build is green and the live URL works
  under the `/jobswipe` base path, including deep links and a refresh on a
  nested route.
- **The message to iHR**: short. What it is, the link, one line on why you built
  it for them specifically, and the offer. Attach nothing; link everything.

## The disclaimer rule

The demo is public and carries iHR's colors and name. Every entry point — hub,
console sidebar, marketing footer, README — states that it is an unofficial
concept demo, not affiliated with or endorsed by iHR, with fictional data. Do not
use their logo file, their customers' names, or fabricated testimonials.
`lib/demo-config.ts` holds the author credit used throughout.

## Acceptance criteria

- [x] Every screen verified in ar/en × light/dark × mobile/desktop.
- [x] Keyboard-only pass through payroll, hiring, compliance, and employee portal.
- [x] High-contrast accessible color palettes across all status tokens.
- [x] README, `docs/for-ihr.md`, and `docs/pitch-message.md` complete and current.
- [x] Static export passes with 90/90 static routes.
- [x] Message drafted for direct outreach.

