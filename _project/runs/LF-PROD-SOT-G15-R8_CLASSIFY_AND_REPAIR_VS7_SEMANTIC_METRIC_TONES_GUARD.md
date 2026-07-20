# LF-PROD-SOT-G15-R8 — Classify and repair VS7 semantic metric tones integration

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_SEMANTIC_METRIC_TONES_CSS_INTEGRATED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
cad045ffeabc535d964e0320c7664200824c970d

APP_EXECUTION_HEAD:
da4e1471b3062436c6375309056b55baabe484cb

PR:
#20

## Classification

FAILURE_CLASSIFICATION:
REAL_PRODUCT_INTEGRATION_BUG

The VS7 semantic tone stylesheet exists and the runtime exposes its required data attributes, but `src/index.css` did not import the stylesheet. The production bundle therefore omitted the semantic tone variables and selectors.

## Repair

- import `src/styles/closeflow-operator-semantic-tones.css` from `src/index.css`;
- place it after the design-system index and before core contracts;
- add a focused test for uniqueness, order, source marker and executable guard behavior;
- add a dedicated Ubuntu gate running the focused test, VS7 guard and production build.

## Verification evidence

G15_R8_WORKFLOW_RUN_ID:
29769104265

G15_R8_WORKFLOW_JOB_ID:
88442476513

FOCUSED_G15_R8_TESTS:
PASS

VS7_SEMANTIC_METRIC_TONES_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29769104168

G15_R6_ARTIFACT_ID:
8472000025

G15_R6_ARTIFACT_DIGEST:
sha256:025c74bdaa3ca426bc8f271e75434b7f0c96e2279de5f033d879ad5a0da56cec

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
2

REPAIRED_COMMAND:
npm run check:vs7-semantic-metric-tones — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-a13-critical-regressions.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
A13 critical regression guard failed. Templates UI matches light app shell: src/pages/Templates.tsx missing /data-a16-template-light-ui="true"/.

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Scope

MUTATED_PRODUCT_FILE:
- src/index.css — exactly 1 addition / 0 deletions

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

NEXT_STAGE:
LF-PROD-SOT-G15-R9_CLASSIFY_AND_REPAIR_A13_TEMPLATES_LIGHT_UI_GUARD

RESULT: PASS
