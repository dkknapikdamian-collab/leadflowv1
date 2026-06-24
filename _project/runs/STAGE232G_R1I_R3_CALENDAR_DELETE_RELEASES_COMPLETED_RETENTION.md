# STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION

Date: 2026-06-24 23:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE

## Problem

Owner smoke found that a completed event deleted from Calendar stayed visible in UI. Restore then failed because backend row was already deleted.

Root cause: R1I retention cache kept the completed event/task as a local safety-net and handleDeleteEntry did not release retention after successful backend delete. After refreshSupabaseBundle, the retained row was merged back into Calendar.

## Fix

- Add releaseCalendarCompletedRetentionByKindAndIdStage232GR1I(kind, sourceId).
- After successful deleteEventFromSupabase(sourceId), release event retention.
- After successful deleteTaskFromSupabase(sourceId), release task retention.
- Keep retention for completed non-deleted rows.
- No SQL, Google sync, Owner Control, A35B, finance or billing changes.

## Required tests

- node scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs
- node --test tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- git status --short --branch

## Manual smoke

1. Calendar -> event -> Zrobione -> F5: event remains completed and visible.
2. Delete this completed event.
3. F5: event must not return from retention cache.
4. Repeat with task.

## Separate observed issue

/api/system?kind=google_calendar&route=sync-inbound can return duplicate-key 500 for idx_work_items_google_calendar_source_external. This is a separate Google inbound sync idempotency bug.
