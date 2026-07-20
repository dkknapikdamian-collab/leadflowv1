# LF-PROD-SOT-G15-R15 — Classify and repair Stage06 ClientDetail CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE06_CLIENT_DETAIL_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
2d3d9fc7a12a0ae4e5a6d8af35a0e4a348da718a

APP_EXECUTION_HEAD:
6ea23abba1ec8cc903ffe9d9d372020cca64677e

PR:
#29

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CLIENT_DETAIL_VISUAL_AND_LEAD_COCKPIT_GUARD

The historical Stage06 guard required global import of `visual-stage06-client-detail.css`. That reference stylesheet applies broad card, header, form, grid and mobile overrides with `!important`. Current ClientDetail uses later Stage12 and Stage211 canvas source contracts plus the current workspace and shared missing-manager model. Restoring Stage06 would overwrite newer ClientDetail surfaces.

The same guard expected `openNewLeadForExistingClient`. Current source explicitly enforces `STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT`: ClientDetail is a relation center, operational work happens in a Case or an already active lead, and no new/open lead shortcut is rendered. Main-case navigation and new-case creation remain present.

## Repair

- explicitly reject the inactive Stage06 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current Stage12 and Stage211 visual imports;
- assert current workspace, canvas and missing-manager source markers;
- retain the Stage06 stylesheet as historical reference evidence;
- replace the stale new-lead shortcut assertion with the current no-lead-cockpit contract;
- assert main-case navigation and new-case creation remain present;
- retain client read, relation, edit, sync and contact checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R15_WORKFLOW_RUN_ID:
29772999996

G15_R15_WORKFLOW_JOB_ID:
88455541335

FOCUSED_G15_R15_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE06_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29773000028

G15_R6_ARTIFACT_ID:
8473518895

G15_R6_ARTIFACT_DIGEST:
sha256:134b87b35224051d593ee923e778b407faa166a8a7d0d54eaa7f53d092d95c2e

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
11

REPAIRED_COMMAND:
node scripts/check-visual-stage06-client-detail.cjs — PASS

UNCHANGED_COMMAND_CONFIRMED_PASS:
node scripts/check-visual-stage05-clients.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage04-lead-detail.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/pages/LeadDetail.tsx: missing AI follow-up component remains

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R16_CLASSIFICATION

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

NEXT_STAGE:
LF-PROD-SOT-G15-R16_CLASSIFY_AND_REPAIR_STAGE04_LEAD_DETAIL_GUARD

RESULT: PASS
