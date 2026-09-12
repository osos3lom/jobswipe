# Phase 4 — Saudi compliance hub

**Size:** M · **Depends on:** Phase 2 (for the WPS file) · **Status:** Done

## Goal

The module no international HR product does well for Saudi Arabia: Saudization
tracking, document expiry, and the WPS salary file.

## Why it matters for the pitch

This is the clearest "you understand our market" signal in the whole demo.
Gusto has nothing like it, and it is exactly the localization work an iHR client
would be paying for.

## Scope

**In**

- **Compliance home** (`/console/compliance`): status cards for Saudization,
  document expiry, WPS readiness, and contract status.
- **Nitaqat band meter**: current Saudization percentage against illustrative
  band thresholds (Red → Low/Medium/High Green → Platinum), with a
  "what would move us up" line — how many Saudi hires to reach the next band.
- **Document tracker**: Iqama, passport and contract expiry in one table, with
  30/60/90-day filters and an expired-first sort. Feeds the dashboard KPI that
  already exists.
- **WPS / Mudad export**: generate the salary file from the latest payroll run
  and download it client-side as a Blob. Shape it like a WPS SIF (employee id,
  IBAN, basic, housing, other, deductions, net) and label it a sample layout.
- **Qiwa-style contract status** per employee: authenticated / pending / expired.

**Out**

- Any real integration with GOSI, Mudad, Qiwa or Muqeem. This is a static demo;
  everything is generated locally and labelled as a sample.

## Data & state

- Add `iban` (fictional, clearly non-routable), `passportExpiry`, and
  `contractStatus` to `Employee`; bump the store `KEY`.
- `lib/hr/compliance.ts`: band thresholds as a configurable table, `nextBandGap`,
  `documentAlerts` (generalizing the existing `iqamaAlerts`).
- `lib/hr/wps.ts`: pure function from a payroll run to CSV rows.

## Saudi specifics — and the honesty line

- Nitaqat bands depend on company size and activity and change over time. The
  demo uses **one illustrative threshold table**, shown on screen as such, with a
  note that real bands come from the Ministry's current rules.
- The WPS file is a **sample layout**, not a bank-ready file.
- Non-Saudi employees have Iqamas; Saudis do not. The seed already reflects this.

## UX notes

- The band meter should be a single glanceable arc or bar with the next
  threshold marked — not a chart that needs reading.
- Expired items are `destructive`, expiring-soon are `warning`, using the
  semantic tokens from Phase 0. Never use brand maroon for an alert state.
- Download button states: generating → downloaded, with the row count shown.

## Acceptance criteria

- [x] Saudization percentage matches the dashboard and the people table.
- [x] Expiry filters (30/60/90) return the right people; expired sort first.
- [x] WPS CSV downloads and opens cleanly in a spreadsheet, Arabic names intact
      (UTF-8 BOM).
- [x] Every illustrative rule is labelled on screen, not just in the docs.
- [x] `npm run typecheck && npm run build` pass.
