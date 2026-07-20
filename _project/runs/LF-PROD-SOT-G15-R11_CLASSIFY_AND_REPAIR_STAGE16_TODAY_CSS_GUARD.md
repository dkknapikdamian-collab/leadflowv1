# LF-PROD-SOT-G15-R11 — Classify and repair Stage16 Today CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE16_TODAY_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
28416f6626e89b1811cd164c066931b4afd52a31

APP_EXECUTION_HEAD:
9e3277a9e7de767cad09a658f368873fda0fb637

PR:
#24

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

G15_R11_WORKFLOW_RUN_ID:
29771081594

G15_R11_WORKFLOW_JOB_ID:
88449111880

FOCUSED_G15_R11_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE16_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29771082158

G15_R6_ARTIFACT_ID:
8472771429

G15_R6_ARTIFACT_DIGEST:
sha256:92685cd40e7f46da200ecc68f460399a8e733c348aa990e9e113554b4e8a3070

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
6

REPAIRED_COMMAND:
node scripts/check-visual-stage16-today-html-reset.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-html-theme-v14.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing v14 css import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R12_CLASSIFICATION

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

NEXT_STAGE:
LF-PROD-SOT-G15-R12_CLASSIFY_AND_REPAIR_VISUAL_HTML_THEME_V14_GUARD

RESULT: PASS
