# LF-PROD-SOT-G15-R18 — Classify and repair Stage02 Today guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
9735166175ddfe685d16f870b95d97134e484d79

APP_EXECUTION_HEAD:
6101d7dc2caf3592e0bc887b8cefa1d902c5916b

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_TODAY_VISUAL_AND_PAGE_TARGET_GUARD

The historical Stage02 guard required global import of `visual-stage02-today.css` and inspected legacy `Today.tsx`. Active `/` and `/today` routes use `TodayStable`, which imports later page-header and Stage211C/211E/211J canvas source contracts. The Stage02 reference stylesheet broadly overrides utility colors, backgrounds, radii and cards with `!important`; restoring it would overwrite the current Today operating surface.

## Repair

- explicitly reject the inactive Stage02 global CSS import;
- assert that the active route loads `TodayStable`;
- assert current page-header and Stage211 canvas sources;
- assert current owner-control and action source markers;
- retain Stage02 stylesheet as historical reference evidence;
- move data, AI, mutation, delete and action-policy checks to active `TodayStable`;
- retain mojibake checks across current source files;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R18_TESTS:
PENDING_CI

RECONCILED_STAGE02_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_LINT_DIAGNOSTIC:
PENDING_CI

VERCEL_2_CLOSEFLOW:
PENDING_MERGE_RATE_LIMIT_SLOT

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE_RATE_LIMIT_SLOT

## Scope

MUTATED_FILES:
- scripts/check-visual-stage02-today.cjs
- tests/lf-prod-sot-g15-r18-stage02-today-guard.test.cjs
- .github/workflows/g15-r18-stage02-today-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
APP_TSX_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
TODAY_TSX_CHANGED: NO
TODAY_STABLE_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PENDING_CI
