# Phase 3 — Hiring

**Size:** L · **Depends on:** Phase 0 (Phase 2 for the hire → employee handoff) · **Status:** Done

## Goal

An applicant tracking module on the employer side that reuses the candidate
app's matching engine — the same score the job seeker sees, from the employer's
point of view.

## Why it matters for the pitch

This maps directly onto **iHR Recruiter**, their candidate management product.
It is also the one place where the existing Masari code becomes a competitive
advantage rather than a starting point: the swipe deck and
[`lib/matching.ts`](../../lib/matching.ts) already exist, so the employer side
gets a ranked pipeline and a "recruiter swipe" for free.

## Scope

**In**

- **Jobs list** (`/console/hiring`): open roles with applicant counts and
  days-open, sourced from the existing jobs data.
- **Pipeline** (`/console/hiring/[jobId]`): kanban columns — Applied, Screening,
  Interview, Offer, Hired, Rejected. Drag to move, with a keyboard-accessible
  fallback menu on each card.
- **Applicant card**: match score ring (reuse `components/match-ring.tsx`),
  matched and missing skills, city, salary expectation.
- **Recruiter swipe** (`/console/hiring/[jobId]/review`): the swipe deck,
  reversed — the recruiter swipes candidates, right shortlists, left passes.
  This is the demo's most memorable screen.
- **Applicant profile drawer**: CV summary, match reasons, notes, stage history.
- **Hired → onboarding handoff**: moving someone to Hired offers to create an
  employee record with status `onboarding`.

**Out**

- Interview scheduling on the employer side (Phase 6 covers time off and
  calendars; the candidate app already simulates interview scheduling).
- Offer letters and e-sign — Phase 6 onboarding.

## Data & state

```ts
Applicant { id, jobId, name, headline, city, skills[], expectedSalary,
            stage, appliedAt, notes[], source }
```

- Seed ~30 applicants across 4–5 open roles, with a realistic spread of match
  scores so the pipeline does not look uniformly excellent.
- Reuse `scoreJob`/`rankJobs` from `lib/matching.ts` by inverting the inputs:
  score a candidate against a job's requirements.

## UX notes

- Drag-and-drop must not be the only way to move a card — a "Move to…" menu on
  each card keeps it keyboard- and screen-reader-accessible.
- Stage columns scroll horizontally on mobile with snap points.
- Show *why* someone scored what they did, in one line, on the card itself.
  The transparency is the selling point, not the number.

## Acceptance criteria

- [x] A candidate can be moved through every stage, with the count updating.
- [x] Match scores agree with what the candidate app shows for the same pairing.
- [x] The recruiter swipe works with touch, mouse and keyboard.
- [x] Hiring someone creates an onboarding employee visible on the dashboard.
- [x] Pipeline is usable in RTL, including drag direction.
- [x] `npm run typecheck && npm run build` pass.
