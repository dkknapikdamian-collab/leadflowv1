# LF-PROD-SOT-G15-R11 — Classify and repair Stage16 Today CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
28416f6626e89b1811cd164c066931b4afd52a31

APP_EXECUTION_HEAD:
1360a5446748a8a8d8bcc0881085e5e73ee565b1

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_VISUAL_GUARD

The historical guard required global import of `visual-stage16-today-html-reset.css`. That stylesheet explicitly describes itself as aggressive and applies broad global shell, sidebar, card, button and form overrides with `!important`. Current `/` and `/today` route through `TodayStable`, which uses later page-header and Stage211 canvas source-of-truth styles. Restoring the Stage16 import would reintroduce obsolete global visual behavior.

## Repair

- explicitly reject the inactive Stage16 global CSS import;
- assert that the active route resolves to `TodayStable`;
- assert current page-header and Stage211C/211E/211J canvas imports;
- assert current TodayStable source-of-truth markers;
- retain the Stage16 stylesheet as historical reference evidence;
- retain the existing work-items SQL hotfix and package-script checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R11_TESTS:
PENDING_CI

RECONCILED_STAGE16_GUARD:
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
- scripts/check-visual-stage16-today-html-reset.cjs
- tests/lf-prod-sot-g15-r11-stage16-today-guard.test.cjs
- .github/workflows/g15-r11-stage16-today-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
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
