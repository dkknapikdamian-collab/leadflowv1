# LF-PROD-SOT-G15-R13 — Classify and repair Stage08 CaseDetail CSS guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE08_CASE_DETAIL_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
f96b70653e495e9cf3cd6c6c5c3fed4d1945b164

APP_EXECUTION_HEAD:
cdcd11bb7dfddcab0415cff6e3a97f0434dd060e

PR:
#26

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CASE_DETAIL_VISUAL_AND_CREATION_FLOW_GUARD

The historical Stage08 guard required global import of `visual-stage08-case-detail.css`. Current CaseDetail uses later Stage13, Stage211, Stage217, Stage220, Stage228 and Stage231 visual source-of-truth layers. Restoring Stage08 would override the current operation workspace, tabs, rail and finance/detail surfaces with obsolete selectors.

The same guard also expected direct local `insertEventToSupabase` creation. Current CaseDetail intentionally routes task, event and note creation through `openContextQuickAction`, then consumes `closeflow:context-action-saved`. Source evidence confirmed that event creation remains present and was migrated to the shared context-action contract rather than removed.

## Repair

- explicitly reject the inactive Stage08 global CSS import;
- retain Layout route-scope compatibility markers;
- assert current CaseDetail visual imports and source markers;
- retain the Stage08 stylesheet as historical reference evidence;
- replace stale local task/event/note creation assertions with shared context-action assertions;
- retain remaining CaseDetail business-flow presence checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R13_WORKFLOW_RUN_ID:
29771961245

G15_R13_WORKFLOW_JOB_ID:
88452069816

FOCUSED_G15_R13_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE08_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29771961203

G15_R6_ARTIFACT_ID:
8473109612

G15_R6_ARTIFACT_DIGEST:
sha256:9b9936d81630fa6550f0ea87d3417d92c19290d3661ccb64c6bee6ad55952bd7

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
8

REPAIRED_COMMAND:
node scripts/check-visual-stage08-case-detail.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage07-cases.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 07 CSS import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R14_CLASSIFICATION

VERCEL_2_CLOSEFLOW:
PENDING_MERGE

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE

## Scope

MUTATED_FILES:
- scripts/check-visual-stage08-case-detail.cjs
- tests/lf-prod-sot-g15-r13-stage08-case-detail-guard.test.cjs
- .github/workflows/g15-r13-stage08-case-detail-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
CASE_DETAIL_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

NEXT_STAGE:
LF-PROD-SOT-G15-R14_CLASSIFY_AND_REPAIR_STAGE07_CASES_CSS_GUARD

RESULT: PASS
