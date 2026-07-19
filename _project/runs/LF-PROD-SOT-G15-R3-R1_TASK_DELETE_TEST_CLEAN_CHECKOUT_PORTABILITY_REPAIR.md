# LF-PROD-SOT-G15-R3-R1 — Task DELETE test clean-checkout portability repair

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
IMPLEMENTED_PENDING_AUTOMATED_CLEAN_CHECKOUT_PROOF

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
8ecfc4e1551501189938876c01d2a7ef1806a410

BRANCH:
g15-r3-r1-test-portability-repair

## Root cause

The committed G15-R3 test resolved its runtime source from `tests/task-route-stage124f.ts`. That file was present only in the temporary authoring layout and was not part of the repository commit, so a clean checkout could not execute the test matrix.

## Repair

- resolve repository root with `path.resolve(__dirname, '..')`;
- load the canonical runtime source from `src/server/task-route-stage124f.ts`;
- add a guard that executes the full G15-R3 matrix and requires `20 PASS / 0 FAIL`;
- do not change Task DELETE runtime, Event DELETE runtime, SQL, schema, RLS or Google API behavior.

RUNTIME_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_DELETE_CHANGED: NO
MANUAL_SMOKE: DEFERRED_TO_FINAL_ACCEPTANCE_BY_OWNER

## Acceptance

- clean checkout contains the canonical runtime source path;
- the portability guard passes;
- the G15-R3 executable matrix reports 20 pass and 0 fail;
- branch deployment checks are green;
- final manual Google Calendar smoke remains deferred and is not represented as PASS.

NEXT_AFTER_PASS:
LF-PROD-SOT-G15-R4_DELETE_CROSS_CONSUMER_AUTOMATED_READINESS_GATE
