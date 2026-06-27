# STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH

Status: PUSHED / NEEDS_LOCAL_VERIFICATION

Scope:
- Runtime fix for `/today` task/event work item actions.
- No Obsidian update.
- No SQL/RLS/migrations.
- No finance/commission/billing changes.

What was broken:
- Edit opened generic `/tasks` or `/calendar` without a concrete item intent.
- Edit/Delete clicks in `WorkItemCard` did not have the same propagation boundary as Done/Shift.
- Done updated source truth but previously relied on local state without an explicit Today refresh.
- Shift already used update helpers, now guarded as the active source-truth path for R1D.

What changed:
- Task edit: `/today` now navigates to `/tasks?editTaskId=<taskId>` and `TasksStable` opens the existing task edit dialog.
- Event edit: `/today` now navigates to `/calendar?editEventId=<eventId>&focus=<date>` and `Calendar` opens the existing calendar edit dialog.
- Task delete: still uses `deleteTaskFromSupabase(taskId)` and refreshes Today after mutation.
- Event delete: still uses `deleteEventFromSupabase(eventId)` and refreshes Today after mutation.
- Task shift: still uses `updateTaskInSupabase` with `date`, `time`, `scheduledAt`, and `dueAt`, then refreshes Today.
- Event shift: still uses `updateEventInSupabase` with `startAt` and `endAt`, then refreshes Today.
- Done cross-view contract: task/event Done writes `status: 'done'`, refreshes Today, and is compatible with existing Tasks done grouping and Calendar completed/done styling.
- WorkItemCard: Edit/Delete now call `preventDefault()` and `stopPropagation()` before invoking handlers.

Source of truth:
- Task write helper: `updateTaskInSupabase`.
- Task delete helper: `deleteTaskFromSupabase`.
- Event write helper: `updateEventInSupabase`.
- Event delete helper: `deleteEventFromSupabase`.
- Task editor: existing `TasksStable` dialog via `editTaskId`.
- Event editor: existing `Calendar` edit dialog via `editEventId`.
- UI action surface: existing `WorkItemCard`.

Tests and guards:
- PASS `node scripts/check-stage232t-r1d-today-work-item-actions-source-truth.cjs`
- PASS `node --test tests/stage232t-r1d-today-work-item-actions-source-truth.test.cjs`
- PASS `node --test tests/stage97-today-overdue-task-done-button.test.cjs`
- PASS `node scripts/check-cf-runtime-00-source-truth.cjs`
- PASS `npm run build`
- PASS `npm run verify:closeflow:quiet`
- PASS `git diff --check`

Manual smoke:
- MANUAL_UI_NOT_EXECUTED.
- Required owner/local smoke: overdue task +1D, edit, delete, F5 persistence; event +1D, edit, done, Calendar placement/completed behavior.

Risk audit:
- Calendar completed retention already treats `done`/`completed` as completed, so Today event Done remains compatible with existing Calendar display logic.
- Query-param edit opens after the page data loads. If the target id is absent from the loaded bundle, no new editor is created and the page remains unchanged.
- `verify:closeflow:quiet` covers existing static/runtime release contracts, but it is not a substitute for manual UI smoke on live data.

FOUND_BUT_NOT_FIXED:
- Manual UI smoke was not executed in this run.

Not touched:
- Obsidian vault.
- SQL/RLS/migrations.
- Finance/commission/billing.
- Google Calendar sync internals.
- LeadListCard, ClientDetail, CaseDetail.

Next step:
- Run manual smoke on test task/event records, then close the stage if F5 persistence and cross-view behavior are confirmed.
