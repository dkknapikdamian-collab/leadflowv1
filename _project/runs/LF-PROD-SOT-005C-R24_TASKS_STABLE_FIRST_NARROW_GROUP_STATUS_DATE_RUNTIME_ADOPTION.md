# LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION

Date/time: 2026-07-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION
R24: PASS
Character: FIRST_NARROW_RUNTIME_ADOPTION / ONE_HELPER_ONLY / NO_UI_CHANGE

## Input maps

- Obsidian: LF-PROD-SOT-005C-R22_R21_RESULT_DECISION_AND_SAFE_RUNTIME_CANDIDATE_MAP.md
- Obsidian: LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT_MAP.md
- App: LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT.md

## Runtime decision

RUNTIME_CHANGED: YES
TASKSSTABLE_REWIRED_HELPER: getTaskDateKey
SOT_COMPAT_HELPER: getTaskStableGroupDateKeyCompat
BUILD_TASK_GROUPS_REWIRED: NO

Exactly one TasksStable helper was adopted from the SOT/facade compat contract:

- getTaskDateKey now delegates to getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task)).

No other TasksStable grouping helper was rewired.

## Guarded non-changes

UI_CSS_SQL_API_CHANGED: NO
CALLBACKS_MUTATIONS_FORMS_TOUCHED: NO
BUILD_TASK_GROUPS_AS_WHOLE_REWIRED: NO
IS_TASK_DONE_REWIRED: NO
IS_TASK_OVERDUE_REWIRED: NO
GET_TASK_GROUP_ID_REWIRED: NO
DATA_FLOWS_TOUCHED: NO
RUNTIME_DATA_TOUCHED: NO

## Previous guard compatibility repair

R21/R23 guard and test files were updated to coexist with the later R24 date-key helper adoption while still rejecting broader grouping rewires.

- R21 now accepts the R24 `getTaskDateKey -> getTaskStableGroupDateKeyCompat` delegation.
- R23 now accepts exactly one TasksStable compat helper call and still rejects closed/overdue/group-id compat adoption.

## Verification scope

- R15 verify required
- R17 verify required
- R21 verify required
- R23 verify required
- R24 verify required
- build required
- git diff --check required

## R25 input contract

R25_READS_OBSIDIAN_MAP: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION_MAP.md
R25_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md

R25_CREATED: NO
