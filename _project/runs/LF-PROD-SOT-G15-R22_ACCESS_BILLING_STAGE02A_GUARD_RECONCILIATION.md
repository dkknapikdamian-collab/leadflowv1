# LF-PROD-SOT-G15-R22 — Access/Billing Stage02A guard reconciliation

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_CODE_AND_CI_READY_MERGE_EXTERNAL_DEPLOYMENT_RATE_LIMIT

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
3adb2cfde69ae6699f4b47f49533695a96245663

APP_VERIFIED_HEAD:
d3ff904bec6c2b0d8c9e6c02e254483c72723ce7

PR:
#36

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_21_DAY_TRIAL_LOCAL_BILLING_COPY_AND_BROAD_NEGATIVE_REGEX_GUARD

The current product has one explicit 14-day trial source in `src/lib/plans.ts`, a matching `trial_14d` identifier and an API alias imported as `PLAN_TRIAL_DAYS`. The old guard expected 21 days and its broad negative regex falsely matched a documentation marker containing `TRIAL_DAYS=14`.

Billing no longer owns a page-local `ACCESS_COPY` object. It consumes `getBillingAccessCopy(access?.status)` from `src/lib/source-of-truth/billing-options.ts`, where `BILLING_ACCESS_COPY_BY_STATUS` contains all access statuses and the inactive fallback.

Restoring a 21-day trial or duplicating status copy inside `Billing.tsx` would create competing sources of truth.

## Repair

- assert the explicit 14-day central trial and `trial_14d` identifier;
- reject stale 21-day literals in plans and API;
- verify `api/me.ts` imports and aliases central trial duration;
- narrow negative regexes to actual local numeric declarations instead of comments/markers;
- assert Billing consumes `getBillingAccessCopy`;
- validate all access statuses in `BILLING_ACCESS_COPY_BY_STATUS`;
- preserve checkout, cancel/resume, refresh, access model and screen-gate checks;
- add focused executable tests and Ubuntu production-build verification.

## Verification evidence

G15_R22_WORKFLOW_RUN_ID:
29778046579

G15_R22_WORKFLOW_JOB_ID:
88472150113

FOCUSED_G15_R22_TESTS:
6 PASS / 0 FAIL

RECONCILED_ACCESS_BILLING_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29778046315

G15_R6_DIAGNOSTIC_JOB_ID:
88472149305

G15_R6_ARTIFACT_ID:
8475440746

G15_R6_ARTIFACT_DIGEST:
sha256:ca0bd767aae0d82c7669e8337889a9696234ec6b00f9d8af38535a09e2826926

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
25

REPAIRED_COMMAND:
node scripts/check-access-billing-source-of-truth-stage02a.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
tsc --noEmit

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
TypeScript parses malformed historical `.cjs` patch/check scripts in `scripts/` and `tools/`, including unterminated regex/string/template literals and invalid characters. Product build passes, so R23 must classify TypeScript project scope versus executable script integrity without hiding active source errors.

NEXT_STAGE:
LF-PROD-SOT-G15-R23_CLASSIFY_AND_REPAIR_TSC_HISTORICAL_SCRIPT_SCOPE

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
- scripts/check-access-billing-source-of-truth-stage02a.cjs
- tests/lf-prod-sot-g15-r22-access-billing-stage02a-guard.test.cjs
- .github/workflows/g15-r22-access-billing-stage02a-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
PLANS_TS_CHANGED: NO
API_ME_TS_CHANGED: NO
BILLING_TSX_CHANGED: NO
BILLING_OPTIONS_TS_CHANGED: NO
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
