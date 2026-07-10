# LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK

Date/time: 2026-07-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK
R25: PASS
Character: AUTO_REVERIFY / BEHAVIOR_DIFF_CHECK / NO_RUNTIME_REWIRE

## Input contract

- Obsidian map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION_MAP.md`
- App report: `_project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md`

## Result

BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT
RUNTIME_CHANGED: NO
TASKSSTABLE_REWIRED: NO
No new runtime rewire.

R24 adopted exactly one runtime helper:

- `getTaskDateKey(task)` delegates to `getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task))`.

R25 confirms this preserves the previous local raw-slice date-key behavior:

- valid past dates remain `overdue` unless closed.
- valid today dates remain `today` unless closed.
- valid future dates remain `upcoming` unless closed.
- missing dates remain `no_due`.
- invalid dates: preserved via raw slice behavior.
- deleted / archived / removed: preserved as open statuses.
- scheduled / in_progress / todo: preserved as open statuses.
- done / completed / closed / cancelled / canceled: preserved as closed statuses.

## Guard R25

Guard file:

- `scripts/guards/verify-lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.cjs`

Test file:

- `tests/lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.test.cjs`

Package alias:

- `verify:lf-prod-sot-005c-r25`

Guard asserts:

- no new TasksStable runtime rewire beyond the R24 date-key compat helper.
- behavior matrix has no drift for done / overdue / today / upcoming / no_due.
- invalid dates keep raw-slice behavior.
- deleted / archived / removed keep current open-status behavior.
- scheduled / in_progress / todo keep current open-status behavior.
- R25 app diff is restricted to R25 guard, test, package alias and app report.
- R25 map and router mark R26 allowance explicitly.

## Verification scope

- `npm.cmd run verify:lf-prod-sot-005c-r15`
- `npm.cmd run verify:lf-prod-sot-005c-r17`
- `npm.cmd run verify:lf-prod-sot-005c-r21`
- `npm.cmd run verify:lf-prod-sot-005c-r23`
- `npm.cmd run verify:lf-prod-sot-005c-r24`
- `npm.cmd run verify:lf-prod-sot-005c-r25`
- `npm.cmd run build`
- `git diff --check`

## R26 gate

R26_ALLOWED: YES

R26 may read exactly:

- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md`
- `_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md`

R26_CREATED: NO
