# LF-PROD-SOT-G15-R12 — Classify and repair Visual HTML Theme V14 guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_V14_GLOBAL_THEME_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
3ae9027a939117e72fda136b7b6df3eecc6cb76c

APP_EXECUTION_HEAD:
6906b87ed6585c8e011e59f2b56ff5c2e4afdf64

PR:
#25

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_GLOBAL_THEME_GUARD

The historical V14 guard required global import of `visual-html-theme-v14.css`. The reference stylesheet applies a fixed 286px shell, sidebar, form, button and Cases-page overrides with broad `!important` rules. Current Layout and Cases use later compact-shell, operator-trim, Stage211 canvas, record-list and page-header source-of-truth styles. Restoring V14 would reintroduce obsolete global visual behavior.

## Repair

- explicitly reject the inactive V14 global theme import;
- assert current Layout shell and Stage212M visual foundation sources;
- assert current Cases page-header, record-list and Stage211 canvas sources;
- retain `cf-html-shell` compatibility and V14 trace markers;
- retain the V14 stylesheet as historical reference evidence;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R12_WORKFLOW_RUN_ID:
29771424084

G15_R12_WORKFLOW_JOB_ID:
88450282632

FOCUSED_G15_R12_TESTS:
5 PASS / 0 FAIL

RECONCILED_V14_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29771424339

G15_R6_ARTIFACT_ID:
8472903186

G15_R6_ARTIFACT_DIGEST:
sha256:b6bd1f3e086cfcb60f4da305496f6c010c9fbc29c940d35f3bbd17c4e0493552

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
7

REPAIRED_COMMAND:
node scripts/check-visual-html-theme-v14.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage08-case-detail.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 08 CSS import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R13_CLASSIFICATION

VERCEL_2_CLOSEFLOW:
PENDING_MERGE

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE

## Scope

MUTATED_FILES:
- scripts/check-visual-html-theme-v14.cjs
- tests/lf-prod-sot-g15-r12-visual-html-theme-v14-guard.test.cjs
- .github/workflows/g15-r12-visual-html-theme-v14-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CASES_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

NEXT_STAGE:
LF-PROD-SOT-G15-R13_CLASSIFY_AND_REPAIR_STAGE08_CASE_DETAIL_CSS_GUARD

RESULT: PASS
