# LF-PROD-SOT-G15-R14 — Classify and repair Stage07 Cases CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE07_CASES_GUARD_RECONCILED_AND_DEPLOYED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
204d53bbc5202115c22b9b525555e953b681c3e4

APP_IMPLEMENTATION_HEAD:
8965ab93df4df0f32c1aa0a9c93bd743f4cbd7b5

APP_MERGE_HEAD:
fb7e27faa36f75cb42a78ad159aea07c4694a91f

PR:
#27

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CASES_VISUAL_FILTER_ROUTING_AND_RELATION_GUARD

The historical Stage07 guard required global import of `visual-stage07-cases.css` and an obsolete CaseView union. Current Cases uses later page-header, record-list, Stage211 canvas, operator-rail and open/closed archive-navigation source contracts. Restoring Stage07 would override current list and navigation surfaces.

The same guard expected literal template-string CaseDetail links and a historical source-lead text link. Current Cases routes through the canonical `caseDetailPath(record.id)` helper and retains lead relation through the `linked` filter. Source evidence confirmed navigation and relation behavior remain present under newer contracts.

## Repair

- explicitly reject the inactive Stage07 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current Cases visual imports and source markers;
- assert the current open/closed/all filter contract;
- assert CaseDetail navigation through the shared route helper;
- assert source-lead relation through the current linked filter;
- retain the Stage07 stylesheet as historical reference evidence;
- retain case read, create, delete, lifecycle, search and relation checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R14_WORKFLOW_RUN_ID:
29772427592

G15_R14_WORKFLOW_JOB_ID:
88453616459

FOCUSED_G15_R14_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE07_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29772427606

G15_R6_ARTIFACT_ID:
8473289121

G15_R6_ARTIFACT_DIGEST:
sha256:bab58661d4b35306dd5d2643786616bd38aac8bcf1832ed2391b00901000b63f

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
9

REPAIRED_COMMAND:
node scripts/check-visual-stage07-cases.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage06-client-detail.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 06 CSS import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R15_CLASSIFICATION

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Scope

MUTATED_FILES:
- scripts/check-visual-stage07-cases.cjs
- tests/lf-prod-sot-g15-r14-stage07-cases-guard.test.cjs
- .github/workflows/g15-r14-stage07-cases-guard.yml
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
LF-PROD-SOT-G15-R15_CLASSIFY_AND_REPAIR_STAGE06_CLIENT_DETAIL_CSS_GUARD

RESULT: PASS
