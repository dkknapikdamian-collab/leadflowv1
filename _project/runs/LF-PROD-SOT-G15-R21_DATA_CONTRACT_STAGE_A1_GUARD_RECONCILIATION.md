# LF-PROD-SOT-G15-R21 — Data-contract Stage A1 guard reconciliation

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
e4968a48438536c1b8be2d326f6ffa050f31d3e8

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_INDEX_CSS_LOCATION_AND_REMOVED_MARKER_GUARD

The Stage A1 data-contract checks remain valid. The CSS part of the guard became stale after the CSS import-order refactor: `src/index.css` is now an import router and the narrowed empty-client-warning-strip fix lives in the active `src/styles/emergency/emergency-hotfixes.css` layer.

The exact selector remains active and is now accompanied by owner/reason/scope/remove-after metadata. Restoring the old selector or stage marker directly in `index.css` would duplicate the active hotfix and violate the current CSS layering contract.

## Repair

- preserve all task/event/lead/case normalizer and scheduling-field checks;
- assert that `index.css` imports the emergency hotfix layer;
- reject duplication of the historical selector in `index.css`;
- assert the active narrowed selector in `emergency-hotfixes.css`;
- assert reason, scope and remove-after metadata for the hotfix;
- remove the obsolete `CLIENT_PANEL_EMPTY_WARNING_STRIP_FIX_STAGE_A1` marker requirement;
- add focused executable tests and Ubuntu production-build verification.

## Scope

MUTATED_FILES:
- scripts/check-data-contract-stage-a1.cjs
- tests/lf-prod-sot-g15-r21-data-contract-stage-a1-guard.test.cjs
- .github/workflows/g15-r21-data-contract-stage-a1-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
DATA_CONTRACT_TS_CHANGED: NO
INDEX_CSS_CHANGED: NO
EMERGENCY_CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Verification pending

FOCUSED_G15_R21_TESTS:
PENDING_CI

RECONCILED_STAGE_A1_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_FIRST_NONZERO_COMMAND:
PENDING_DIAGNOSTIC

VERCEL_EXACT_SHA:
PENDING_CHECK

RESULT:
IMPLEMENTED_AWAITING_CI
