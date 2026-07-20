# LF-PROD-SOT-G15-R22 — Access/Billing Stage02A guard reconciliation

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
3adb2cfde69ae6699f4b47f49533695a96245663

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

## Verification pending

FOCUSED_G15_R22_TESTS:
PENDING_CI

RECONCILED_ACCESS_BILLING_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_FIRST_NONZERO_COMMAND:
PENDING_DIAGNOSTIC

VERCEL_EXACT_SHA:
PENDING_CHECK

RESULT:
IMPLEMENTED_AWAITING_CI
