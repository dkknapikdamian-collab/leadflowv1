# LF-PROD-SOT-G15-R8 — Classify and repair VS7 semantic metric tones integration

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
cad045ffeabc535d964e0320c7664200824c970d

## Classification

FAILURE_CLASSIFICATION:
REAL_PRODUCT_INTEGRATION_BUG

The VS7 semantic tone stylesheet exists and the runtime exposes its required data attributes, but `src/index.css` did not import the stylesheet. The production bundle therefore omitted the semantic tone variables and selectors.

## Repair

- import `src/styles/closeflow-operator-semantic-tones.css` from `src/index.css`;
- place it after the design-system index and before core contracts;
- add a focused test for uniqueness, order, source marker and executable guard behavior;
- add a dedicated Ubuntu gate running the focused test, VS7 guard and production build.

## Scope

MUTATED_PRODUCT_FILE:
- src/index.css

OTHER_MUTATED_FILES:
- tests/lf-prod-sot-g15-r8-semantic-metric-tones-css-import.test.cjs
- .github/workflows/g15-r8-semantic-metric-tones-css.yml
- this report

TYPESCRIPT_RUNTIME_CHANGED: NO
CSS_RUNTIME_CHANGED: YES_BOUNDED_IMPORT_ONLY
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Acceptance pending

- focused tests pass;
- `npm run check:vs7-semantic-metric-tones` passes;
- production build passes;
- diagnostic lint chain passes the repaired command and identifies the next independent failure or all-green result;
- both Vercel deployments succeed.
