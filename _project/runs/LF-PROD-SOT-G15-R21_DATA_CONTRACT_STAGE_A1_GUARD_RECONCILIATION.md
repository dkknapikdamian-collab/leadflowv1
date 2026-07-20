# LF-PROD-SOT-G15-R21 — Data-contract Stage A1 guard reconciliation

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_CODE_AND_CI_READY_MERGE_EXTERNAL_DEPLOYMENT_RATE_LIMIT

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
e4968a48438536c1b8be2d326f6ffa050f31d3e8

APP_VERIFIED_HEAD:
3f609de6c4e8f94628649edc04b18aea6ac6b107

PR:
#35

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_INDEX_CSS_LOCATION_AND_REMOVED_MARKER_GUARD

The Stage A1 data-contract checks remain valid. The CSS part of the guard became stale after the CSS import-order refactor: `src/index.css` is now an import router and the narrowed empty-client-warning-strip fix lives in the active `src/styles/emergency/emergency-hotfixes.css` layer.

The exact selector remains active and is now accompanied by owner/reason/scope/remove-after metadata. Restoring the old selector or stage marker directly in `index.css` would duplicate the active hotfix and violate the current CSS layering contract.

## Repair

- preserve all task/event/lead/case normalizer and scheduling-field checks;
- assert that `index.css` imports the emergency hotfix layer;
- reject duplication of the historical selector in `index.css`;
- assert the active narrowed selector in `emergency-hotfixes.css`;
- assert reason, scope and remove-after metadata for the hotfix;
- remove the obsolete `CLIENT_PANEL_EMPTY_WARNING_STRIP_FIX_STAGE_A1` marker requirement;
- add focused executable tests and Ubuntu production-build verification.

## Verification evidence

G15_R21_WORKFLOW_RUN_ID:
29777485453

G15_R21_WORKFLOW_JOB_ID:
88470294137

FOCUSED_G15_R21_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE_A1_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29777485292

G15_R6_DIAGNOSTIC_JOB_ID:
88470294385

G15_R6_ARTIFACT_ID:
8475220602

G15_R6_ARTIFACT_DIGEST:
sha256:d20ccdbbed173871c1b4bf94026f525bd606bf9ff4f5991db95433ff09cefc82

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
24

REPAIRED_COMMAND:
node scripts/check-data-contract-stage-a1.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-access-billing-source-of-truth-stage02a.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_SUMMARY:
55 PASS / 0 WARN / 11 FAIL

NEXT_FAILURE_OUTPUT:
- plans guard expects a literal local `TRIAL_DAYS = 21` even though trial duration is imported as shared source truth;
- api/me negative check incorrectly reports the forbidden 14-day literal as a failure when it is absent;
- Billing guard expects historical local `ACCESS_COPY` with nine status keys, while current Billing derives display state from shared access helpers.

NEXT_STAGE:
LF-PROD-SOT-G15-R22_CLASSIFY_AND_REPAIR_ACCESS_BILLING_STAGE02A_GUARD

NEXT_STAGE_STATUS:
IDENTIFIED_NOT_STARTED

## Deployment status

VERCEL_2_CLOSEFLOW:
BLOCKED_BUILD_RATE_LIMIT

VERCEL_CLOSEDOCKAPP:
BLOCKED_BUILD_RATE_LIMIT

BLOCKER_CLASSIFICATION:
EXTERNAL_ACCOUNT_BUILD_RATE_LIMIT_NOT_CODE_FAILURE

EXACT_SHA_DEPLOYMENT_PASS:
NO

## Scope

MUTATED_FILES:
- scripts/check-data-contract-stage-a1.cjs
- tests/lf-prod-sot-g15-r21-data-contract-stage-a1-guard.test.cjs
- .github/workflows/g15-r21-data-contract-stage-a1-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
DATA_CONTRACT_TS_CHANGED: NO
INDEX_CSS_CHANGED: NO
EMERGENCY_CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

MERGE_POLICY:
OWNER_AUTHORIZED_CONTINUED_GUARD_ONLY_STAGES_UNDER_EXTERNAL_BLOCKER_EXCEPTION

RESULT:
PASS_CODE_AND_CI_READY_MERGE_EXTERNAL_DEPLOYMENT_RATE_LIMIT
