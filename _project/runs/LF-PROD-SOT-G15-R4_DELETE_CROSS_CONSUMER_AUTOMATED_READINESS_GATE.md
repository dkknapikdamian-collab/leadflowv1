# LF-PROD-SOT-G15-R4 — DELETE cross-consumer automated readiness gate

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
PASS_DELETE_CROSS_CONSUMER_AUTOMATED_READINESS_GATE

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

## Verification evidence

READINESS_WORKFLOW_RUN_ID: 29691722145
READINESS_WORKFLOW_JOB_ID: 88205534454
CLEAN_CHECKOUT: PASS
EVENT_DELETE_MATRIX: 18 PASS / 0 FAIL
TASK_DELETE_MATRIX: 20 PASS / 0 FAIL
COMBINED_DELETE_MATRIX: 38 PASS / 0 FAIL
G15_R4_STATIC_TESTS: 10 PASS / 0 FAIL
G15_R3_R1_PORTABILITY_REGRESSION: PASS
VERCEL_2_CLOSEFLOW: SUCCESS
VERCEL_CLOSEDOCKAPP: SUCCESS
STANDARD_CI: FAILED_PREEXISTING_WINDOWS_ONLY_NPM_CMD_LINT_ENTRY

## Acceptance gate

- both DELETE runtime matrices pass from a clean checkout: PASS;
- cross-consumer static contract tests: PASS;
- verified owner evidence and legacy-null fail-closed behavior remain aligned: PASS;
- no unscoped service-role write or remote Google DELETE in either route: PASS;
- both deployment checks: SUCCESS;
- runtime behavior unchanged: PASS;
- final manual Google Calendar smoke remains deferred and is not represented as PASS.

The standard repository CI is known to fail at Linux lint because the existing `lint` script starts with Windows-specific `npm.cmd`. G15-R4 does not change `package.json`; its dedicated clean-checkout workflow is the bounded technical gate.

NEXT_AFTER_PASS:
LF-PROD-SOT-G15-R5_CI_LINT_CROSS_PLATFORM_ENTRY_REPAIR
