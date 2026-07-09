# LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT

Date/time: 2026-07-09 23:15 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT
R23: PASS
Character: APP_GUARD_AND_HELPER_CONTRACT_ONLY / NO_RUNTIME_REWIRE / NO_TASKSSTABLE_REWIRE / NO_UI_CHANGE

## Input decision

R22 selected compat helper/export contract on facade side before any TasksStable runtime adoption.

## App changes

- src/lib/source-of-truth/task-display-status.ts
- scripts/guards/verify-lf-prod-sot-005c-r23-task-display-helper-compat.cjs
- tests/lf-prod-sot-005c-r23-task-display-helper-compat.test.cjs
- package.json
- _project/runs/LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT.md

## Compat helper contract

R23 adds pure compat helpers on the task-display-status facade side:

- getTaskStableGroupDateKeyCompat
- isTaskStableGroupClosedCompat
- isTaskStableGroupOverdueCompat
- getTaskStableGroupIdCompat

These helpers preserve current TasksStable grouping/date behavior exactly before runtime adoption.

## Preserved behavior

Closed statuses for grouping compat:

- done
- completed
- closed
- cancelled
- canceled

Still not closed in compat grouping:

- deleted
- archived
- removed

Date key behavior:

- String(momentRaw || '').slice(0, 10)
- no YYYY-MM-DD validation
- no date parsing
- no new Date

## Runtime audit

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

## Verification expected

- R15 verify: PASS
- R17 verify: PASS
- R21 verify: PASS
- R23 verify: PASS
- Build: PASS
- git diff --check: PASS

## Next selected stage

LF-PROD-SOT-005C-R24_TASKS_STABLE_COMPAT_HELPER_RUNTIME_ADOPTION_CANDIDATE_MAP_DO_POTWIERDZENIA

R24_CREATED: NO
