# LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP

Date/time: 2026-07-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP
R26: STOP_NO_SAFE_SECOND_HELPER
Character: DECISION_GATE / STOP / NO_RUNTIME_REWIRE

## Input contract

- Obsidian map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md`
- App report: `_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md`

## Decision

R26: STOP_NO_SAFE_SECOND_HELPER
RUNTIME_CHANGED: NO
TASKSSTABLE_REWIRED: NO
BUILD_TASK_GROUPS_REWIRED: NO
No runtime change was made.

Reason:

- R25 map allows R26 but does not name a safe second helper.
- R26 brief allows runtime change only if the R25 map indicates a safe helper.
- The remaining exported compat helpers affect status/overdue/group classification boundaries.
- Known sensitive boundaries remain deleted / archived / removed and invalid dates.

## Guard R26

Guard file:

- `scripts/guards/verify-lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.cjs`

Test file:

- `tests/lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.test.cjs`

Package alias:

- `verify:lf-prod-sot-005c-r26`

Guard asserts:

- R25 map has `R26_ALLOWED: YES`.
- R25 map does not name `SAFE_SECOND_HELPER`.
- `TasksStable.tsx` still has only the R24 date-key helper adoption.
- `isTaskStableGroupClosedCompat`, `isTaskStableGroupOverdueCompat`, and `getTaskStableGroupIdCompat` are not adopted in `TasksStable.tsx`.
- `buildTaskGroups` remains local and routes through local `getTaskGroupId(task)`.
- R26 app diff is restricted to R26 guard, test, package alias and app report.

## Verification scope

- `npm.cmd run verify:lf-prod-sot-005c-r15`
- `npm.cmd run verify:lf-prod-sot-005c-r17`
- `npm.cmd run verify:lf-prod-sot-005c-r21`
- `npm.cmd run verify:lf-prod-sot-005c-r23`
- `npm.cmd run verify:lf-prod-sot-005c-r24`
- `npm.cmd run verify:lf-prod-sot-005c-r25`
- `npm.cmd run verify:lf-prod-sot-005c-r26`
- `npm.cmd run build`
- `git diff --check`

## R27 input contract

R27_READS_OBSIDIAN_MAP: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md
R27_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md

R27_CREATED: NO
