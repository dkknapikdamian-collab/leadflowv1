# STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST

Status: CODE_READY / DELETE_RESURRECTION_FIX_PUSHED / MANUAL_UI_NOT_EXECUTED
Date: 2026-06-27
Branch: dev-rollout-freeze
Scope: Today task/event closeout for delete, edit, trash visual source of truth, and delete persistence source-truth routing.

## Input

Manual smoke for `c5495c60` returned `PARTIAL_PASS / EDIT_DELETE_NOT_CLOSED`.

Observed issues:
- Delete/Kosz still did not visibly remove Today task/event rows.
- Edit opened a modal but navigated away from `/today` to `/tasks` or `/calendar`.
- Work item trash icon did not use the final red trash visual source of truth.

Follow-up manual smoke from Damian confirmed delete resurrection:
- Kosz removes a row locally.
- After refresh/subscription, the same backend row comes back after about 2 seconds.

## DELETE_RESURRECTION_ROOT_CAUSE

Root cause: fetch and mutation did not use the same active route/source-of-truth.

- Active task fetch source: `fetchTasksFromSupabase()` reads `/api/system?apiRoute=tasks`, which delegates through `api/system.ts` to `src/server/task-route-stage124f.ts`.
- Active event fetch source: `fetchEventsFromSupabase()` reads `/api/system?apiRoute=events`, which delegates through `api/system.ts` to `src/server/event-route-stage124f.ts`.
- Previous task delete path: `deleteTaskFromSupabase()` called `softDeleteTaskInSupabase()`, which PATCHed `/api/tasks`.
- Previous event delete path: `deleteEventFromSupabase()` DELETEd `/api/events?id=...`.
- `vercel.json` previously rewrote `/api/tasks` and `/api/events` to `/api/work-items?kind=tasks/events`, not to the active `/api/system?apiRoute=tasks/events` route family.
- For tasks, the `/api/work-items` PATCH handler normalized non-done task statuses back toward active task status and did not apply the same active feed visibility contract as `task-route-stage124f`, so `status=deleted` did not reliably remove the row from the source read by `/today`.

Result: Today performed a local prune after an awaited backend request, but the following source-truth fetch still returned the row, so the UI resurrected it.

## Runtime Changes

- `vercel.json`
  - `/api/tasks` now rewrites to `/api/system?apiRoute=tasks`.
  - `/api/events` now rewrites to `/api/system?apiRoute=events`.
  - Fetch and delete/update helpers now hit the same active route family for task/event source truth.

- `src/components/work-item-card.tsx`
  - Delete renders through `EntityTrashButton`.
  - `Trash2` and delete loader icons use `trashActionIconClass`.
  - Existing `preventDefault` and `stopPropagation` action boundary remains in place.

- `src/pages/TodayStable.tsx`
  - Task/event edit opens an in-place Today modal instead of navigating to `/tasks` or `/calendar`.
  - Edit save uses the existing task/event update helpers and refreshes Today data.
  - Task/event delete prunes the local Today row only after the awaited delete helper and then refreshes.
  - Delete failures set the visible error message and toast.
  - `deleted`, `archived`, and `removed` statuses are treated as closed so soft-deleted rows do not re-enter active Today lists.

## Guard / Test

- Updated `scripts/check-stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.cjs`.
- Updated `tests/stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.test.cjs`.

New guard/test coverage:
- `fetchTasksFromSupabase()` uses `/api/system?apiRoute=tasks`.
- `fetchEventsFromSupabase()` uses `/api/system?apiRoute=events`.
- `/api/tasks` rewrites to `/api/system?apiRoute=tasks`, not `/api/work-items?kind=tasks`.
- `/api/events` rewrites to `/api/system?apiRoute=events`, not `/api/work-items?kind=events`.
- Delete local prune happens only after awaited backend helper.
- Delete failure is visible and not silent.
- No localStorage deleted-ID tombstone final fix.
- No SQL/RLS/migration, Obsidian, finance, commission, or billing scope.

## Not Touched

- SQL, migrations, RLS, Supabase schema.
- Finance, commission, billing.
- Google Calendar internals.
- Obsidian vault and `_project/obsidian_updates`.
- LeadListCard, ClientDetail, CaseDetail R4 baseline.

## Manual Smoke

Manual UI smoke was not executed in this run. Required smoke after deploy:

TASK:
1. Create a test task for today or overdue.
2. Go to `/today`.
3. Click Kosz.
4. Row disappears.
5. Wait 5 seconds.
6. Row must not return.
7. Click Odśwież dane.
8. Row must not return.
9. Press F5.
10. Row must not return.
11. Go to `/tasks`.
12. Row must not be active.

EVENT:
1. Create a test event for today.
2. Go to `/today`.
3. Click Kosz.
4. Row disappears.
5. Wait 5 seconds.
6. Row must not return.
7. Click Odśwież dane.
8. Row must not return.
9. Press F5.
10. Row must not return.
11. Go to `/calendar`.
12. Row must not be active.
