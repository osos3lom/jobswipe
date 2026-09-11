# Phase 2 — People & payroll

**Size:** L · **Depends on:** Phase 0 · **Status:** Done

## Goal

The two modules Gusto is known for: an employee directory with real profiles, and
a payroll run that a reviewer can actually complete — review hours, review pay,
submit, see payslips.

## Why it matters for the pitch

Payroll is the hardest thing in the list to fake convincingly, so doing it well
is the strongest single signal in the demo. It is also the core of iHR Platform,
the product they would hire someone to work on.

## Scope

**In**

- **People** (`/console/people`): searchable, filterable table (department,
  status, nationality, city). Columns: person, title, department, hire date,
  status. Bulk-free, read-first.
- **Person profile** (`/console/people/[id]`): summary header, salary breakdown
  (basic / housing / transport), tenure, manager, documents, direct reports.
- **Payroll** (`/console/payroll`): current period summary, past runs list.
- **Payroll run wizard** (`/console/payroll/run`), three steps like Gusto:
  1. *Review the team* — who is being paid, additions (overtime, bonus),
     deductions (unpaid leave, advances).
  2. *Review the money* — per-employee gross → deductions → net, with the
     employer cost total. GOSI split shown for Saudi vs non-Saudi employees.
  3. *Submit* — confirmation screen, then a completed run with payslips.
- **Payslip** (`/console/payroll/[runId]/[employeeId]`): printable, bilingual.
- Money totals reconcile: the sum of payslips equals the run total, which equals
  the dashboard KPI.

**Out**

- WPS/Mudad file export and Nitaqat — those are Phase 4.
- End-of-service settlement — Phase 6.

## Data & state

Extend `lib/hr/types.ts`:

```ts
PayrollRun   { id, periodMonth, status: 'draft'|'submitted', submittedAt?, lines }
PayrollLine  { employeeId, basic, housing, transport, additions[], deductions[],
               gosiEmployee, gosiEmployer, gross, net }
PayrollSettings { gosiSaudiEmployee, gosiSaudiEmployer, gosiExpatEmployer, … }
```

- Add `payrollRuns` and `payrollSettings` to the HR store; bump `KEY` to
  `ihr.hr.v2`.
- Calculation lives in `lib/hr/payroll.ts` as pure functions so it is testable
  and the same numbers feed the dashboard.

## Saudi specifics

- Salary structure is basic + housing + transport, the standard Saudi split.
- **GOSI rates are settings, not constants baked into the math**, with a visible
  note that they are illustrative and configurable. Rates differ for Saudi and
  non-Saudi employees and have changed for newer entrants — the demo should not
  assert a specific number as current law.
- Payslips show Gregorian and Hijri dates.
- Currency via `formatSAR`; never hand-format numbers.

## UX notes

- The wizard is the demo's centerpiece: keep each step to one decision, show a
  running total pinned to the side (bottom on mobile), and make "Submit" feel
  like a moment — a short success state, not a silent redirect.
- Every number needs a label in both languages; no bare figures.
- The table needs a sensible empty state and a loading skeleton.

## Acceptance criteria

- [x] A reviewer can run payroll end to end and land on a payslip in under a minute.
- [x] Totals reconcile across payslip, run and dashboard.
- [x] GOSI settings are visibly editable and labelled illustrative.
- [x] Person profiles reachable from the table, the dashboard todos, and search.
- [x] Table and wizard work in RTL and on a 375px screen.
- [x] `console-nav.ts` links People and Payroll (no more "Soon").
- [x] `npm run typecheck && npm run build` pass.
