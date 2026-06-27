# STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST

Status: CODE_READY / MANUAL_UI_NOT_EXECUTED
Date: 2026-06-27
Branch: dev-rollout-freeze
Scope: Today task/event closeout for delete, edit, and trash visual source of truth.

## Input

Manual smoke for `c5495c60` returned `PARTIAL_PASS / EDIT_DELETE_NOT_CLOSED`.

Observed issues:
- Delete/Kosz still did not visibly remove Today task/event rows.
- Edit opened a modal but navigated away from `/today` to `/tasks` or `/calendar`.
- Work item trash icon did not use the final red trash visual source of truth.

## Runtime Changes

- `src/components/work-item-card.tsx`
  - Delete now renders through `EntityTrashButton`.
  - `Trash2` and delete loader icons use `trashActionIconClass`.
  - Existing `preventDefault` and `stopPropagation` action boundary remains in place.

- `src/pages/TodayStable.tsx`
  - Task/event edit now opens an in-place Today modal instead of navigating to `/tasks` or `/calendar`.
  - Edit save uses the existing task/event update helpers and refreshes Today data.
  - Task/event delete now prunes the local Today row immediately after the awaited delete helper and then refreshes.
  - Delete failures set the visible error message and toast.
  - `deleted`, `archived`, and `removed` statuses are treated as closed so soft-deleted task rows do not re-enter active Today lists.

## Guard / Test

- Added `scripts/check-stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.cjs`.
- Added `tests/stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.test.cjs`.
- Updated CF runtime source-truth allowlist for the R1E files.

## Not Touched

- SQL, migrations, RLS, Supabase schema.
- Finance, commission, billing.
- Google Calendar internals.
- Obsidian vault and `_project/obsidian_updates`.
- LeadListCard, ClientDetail, CaseDetail R4 baseline.

## Manual Smoke

Manual UI smoke was not executed in this run. Required smoke after deploy:
- `/today` task delete removes the row and it does not return after refresh.
- `/today` event delete removes the row and it does not return after refresh.
- `/today` task edit opens and saves in-place without leaving `/today`.
- `/today` event edit opens and saves in-place without leaving `/today`.
- `/today` work item Kosz uses the final red trash visual.
