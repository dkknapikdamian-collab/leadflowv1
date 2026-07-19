# LF-PROD-SOT-G15-R4 — DELETE cross-consumer automated readiness gate

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
IMPLEMENTED_PENDING_CLEAN_CHECKOUT_PROOF

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
44e7c577ec9fafacbaa56a78b202144938e36587

BRANCH:
g15-r4-delete-cross-consumer-readiness

## Purpose

Prove from a clean checkout that both safe DELETE consumers remain aligned before the final manual Google Calendar acceptance is executed at the end of the implementation program.

## Scope

- execute the G15-R2 Event DELETE owner-evidence matrix;
- execute the repaired G15-R3 Task DELETE owner-evidence matrix;
- assert common fail-closed legacy-null behavior;
- assert exact-workspace scoped tombstones;
- assert no unscoped service-role write in either DELETE path;
- assert no pending-delete or remote Google DELETE call in either route;
- assert Task legacy-null deletion does not mutate lead next action.

RUNTIME_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_DELETE_CHANGED: NO
MANUAL_SMOKE: DEFERRED_TO_FINAL_ACCEPTANCE_BY_OWNER

## Acceptance gate

EVENT_DELETE_MATRIX_REQUIRED: 18 PASS / 0 FAIL
TASK_DELETE_MATRIX_REQUIRED: 20 PASS / 0 FAIL
COMBINED_MATRIX_REQUIRED: 38 PASS / 0 FAIL
G15_R4_STATIC_TESTS_REQUIRED: 10 PASS / 0 FAIL
CLEAN_CHECKOUT_REQUIRED: YES
VERCEL_REQUIRED: SUCCESS

The standard repository CI is known to fail at Linux lint because the existing `lint` script starts with Windows-specific `npm.cmd`. G15-R4 does not change `package.json`; its dedicated clean-checkout workflow is the bounded technical gate.

NEXT_AFTER_PASS:
LF-PROD-SOT-G15-R5_CI_LINT_CROSS_PLATFORM_ENTRY_REPAIR
