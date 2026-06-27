# STAGE232T_R3_OPERATIONAL_ENTRY_ACTION_STATE_MACHINE_GUARD

Status:
FIX_APPLIED / GUARDED / LOCAL_VERIFY_PASS / MANUAL_PROD_SMOKE_REQUIRED

## 1. Production symptoms

Reported production symptoms:
- deleted Calendar/Today task/event rows can return after refresh,
- completed rows can appear as both active and struck-through copies,
- restoring a completed row can hide it instead of returning the same canonical id,
- repeated +1H can calculate from stale UI state and only settle after refresh,
- +1D/+1W must preserve time and avoid duplicates.

## 2. Reproduction attempts

Used the R2 source-truth audit as the confirmed reproduction baseline and audited the active route/UI paths locally.

Production manual click-through was not completed in this run. No Obsidian vault was opened, per stage instruction. Production smoke remains required after deploy with a logged-in browser session and Network preserve log enabled.

## 3. Network evidence

No new production Network evidence captured in this run.

Expected active routes confirmed locally:
- task create/edit/done/restore/delete/shift: `/api/tasks` -> `vercel.json` rewrite -> `/api/system?apiRoute=tasks` -> `src/server/task-route-stage124f.ts`,
- event create/edit/done/restore/delete/shift: `/api/events` -> `vercel.json` rewrite -> `/api/system?apiRoute=events` -> `src/server/event-route-stage124f.ts`,
- GET cache: `src/lib/supabase-fallback.ts` 30s GET cache, cleared after mutations and mutation bus events.

## 4. Source-of-truth map

Calendar render:
- `src/pages/Calendar.tsx`

Today render:
- `src/pages/TodayStable.tsx`

Calendar reads:
- `src/lib/calendar-items.ts` -> `fetchTasksFromSupabase`, `fetchEventsFromSupabase`, leads/cases/clients,
- `src/lib/scheduling.ts` expands task/event/lead entries,
- `src/lib/work-items/normalize.ts` normalizes canonical task/event fields.

Today reads:
- `src/pages/TodayStable.tsx` through `src/lib/supabase-fallback.ts` task/event helpers and operational bundle state.

Canonical task fields:
- `id`,
- `record_type/type`,
- `status`,
- `scheduled_at/scheduledAt`,
- `due_at/dueAt`,
- `date`,
- `time`,
- `show_in_tasks/showInTasks`,
- `show_in_calendar/showInCalendar`,
- `lead_id/case_id/client_id`.

Canonical event fields:
- `id`,
- `record_type/type`,
- `status`,
- `start_at/startAt`,
- `scheduled_at/scheduledAt`,
- `end_at/endAt`,
- `show_in_calendar/showInCalendar`,
- `show_in_tasks/showInTasks`,
- `source_provider/source_external_id`,
- `lead_id/case_id/client_id`.

Completed retention:
- `src/pages/Calendar.tsx`,
- workspace-scoped key `closeflow:calendar:completed-retention:v1:<workspaceId>`,
- released on restore and delete,
- merge dedupes by `kind + sourceId`.

Optimistic state:
- Calendar: `applyCalendarShiftOptimisticState`,
- Today: local optimistic maps in `TodayStable.tsx` plus forced refresh after operation.

Google inbound:
- `src/server/google-calendar-inbound.ts`,
- local delete/closed-row resurrection still needs production Google smoke if available.

## 5. Root cause confirmed

Confirmed source-level root causes:
- task restore only changed status back to `todo`; route did not force `show_in_calendar=true` and `show_in_tasks=true`,
- event restore only changed status back to `scheduled`; route did not force `show_in_calendar=true`,
- task `PATCH` with `date` but without `scheduledAt` rebuilt `scheduled_at` at `09:00`, resetting restored/edited task time,
- Calendar complete/restore task payload sent date without canonical timestamp,
- repeated Calendar shift actions could calculate from the rendered entry snapshot instead of the latest local canonical row.

## 6. Files changed

- `src/server/task-route-stage124f.ts`
- `src/server/event-route-stage124f.ts`
- `src/pages/Calendar.tsx`
- `scripts/check-stage232t-r3-operational-entry-state-machine.cjs`
- `tests/stage232t-r3-operational-entry-state-machine.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `tests/stage123-calendar-task-shift-payload-source-contract.test.cjs`
- `tests/stage124-calendar-shift-freeze-guard.test.cjs`
- `_project/runs/STAGE232T_R3_OPERATIONAL_ENTRY_ACTION_STATE_MACHINE_GUARD.md`

## 7. Tests added

- `scripts/check-stage232t-r3-operational-entry-state-machine.cjs`
- `tests/stage232t-r3-operational-entry-state-machine.test.cjs`

Covered locally:
- task restore visibility contract,
- event restore visibility contract,
- task date-only patch time preservation,
- repeated +1H state progression,
- completed retention dedupe by canonical id,
- Calendar latest-row snapshot and operation lock markers.
- compatibility of older shift guards with `actionEntry.raw` instead of stale `entry.raw`.

## 8. Commands run

PASS:
- `node scripts/check-stage232t-r3-operational-entry-state-machine.cjs`
- `node --test tests/stage232t-r3-operational-entry-state-machine.test.cjs`
- `node --test tests/stage124-calendar-shift-freeze-guard.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `node --test tests/stage123-calendar-task-shift-payload-source-contract.test.cjs`
- `node --test tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

Additional diagnostic:
- `npx tsc --noEmit --pretty false` failed on old backup/bisect folders outside this stage scope, before reaching runtime gate. Project-required `npm run build` passed.

## 9. Manual production smoke checklist

Required after deploy:
- Task create -> done -> refresh -> restore -> refresh -> delete -> hard refresh.
- Event create -> done -> refresh -> restore -> refresh -> delete -> hard refresh.
- Task create -> +1H x3 without manual refresh -> refresh -> verify +3h -> delete.
- Event create -> +1H x3 without manual refresh -> refresh -> verify +3h -> delete.
- Task/event with lead relation -> done/restore/delete -> verify no lead shadow ghost.
- Google Calendar, if available: inbound create/update/second sync no duplicate, local delete not resurrected.

Use prefix:
- `P0_CAL_AUDIT_20260627_<random>`

## 10. Known remaining risk

- Production browser smoke and Network evidence are still required.
- Google Calendar inbound/outbound resurrection risk was not manually tested in this run.
- Today-specific independent bugs were not changed; the backend route contract now covers Today task/event restore and date preservation paths.
