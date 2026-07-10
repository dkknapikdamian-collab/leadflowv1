# LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION

Date/time: 2026-07-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION
R27: PASS_DECISION_GATE
Character: DECISION_GATE / NO_RUNTIME_REWIRE / LOCAL_EXCEPTION_FINAL_DECISION

## Input contract

- Obsidian map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md`
- App report: `_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md`

## Decision

R27: PASS_DECISION_GATE
RUNTIME_CHANGED: NO
TASKSSTABLE_REWIRED: NO
BUILD_TASK_GROUPS_DECISION: LOCAL_ALLOWED_EXCEPTION
GET_TASK_GROUP_ID_DECISION: LOCAL_ALLOWED_EXCEPTION
NEXT_STAGE_REQUIRED: NO
No runtime change was made.

`buildTaskGroups` and `getTaskGroupId` remain local allowed exceptions. The risk of behavioral drift is higher than the architectural gain from adopting the full compat group helper in this stage.

Reason:

- `buildTaskGroups` is not an isolated date/status helper. It controls list sections, group counts and the visible task grouping surface.
- `getTaskGroupId` is fed by local `isTaskDone`, `isTaskOverdue`, `isTaskToday` and `getTaskMomentRaw` behavior.
- Related local helpers also feed stats, filters, urgent task ranking, task toggles and task actions.
- R21/R23/R25 explicitly preserve deleted / archived / removed as open statuses in TasksStable grouping.
- R21/R23/R25 explicitly preserve invalid-date raw-slice behavior.
- R26 already stopped because no safe second helper was named.

## Helper matrix

- getTaskDisplayStatusLabel: SOT_ADOPTED
- getTaskDisplayStatusTone: SOT_ADOPTED
- getTaskDateKey: SOT_ADOPTED
- getTaskStableGroupDateKeyCompat: SOT_ADOPTED
- isTaskDone: LOCAL_ALLOWED_EXCEPTION
- isTaskToday: LOCAL_ALLOWED_EXCEPTION
- isTaskOverdue: LOCAL_ALLOWED_EXCEPTION
- getTaskGroupId: LOCAL_ALLOWED_EXCEPTION
- buildTaskGroups: LOCAL_ALLOWED_EXCEPTION
- isTaskStableGroupClosedCompat: BLOCKED_BY_BEHAVIOR_RISK
- isTaskStableGroupOverdueCompat: BLOCKED_BY_BEHAVIOR_RISK
- getTaskStableGroupIdCompat: BLOCKED_BY_BEHAVIOR_RISK

## Guard R27

Guard file:

- `scripts/guards/verify-lf-prod-sot-005c-r27-build-task-groups-final-decision.cjs`

Test file:

- `tests/lf-prod-sot-005c-r27-build-task-groups-final-decision.test.cjs`

Package alias:

- `verify:lf-prod-sot-005c-r27`

Guard asserts:

- R26 stop input is present.
- `TasksStable.tsx` still has only the R24 date-key helper adoption.
- `buildTaskGroups` remains local and routes through local `getTaskGroupId(task)`.
- `getTaskStableGroupIdCompat`, `isTaskStableGroupClosedCompat`, and `isTaskStableGroupOverdueCompat` are not adopted in `TasksStable.tsx`.
- helper matrix records adopted, local exception and blocked helpers.
- R27 app diff is restricted to R27 guard, test, package alias and app report.

## Verification scope

- all available R21-R26 verify
- `npm.cmd run verify:lf-prod-sot-005c-r27`
- `npm.cmd run build`
- `git diff --check`

## R28 input contract

R28_READS_OBSIDIAN_MAP: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md
R28_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md

R28_CREATED: NO
