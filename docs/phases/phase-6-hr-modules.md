# Phase 6 — Remaining HR modules

**Size:** L · **Depends on:** Phase 2 · **Status:** stretch

## Goal

Fill in the rest of the Gusto feature map: time off, onboarding, benefits and
end-of-service, performance, and reports. Each turns one more "Soon" label in
the sidebar into a working module.

## Why it matters for the pitch

Breadth, after the depth of Phases 2–4. Once payroll and hiring are convincing,
these show the platform is a coherent suite rather than two good screens.
Reports also covers **iHR Vision**, their analytics product.

## Scope — five modules, independently shippable

### Time off (`/console/time-off`)

- Balances per employee, request list, approval queue.
- Saudi Labor Law leave types: annual (which increases with tenure), sick,
  maternity, Hajj, marriage, bereavement. Accrual rules configurable and
  labelled illustrative.
- Team calendar with public holidays (Eid dates follow the Hijri calendar and
  shift yearly — use `formatHijri` and treat dates as approximate).
- Ramadan reduced hours as a visible setting.

### Onboarding (`/console/onboarding`)

- Checklist per new hire, with owners and due dates.
- Offer letter from a bilingual template, with a simulated e-signature.
- Document collection: ID/Iqama, bank details (fictional), contract.
- Feeds from Phase 3's hire action and clears the dashboard todo.

### Benefits & end of service (`/console/benefits`)

- Medical insurance tiers per employee class (CCHI-style categories).
- **End-of-service benefit calculator**: the Labor Law formula — half a month's
  wage per year for the first five years, a full month per year after that, with
  the resignation reductions shown separately. Present as an estimate.

### Performance (`/console/performance`)

- Goals per employee, review cycles, a simple 1–5 rating with comments.
- Deliberately light: Gusto's own performance tooling is thin, so matching it is
  enough.

### Reports (`/console/reports`)

- Headcount over time, payroll cost by department, turnover, Saudization trend.
- **Load the `dataviz` skill before building any chart here** and use the
  validated palette rather than inventing chart colors from the brand ramp.
- Add `recharts` when starting this module; it is not a dependency yet.

## Data & state

Each module adds its own slice to the HR store and its own `lib/dict/` file.
Bump the store `KEY` once per shipped module rather than per edit.

## Acceptance criteria

- [ ] Each shipped module links from `console-nav.ts` and drops its "Soon" label.
- [ ] Leave balances, EOSB figures and report totals reconcile with the people
      and payroll data.
- [ ] Every Saudi rule is labelled illustrative on screen.
- [ ] Charts pass contrast checks in light and dark.
- [ ] `npm run typecheck && npm run build` pass.
