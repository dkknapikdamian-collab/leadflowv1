# LF-PROD-SOT-G15-R7 — Reconcile stale LeadDetail feedback guard with Stage78 UI truth

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STALE_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
e103ac2c5a76c7d6d266da44c554c84bb521d147

APP_EXECUTION_HEAD:
40941b111dbff99d8af0f541b3aba989b75bfb34

PR:
#19

## Root cause

The historical `check:lead-detail-feedback-p1` guard required literal rendering of `<LeadAiFollowupDraft` inside `src/pages/LeadDetail.tsx`. Later Stage78 UI source-of-truth intentionally removed that static follow-up card from LeadDetail while keeping the standalone draft-only component available elsewhere.

## Repair

- replace the stale rendering requirement with the current Stage78 no-static-card contract;
- fail if LeadDetail imports or renders `LeadAiFollowupDraft` again;
- retain the shared activity timeline and noisy-right-card checks;
- verify that the standalone follow-up component still uses the draft generator and explicitly states that AI sends nothing automatically;
- add a focused executable test and dedicated Ubuntu verification workflow.

## Verification evidence

G15_R7_WORKFLOW_RUN_ID:
29768490653

G15_R7_WORKFLOW_JOB_ID:
88440442045

FOCUSED_G15_R7_TESTS:
PASS

RECONCILED_GUARD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29768490669

G15_R6_ARTIFACT_ID:
8471759450

G15_R6_ARTIFACT_DIGEST:
sha256:72a7f9a85d22669c9944ca4e66fefe8d8efa2a2012c3b559cf4a7ebe333f707d

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
1

REPAIRED_COMMAND:
npm run check:lead-detail-feedback-p1 — PASS

NEXT_FIRST_NONZERO_COMMAND:
npm run check:vs7-semantic-metric-tones

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
Error: Missing closeflow-operator-semantic-tones.css in src/index.css

STANDARD_CI_CLASSIFICATION:
FAILS_AFTER_REPAIRED_GUARD_ON_NEXT_INDEPENDENT_COMMAND

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Scope

MUTATED_FILES:
- scripts/check-lead-detail-feedback-p1-2026-05-13.cjs
- tests/lf-prod-sot-g15-r7-stale-lead-detail-feedback-guard.test.cjs
- .github/workflows/g15-r7-stale-lead-detail-guard.yml
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

NEXT_STAGE:
LF-PROD-SOT-G15-R8_CLASSIFY_AND_REPAIR_VS7_SEMANTIC_METRIC_TONES_GUARD

RESULT: PASS
