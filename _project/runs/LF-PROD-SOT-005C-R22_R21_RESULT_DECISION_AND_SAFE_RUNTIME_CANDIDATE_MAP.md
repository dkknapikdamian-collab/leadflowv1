# LF-PROD-SOT-005C-R22_R21_RESULT_DECISION_AND_SAFE_RUNTIME_CANDIDATE_MAP

Date/time: 2026-07-09 22:30 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-005C-R22_R21_RESULT_DECISION_AND_SAFE_RUNTIME_CANDIDATE_MAP
Status: PASS_BY_LOCAL_VERIFY / DECISION_MAP_DONE / NO_RUNTIME_REWIRE / NO_TASKSSTABLE_REWIRE
Branch used: dev-rollout-freeze

## Why branch dev-rollout-freeze was used

R22 brief mentioned app target branch main, but current CloseFlow rollout line is dev-rollout-freeze.

GitHub compare showed:

- main base: 406913a8717d1146215dc9bf562af5b13a7c9941
- dev-rollout-freeze head before R22: 597cac92802828420a2be17c288475f6bdfa7e8e
- status: diverged
- dev-rollout-freeze ahead_by main: 2228
- dev-rollout-freeze behind_by main: 49

Decision: do not push this SOT rollout decision to main. Use dev-rollout-freeze until Damian explicitly changes the rollout branch.

## Inputs read

App inputs:

- _project/runs/LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA.md
- scripts/guards/verify-lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.cjs
- tests/lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.test.cjs
- src/pages/TasksStable.tsx
- src/lib/source-of-truth/task-display-status.ts

Obsidian inputs were checked through current state/router context and previous synced R21-R2 status.

## R21 result used by R22

R21 after R21-R2 is treated as PASS_AFTER_R21_R2.

R21 recorded contract differences:

1. deleted / archived / removed
   - local TasksStable isTaskDone: not closed
   - task-display-status facade isTaskDisplayClosed: closed

2. invalid date-like strings and malformed partial date
   - local TasksStable getTaskDateKey: raw slice behavior
   - facade getTaskDisplayDateKey: trim, slice, YYYY-MM-DD validation, invalid -> empty string

R21 also confirms:

- TasksStable still owns local grouping/date helpers.
- Badge/tone only use display facade.
- No TasksStable grouping/date runtime rewire exists.

## R22 decision flags

SAFE_TO_ADOPT_DIRECT_EXISTING_FACADE_HELPERS: NO
UNSAFE_TO_ADOPT_DIRECT_EXISTING_FACADE_HELPERS: YES
NEEDS_COMPAT_HELPER: YES
BLOCKED_BY_BEHAVIOR_DRIFT: YES
STOP_NO_SAFE_CANDIDATE: NO

## Reasoning

Direct runtime adoption of the existing facade helpers would change production behavior:

- deleted / archived / removed would move into closed/done-like grouping.
- invalid date values would stop behaving like raw sliced local keys and would fall into no_due-style behavior.
- the above can affect grouping, overdue/today/upcoming/no_due classification, filters, stats, sorting and actions.

This means direct R23 runtime rewire is rejected.

## Selected one safe R23 candidate

Selected R23:

LF-PROD-SOT-005C-R23_TASKS_STABLE_COMPAT_GROUP_STATUS_DATE_HELPERS_FACADE_CONTRACT_DO_POTWIERDZENIA

R23 character:

APP_GUARD_AND_HELPER_CONTRACT_ONLY / NO_RUNTIME_REWIRE / NO_TASKSSTABLE_REWIRE / NO_UI_CHANGE

R23 goal:

Add/export compatibility helpers on the task-display-status facade side that preserve the current TasksStable grouping/date behavior exactly before any runtime adoption.

R23 must not rewire TasksStable.

R23 should introduce/guard a compat contract such as:

- local-compatible closed status semantics for TasksStable grouping:
  - closed: done, completed, closed, cancelled, canceled
  - not closed: deleted, archived, removed
- local-compatible date key semantics:
  - getTaskMomentRaw-compatible input -> raw slice(0, 10)
  - no YYYY-MM-DD validation yet
- explicit naming that prevents confusion with current stricter display helpers.

Suggested candidate helper names are only candidates, not implementation mandate:

- getTaskStableGroupDateKeyCompat
- isTaskStableGroupClosedCompat
- isTaskStableGroupOverdueCompat
- getTaskStableGroupIdCompat

R23 should create guard/test first and keep runtime unchanged.

## Rejected R23 alternatives

Rejected:

- direct TasksStable runtime rewire to current getTaskDisplayDateKey / isTaskDisplayClosed / getTaskDisplayStatus
- changing deleted / archived / removed grouping behavior in the same step
- changing invalid date behavior in the same step
- UI/CSS changes
- SQL/API/Supabase changes
- mutation/callback/form changes
- data/flows.json changes

## Local verification closeout

R22 was locally closed after the connector-created report.

- R15 verify: PASS.
- R17 verify: PASS.
- R21 verify: PASS.
- Build: PASS.
- git diff --check: PASS.
- TasksStable rewired: NO.
- Runtime changed: NO.

## Status

R22_CREATED_APP_REPORT: YES
RUNTIME_CHANGED: NO
TASKSSTABLE_REWIRED: NO
SELECTED_R23: LF-PROD-SOT-005C-R23_TASKS_STABLE_COMPAT_GROUP_STATUS_DATE_HELPERS_FACADE_CONTRACT_DO_POTWIERDZENIA
R23_CREATED: NO
LOCAL_VERIFY: PASS

## Reconciliation note - 2026-07-10 Europe/Warsaw

This app report was reconciled with the already-updated Obsidian router/current-state entries.

- Canonical rollout branch for this SOT chain: dev-rollout-freeze.
- The pasted R22 brief branch value main is treated as an outdated brief error for this chain.
- R22 decision remains unchanged: direct existing facade helper adoption is unsafe.
- Exactly one R23 candidate remains selected: facade-side compat helper/export contract.
- No runtime, UI, CSS, SQL, API, Supabase, TasksStable rewire, callbacks, mutations, forms, data/flows.json or runtime/data changes were made by this reconciliation.
