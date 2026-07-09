# LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA

Date/time: 2026-07-09 21:30 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA
R21: PASS
Character: APP_GUARD_AND_TEST_ONLY / NO_RUNTIME_ADOPTION / NO_TASKSSTABLE_REWIRE / NO_UI_CHANGE

## Scope

R21 adds only a contract guard/test for future TasksStable grouping/date helper adoption.

## Changed files

- package.json
- scripts/guards/verify-lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.cjs
- tests/lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.test.cjs
- _project/runs/LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA.md

## Runtime confirmation

TASKSSTABLE_REWIRED: NO
RUNTIME_CHANGED: NO
NO_RUNTIME_ADOPTION: YES
NO_TASKSSTABLE_REWIRE: YES
NO_UI_CHANGE: YES
SQL_SUPABASE_API_TOUCHED: NO
CSS_UI_TOUCHED: NO
CALLBACKS_MUTATIONS_FORMS_TOUCHED: NO
DATA_FLOWS_TOUCHED: NO
RUNTIME_DATA_TOUCHED: NO

## Guard contract

R21 confirms TasksStable still owns local grouping/date helpers:

- isTaskDone
- isTaskToday
- isTaskOverdue
- getTaskGroupId
- buildTaskGroups

R21 confirms badge/tone only still use the display facade:

- getStatusBadge -> getTaskDisplayStatusLabel
- getTaskStatusTone -> getTaskDisplayStatusTone

## Recorded contract differences

### Closed statuses

Local isTaskDone closes:

- done
- completed
- closed
- cancelled
- canceled

Facade isTaskDisplayClosed closes:

- done
- completed
- closed
- cancelled
- canceled
- deleted
- archived
- removed

Decision difference recorded:

- deleted / archived / removed are facade-closed but not local-isTaskDone closed.

### Date key

Local getTaskDateKey:

- getTaskMomentRaw(task).slice(0, 10)

Facade getTaskDisplayDateKey:

- trim
- slice(0, 10)
- regex YYYY-MM-DD
- invalid -> empty string

Decision difference recorded:

- invalid date-like string
- malformed partial date

## R22 decision required before runtime adoption

R22 decision required before runtime adoption.

R22 must decide whether these differences are intentional and acceptable:

1. deleted / archived / removed as closed/done-like grouping.
2. invalid date values normalized to no_due instead of local raw slice behavior.
3. impact on filters, stats, sorting and actions.

## Verification expected

- R15 verify: PASS
- R17 verify: PASS
- R21 verify: PASS
- Build: PASS
- git diff --check: PASS

## Next selected stage

LF-PROD-SOT-005C-R22_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_DECISION_DO_POTWIERDZENIA

R22_CREATED: NO
