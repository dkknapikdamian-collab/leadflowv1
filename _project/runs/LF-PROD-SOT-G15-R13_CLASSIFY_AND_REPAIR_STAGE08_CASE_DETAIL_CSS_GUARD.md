# LF-PROD-SOT-G15-R13 — Classify and repair Stage08 CaseDetail CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
f96b70653e495e9cf3cd6c6c5c3fed4d1945b164

APP_EXECUTION_HEAD:
1dddf52fd7ad7fb85311b15492108fc4962a219d

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CASE_DETAIL_VISUAL_GUARD

The historical Stage08 guard required global import of `visual-stage08-case-detail.css`. Current CaseDetail uses later Stage13, Stage211, Stage217, Stage220, Stage228 and Stage231 visual source-of-truth layers. Restoring Stage08 would override the current operation workspace, tabs, rail and finance/detail surfaces with obsolete selectors.

## Repair

- explicitly reject the inactive Stage08 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current CaseDetail visual imports and source markers;
- retain the Stage08 stylesheet as historical reference evidence;
- retain all existing CaseDetail business-flow presence checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R13_TESTS:
PENDING_CI

RECONCILED_STAGE08_GUARD:
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
- scripts/check-visual-stage08-case-detail.cjs
- tests/lf-prod-sot-g15-r13-stage08-case-detail-guard.test.cjs
- .github/workflows/g15-r13-stage08-case-detail-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CASE_DETAIL_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PENDING_CI
