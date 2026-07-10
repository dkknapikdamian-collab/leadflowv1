# LF-PROD-SOT-G1-R1_REVERIFY_AFTER_R28_CLOSEOUT_AND_INPUT_MAP_ALIGNMENT

Date/time: 2026-07-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Stage: LF-PROD-SOT-G1-R1_REVERIFY_AFTER_R28_CLOSEOUT_AND_INPUT_MAP_ALIGNMENT
Branch: dev-rollout-freeze

## Purpose

Reverify the previously premature G1 after the R28 closeout and align the real R28 input map before any G2 stage.

This stage does not create or implement G2.
This stage makes no runtime or source-code change.

## Exact inputs

- `package.json`
- `_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md`
- `_project/runs/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md`
- `scripts/guards/verify-lf-prod-sot-005c-r28-final-closeout-gate.cjs`
- `tests/lf-prod-sot-005c-r28-final-closeout-gate.test.cjs`
- `src/pages/TasksStable.tsx`
- `src/lib/source-of-truth/task-display-status.ts`
- the three explicitly allowed Obsidian maps.

## R28 reverify evidence

R28_FINAL_STATUS: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS
R24_ADOPTED_HELPER: getTaskDateKey -> getTaskStableGroupDateKeyCompat
R25_BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT
R26_FINAL: STOP_NO_SAFE_SECOND_HELPER
R27_FINAL: PASS_DECISION_GATE
BUILD_TASK_GROUPS: LOCAL_ALLOWED_EXCEPTION
GET_TASK_GROUP_ID: LOCAL_ALLOWED_EXCEPTION
G1_STATUS_AT_R28_CLOSEOUT: OUT_OF_ORDER_ALREADY_PRESENT
G1_CONTINUATION_AT_R28_CLOSEOUT: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS
R28_G2_CREATED: NO

## G1-R1 result

G1_R1: PASS_AFTER_R28_REVERIFY
G1_R1_STATUS: PASS_AFTER_R28_REVERIFY
R28_INPUT_MAP_NOW_PRESENT: YES
G2_ALLOWED_AFTER_G1_R1: YES
G2_CREATED: NO

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
TASKSSTABLE_CHANGED: NO
UI_CSS_SQL_API_CHANGED: NO
SUPABASE_CHANGED: NO

## Verification

VERIFY_R28_INITIAL: PASS
VERIFY_R28_FINAL_RECHECK: PASS
BUILD: PASS
GIT_DIFF_CHECK_APP: PASS
GIT_DIFF_CHECK_OBSIDIAN: PASS

## Next stage selection

NEXT_STAGE_SELECTED = LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT

The next stage is selected only. It is not created or implemented by G1-R1.