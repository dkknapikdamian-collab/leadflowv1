# STAGE232I4_R16V_TASK_UPDATE_SYSTEM_ROUTE_AND_BLOCKER_LABEL_FINAL

Date/time: 2026-06-20 12:25 Europe/Warsaw

## Scope
- Preserve approved compact MissingItemsManagerDialog visual layout from R16S/R16T.
- Add visible `Blokuje` label beside the checkbox.
- Move global `updateTaskInSupabase` PATCH from legacy `/api/tasks` to consolidated `/api/system?apiRoute=tasks`.

## Tests required
- `node scripts/check-stage232i4-r16v-task-update-system-route-and-blocker-label-final.cjs`
- `node --test tests/stage232i4-r16v-task-update-system-route-and-blocker-label-final.test.cjs`
- `npm run build`
- `git diff --check`

## Manual smoke
- Braki / Blokady modal still compact.
- No visual badges `Klient` / red `Blokuje`.
- Checkbox has visible `Blokuje` text.
- Checkbox can be unchecked and checked without `existing is not defined`.
- Gotowe and Usuń still work.

## Not touched
SQL, Owner Control, finances, Calendar, billing/trial, CaseDetail.
