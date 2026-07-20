# LF-PROD-SOT-G15-R14 — Classify and repair Stage07 Cases CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
204d53bbc5202115c22b9b525555e953b681c3e4

APP_EXECUTION_HEAD:
0c2e40799a7b341988246a7737c5427ed310a744

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CASES_VISUAL_AND_FILTER_GUARD

The historical Stage07 guard required global import of `visual-stage07-cases.css` and an obsolete CaseView union. Current Cases uses later page-header, record-list, Stage211 canvas, operator-rail and open/closed archive-navigation source contracts. Restoring Stage07 would override current list and navigation surfaces.

## Repair

- explicitly reject the inactive Stage07 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current Cases visual imports and source markers;
- assert the current open/closed/all filter contract;
- retain the Stage07 stylesheet as historical reference evidence;
- retain case read, create, delete, lifecycle, search and relation-link checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R14_TESTS:
PENDING_CI

RECONCILED_STAGE07_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_LINT_DIAGNOSTIC:
PENDING_CI

VERCEL_2_CLOSEFLOW:
PENDING_MERGE

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE

## Scope

MUTATED_FILES:
- scripts/check-visual-stage07-cases.cjs
- tests/lf-prod-sot-g15-r14-stage07-cases-guard.test.cjs
- .github/workflows/g15-r14-stage07-cases-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CASES_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PENDING_CI
