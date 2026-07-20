# LF-PROD-SOT-G15-R17 — Classify and repair Stage03 Leads guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE03_LEADS_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
89a52bcccbe01f9a427326278f190ec82ad8d0bb

APP_VERIFIED_HEAD:
93d54c0f54e32c28e6158182f39b3fe7248c9ed7

PR:
#31

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_LEADS_VISUAL_GUARD

The historical Stage03 guard required global import of `visual-stage03-leads.css`. The reference stylesheet applies obsolete promotional header copy, fixed metric-grid and relation-rail overrides with broad `!important` rules. Current Leads uses later Stage20 form, page-header, record-list, Stage211 canvas, Stage18 hard-1:1 and Stage231 frozen list-card contracts. Restoring Stage03 would override the current Leads operating surface.

## Repair

- explicitly reject the inactive Stage03 global CSS import;
- assert current form, page-header, record-list and canvas sources;
- assert current Stage18, Stage25, Stage226 and Stage231 source markers;
- retain Stage03 stylesheet as historical reference evidence;
- retain create, duplicate conflict, archive, restore, search, cadence, rescue and lead-only payload checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R17_WORKFLOW_RUN_ID:
29774242826

G15_R17_WORKFLOW_JOB_ID:
88459672695

FOCUSED_G15_R17_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE03_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29774242735

G15_R6_ARTIFACT_ID:
8473996607

G15_R6_ARTIFACT_DIGEST:
sha256:0ea879bb2b48b150a8cfedd5e1f23735942aca421997ed17783826ffa6e25054

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
13

REPAIRED_COMMAND:
node scripts/check-visual-stage03-leads.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage02-today.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 02 CSS import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R18_CLASSIFICATION

VERCEL_2_CLOSEFLOW:
PENDING_MERGE_RETRY_AFTER_R16_RATE_LIMIT

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE_RETRY_AFTER_R16_RATE_LIMIT

## Scope

MUTATED_FILES:
- scripts/check-visual-stage03-leads.cjs
- tests/lf-prod-sot-g15-r17-stage03-leads-guard.test.cjs
- .github/workflows/g15-r17-stage03-leads-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
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
LF-PROD-SOT-G15-R18_CLASSIFY_AND_REPAIR_STAGE02_TODAY_GUARD

RESULT: PASS
