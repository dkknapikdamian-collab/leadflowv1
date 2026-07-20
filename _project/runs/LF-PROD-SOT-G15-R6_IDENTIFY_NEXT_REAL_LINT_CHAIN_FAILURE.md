# LF-PROD-SOT-G15-R6 — Identify next real lint-chain failure

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_FIRST_NONZERO_LINT_COMMAND_IDENTIFIED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
fe48efc197b92fb2ab6d23999a50076b4f279c11

APP_EXECUTION_HEAD:
68cadc7c57ff643d8ec1f01030dd02dd696d5072

PR:
#18

## Diagnostic evidence

WORKFLOW_RUN_ID:
29768066594

WORKFLOW_JOB_ID:
88439027293

WORKFLOW_RESULT:
SUCCESS_DIAGNOSTIC_COMPLETED

RUNNER_CONTRACT_TESTS:
9 PASS / 0 FAIL

ARTIFACT_ID:
8471590578

ARTIFACT_DIGEST:
sha256:53e770c634349591e501f4aa7d1644367f0e25fe67d69dad9d04fc71f6621f5a

COMMANDS_PASSED_BEFORE_FAILURE:
0

FIRST_NONZERO_COMMAND:
npm run check:lead-detail-feedback-p1

FIRST_NONZERO_EXIT_CODE:
1

FIRST_NONZERO_SCRIPT:
scripts/check-lead-detail-feedback-p1-2026-05-13.cjs

FIRST_NONZERO_OUTPUT:
FAIL check:lead-detail-feedback-p1: LeadDetail nie renderuje bezpiecznego szkicu follow-up draft-only.

FULL_LOG_ARTIFACT:
_project/artifacts/g15-r6-lint-chain/01-npm-run-check-lead-detail-feedback-p1.log

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_GUARD

The guard requires literal `<LeadAiFollowupDraft` rendering in `src/pages/LeadDetail.tsx`. Current LeadDetail contains later Stage78 source-of-truth markers explicitly stating that the static AI follow-up card was removed from the LeadDetail right rail. The standalone `LeadAiFollowupDraft` component still exists and remains draft-only: it states that AI sends nothing automatically. Therefore the first lint failure is a stale historical UI assertion, not a portability defect, current runtime regression or Google Calendar defect.

AFFECTED_FILES:
- scripts/check-lead-detail-feedback-p1-2026-05-13.cjs
- src/pages/LeadDetail.tsx

CONTEXT_FILE_NOT_DEFECTIVE:
- src/components/LeadAiFollowupDraft.tsx

## Proposed next stage

LF-PROD-SOT-G15-R7_RECONCILE_STALE_LEAD_DETAIL_FEEDBACK_GUARD_WITH_STAGE78_UI_TRUTH

The repair must update only the stale guard and its focused test/report. It must assert current Stage78 truth: no static AI follow-up card in LeadDetail, no automatic-send regression, shared activity formatter still used, and the draft-only component remains available outside the removed rail.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER
RESULT: PASS
