# LF-PROD-SOT-G15-R15 — Classify and repair Stage06 ClientDetail CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
2d3d9fc7a12a0ae4e5a6d8af35a0e4a348da718a

APP_EXECUTION_HEAD:
99553226abeb649cb7141433f7e4171fd4b54d70

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CLIENT_DETAIL_VISUAL_GUARD

The historical Stage06 guard required global import of `visual-stage06-client-detail.css`. That reference stylesheet applies broad card, header, form, grid and mobile overrides with `!important`. Current ClientDetail uses later Stage12 and Stage211 canvas source contracts plus the current workspace and shared missing-manager model. Restoring Stage06 would overwrite newer ClientDetail surfaces.

## Repair

- explicitly reject the inactive Stage06 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current Stage12 and Stage211 visual imports;
- assert current workspace, canvas and missing-manager source markers;
- retain the Stage06 stylesheet as historical reference evidence;
- retain client read, relation, edit, sync, contact and navigation checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R15_TESTS:
PENDING_CI

RECONCILED_STAGE06_GUARD:
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
- scripts/check-visual-stage06-client-detail.cjs
- tests/lf-prod-sot-g15-r15-stage06-client-detail-guard.test.cjs
- .github/workflows/g15-r15-stage06-client-detail-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CLIENT_DETAIL_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PENDING_CI
