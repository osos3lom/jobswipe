# Phase 7 — Employee self-service

**Size:** M · **Depends on:** Phases 2 and 6 · **Status:** stretch

## Goal

Turn on the third role. The employee side is the mobile app an employee of the
demo company uses: payslips, leave requests, HR letters — plus the bilingual AI
assistant, evolved from the existing career coach.

## Why it matters for the pitch

It completes the loop: the admin runs payroll in the console, and the employee
sees the payslip on their phone, from the same data. That connection is what
makes the demo read as one platform instead of a set of screens.

It also retires the last "Soon" in the Demo menu, where Employee is currently
disabled.

## Scope

**In**

- **Role activation**: Employee becomes selectable in the Demo menu and on the
  hub. The demo "signs in" as a chosen employee from the seed (default: someone
  with an interesting record — expat, Iqama expiring, mid-tenure).
- **Home** (`/me`): next payday, leave balance, open requests, documents due.
- **Payslips** (`/me/payslips`): list by month, detail view, print, sourced from
  the Phase 2 payroll runs.
- **Leave** (`/me/leave`): balance by type, request form, status tracking. A
  request appears in the console approval queue — the two sides share state.
- **Letters** (`/me/letters`): generate a salary certificate, an experience
  letter, or an embassy letter from a bilingual template. Very Saudi-specific and
  a common HR request.
- **Profile & documents**: personal details, Iqama and contract with expiry.
- **AI HR assistant**: reuse `components/career-coach.tsx` and
  `lib/career-coach.ts`, re-scoped to HR questions ("how much leave do I have?",
  "when is payday?"), answering from the store with canned reasoning. Label it
  clearly as a scripted demo assistant, not a live model.

**Out**

- Real authentication. The role is a demo switch, not a login.

## Files

```
app/(employee)/me/…            new routes, mobile-first like the candidate app
components/employee/           home cards, payslip view, letter templates
lib/dict/employee.ts           strings
lib/hr/letters.ts              letter template generation
```

Reuse `AppShell` and `BottomNav` patterns from the candidate app rather than
inventing a third shell; give the bottom nav its own items for this role.

## Acceptance criteria

- [ ] Employee is selectable everywhere it was previously "Soon".
- [ ] A payslip shown to the employee matches the console's run exactly.
- [ ] A leave request from `/me` appears in the console queue, and approving it
      updates the balance on both sides.
- [ ] Letters render correctly in Arabic and print cleanly.
- [ ] The assistant never claims to be a live AI model.
- [ ] `npm run typecheck && npm run build` pass.
