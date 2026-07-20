# LF-PROD-SOT-G15-R7 — Reconcile stale LeadDetail feedback guard with Stage78 UI truth

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
e103ac2c5a76c7d6d266da44c554c84bb521d147

## Root cause

The historical `check:lead-detail-feedback-p1` guard required literal rendering of `<LeadAiFollowupDraft` inside `src/pages/LeadDetail.tsx`. Later Stage78 UI source-of-truth intentionally removed that static follow-up card from LeadDetail while keeping the standalone draft-only component available elsewhere.

## Repair

- replace the stale rendering requirement with the current Stage78 no-static-card contract;
- fail if LeadDetail imports or renders `LeadAiFollowupDraft` again;
- retain the shared activity timeline and noisy-right-card checks;
- verify that the standalone follow-up component still uses the draft generator and explicitly states that AI sends nothing automatically;
- add a focused executable test for the reconciled guard.

## Scope

MUTATED_FILES:
- scripts/check-lead-detail-feedback-p1-2026-05-13.cjs
- tests/lf-prod-sot-g15-r7-stale-lead-detail-feedback-guard.test.cjs
- this report

RUNTIME_CHANGED: NO
PRODUCT_SOURCE_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Acceptance pending

- focused G15-R7 tests pass;
- `npm run check:lead-detail-feedback-p1` passes on Ubuntu;
- G15-R6 diagnostic chain proves this command passed and identifies either the next real non-zero command or an all-green lint chain;
- standard CI does not fail on the repaired guard;
- both Vercel deployments succeed.
