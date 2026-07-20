# LF-PROD-SOT-G15-R16 — Classify and repair Stage04 LeadDetail guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE04_LEAD_DETAIL_GUARD_RECONCILED_AWAITING_FRESH_LINT_DIAGNOSTIC

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
4c637f84575867efd8056c76f20a365fded15f4e

APP_EXECUTION_HEAD:
c0140d4c3c55258700d485a2337e5d4c2cbf6034

PR:
#30

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_LEAD_DETAIL_VISUAL_STATIC_AI_AND_LOCAL_QUICK_MODAL_GUARD

The historical Stage04 guard required global import of `visual-stage04-lead-detail.css` and a static `LeadAiFollowupDraft` rail component. Current LeadDetail uses later Stage14, Stage211, Stage227E3 and Stage227E4 visual sources. Stage78 explicitly removed the noisy static AI follow-up rail card while preserving `LeadAiNextAction` as the active recommendation engine outside that rail.

The same historical guard expected local task and event modal state. Current LeadDetail routes task and event creation through the shared `openContextQuickAction` host and consumes `closeflow:context-action-saved` to append saved records before silent refresh.

## Repair

- explicitly reject the inactive Stage04 global CSS import;
- assert current Stage14, Stage211 and Stage227 visual sources;
- assert the Stage78 no-static-AI-follow-up-card contract;
- reject obsolete `LeadAiFollowupDraft` while retaining `LeadAiNextAction`;
- replace stale local task/event modal assertions with shared context-action launcher and save-listener assertions;
- retain the Stage04 stylesheet as historical reference evidence;
- retain lead-to-case, edit, delete, finance, note, task, event and tab checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R16_WORKFLOW_RUN_ID:
29773598431

G15_R16_WORKFLOW_JOB_ID:
88457548905

FOCUSED_G15_R16_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE04_GUARD:
PASS

PRODUCTION_BUILD:
PASS

STALE_DIAGNOSTIC_RUN_ID:
29773598419

STALE_DIAGNOSTIC_ARTIFACT_ID:
8473752394

STALE_DIAGNOSTIC_REASON:
The artifact named APP_EXECUTION_HEAD c0140d4c3c55258700d485a2337e5d4c2cbf6034 but its Stage04 log contained the earlier local-modal assertion already removed at that SHA. It is excluded from next-stage evidence.

FRESH_NEXT_LINT_DIAGNOSTIC:
PENDING_CI_AFTER_REPORT_COMMIT

VERCEL_2_CLOSEFLOW:
PENDING_MERGE

VERCEL_CLOSEDOCKAPP:
PENDING_MERGE

## Scope

MUTATED_FILES:
- scripts/check-visual-stage04-lead-detail.cjs
- tests/lf-prod-sot-g15-r16-stage04-lead-detail-guard.test.cjs
- .github/workflows/g15-r16-stage04-lead-detail-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
LEAD_DETAIL_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

RESULT: PASS_GUARD_BUILD_PENDING_FRESH_DIAGNOSTIC
