# 2026-06-08 - Stage228R19R2 - missing item active source truth

Date: 2026-06-08 22:20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scan summary

Stage228R18R5 confirmed hard-delete for lead missing_item work_items, but user confirmed deleted items still return after refresh.
The remaining likely cause is active Braki list reconstruction from a non-task source such as activity/timeline.

## Change

LeadDetail active Braki source is locked to linkedTasks only.
Activity/timeline may still keep history, but it cannot resurrect an active Brak card.

## Guards

- scripts/check-stage228r19r2-missing-item-active-source-truth.cjs
- tests/stage228r19r2-missing-item-active-source-truth.test.cjs
- package prebuild includes the R19R2 guard.

## Manual test

Add Brak -> hard refresh -> delete -> hard refresh -> Brak does not return.

## Risk audit

- ClientDetail may need the same active-source-truth sweep if the symptom also appears there.
- This stage does not delete activity history; it separates active work from audit trail.
- If a record still returns after R19R2, the next diagnostic must capture the exact rendered card source, URL, task id and network DELETE result.
