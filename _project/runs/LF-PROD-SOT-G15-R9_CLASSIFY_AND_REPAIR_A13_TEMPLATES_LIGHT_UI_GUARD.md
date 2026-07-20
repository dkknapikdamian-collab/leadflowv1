# LF-PROD-SOT-G15-R9 — Classify and repair A13 Templates light UI guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_A13_TEMPLATES_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
34d47d2dc7de3b57080fb9acc8c224c4a77d7424

APP_EXECUTION_HEAD:
b6f69d365736148cd1872ef61c8dfd641f795fdb

PR:
#21

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_GUARD_MARKER

The A13 guard required `data-a16-template-light-ui="true"`, a selector owned by the reference-only Stage36 stylesheet. The same guard explicitly forbids importing that stylesheet globally because it breaks the live UI. Current `Templates.tsx` instead exposes `data-cf-templates-page-source="record-list-source-truth"` and uses the required light utility classes.

## Repair

- replace the inactive Stage36 marker assertion with the current record-list source marker;
- explicitly reject restoration of the inactive Stage36 marker in `Templates.tsx`;
- retain all light utility, ResponseTemplates, mojibake, security and architecture checks;
- add a focused executable test and Ubuntu gate with production build.

## Verification evidence

G15_R9_WORKFLOW_RUN_ID:
29769527613

G15_R9_WORKFLOW_JOB_ID:
88443900874

FOCUSED_G15_R9_TESTS:
PASS

A13_CRITICAL_REGRESSION_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29769528478

G15_R6_ARTIFACT_ID:
8472166728

G15_R6_ARTIFACT_DIGEST:
sha256:f04512945d497a2e4ff93a7eeda295bf48edb08eb6d1fe7be1916c9f0b90f569

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
3

REPAIRED_COMMAND:
node scripts/check-a13-critical-regressions.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage18-leads-hard-1to1.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage18 CSS import

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Scope

MUTATED_FILES:
- scripts/check-a13-critical-regressions.cjs — 3 additions / 2 deletions
- tests/lf-prod-sot-g15-r9-a13-templates-light-guard.test.cjs
- .github/workflows/g15-r9-a13-templates-light-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
TEMPLATES_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

NEXT_STAGE:
LF-PROD-SOT-G15-R10_CLASSIFY_AND_REPAIR_STAGE18_LEADS_CSS_GUARD

RESULT: PASS
