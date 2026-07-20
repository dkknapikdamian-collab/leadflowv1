# LF-PROD-SOT-G15-R10 — Classify and repair Stage18 Leads CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE18_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
01f0fceb1b41ccfd4c95610fe14114d7734d144c

APP_EXECUTION_HEAD:
919c71be7124a8f884f7458f9a9ef5c4e9058457

PR:
#22

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_VISUAL_GUARD

The guard required the global import of `visual-stage18-leads-hard-1to1.css`. Current `Leads.tsx` carries later Stage25, Stage211 and Stage231 source-of-truth markers and imports current record-list/canvas styles. Re-enabling the Stage18 full-page override would reintroduce obsolete selectors and visual behavior.

## Repair

- explicitly reject the inactive Stage18 global import;
- assert current record-list, Stage211C and Stage211E style imports;
- assert the current Stage25 Leads rebuild marker;
- retain the Stage18 reference file, historical marker, mapping document, shell compatibility and package script checks;
- add a focused executable test and Ubuntu build gate.

## Verification evidence

G15_R10_WORKFLOW_RUN_ID:
29769852888

G15_R10_WORKFLOW_JOB_ID:
88444965010

FOCUSED_G15_R10_TESTS:
PASS

RECONCILED_STAGE18_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29769852844

G15_R6_ARTIFACT_ID:
8472295795

G15_R6_ARTIFACT_DIGEST:
sha256:33a2aff15fb3427fdd9ee918f8ecd12133ade24ecf53654a4313ebf429ce7799

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
5

REPAIRED_COMMAND:
node scripts/check-visual-stage18-leads-hard-1to1.cjs — PASS

ALSO_PASSED:
node scripts/check-visual-stage17-today-hard-1to1.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage16-today-html-reset.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 16 CSS import

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Scope

MUTATED_FILES:
- scripts/check-visual-stage18-leads-hard-1to1.cjs
- tests/lf-prod-sot-g15-r10-stage18-leads-guard.test.cjs
- .github/workflows/g15-r10-stage18-leads-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LEADS_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

NEXT_STAGE:
LF-PROD-SOT-G15-R11_CLASSIFY_AND_REPAIR_STAGE16_TODAY_CSS_GUARD

RESULT: PASS
