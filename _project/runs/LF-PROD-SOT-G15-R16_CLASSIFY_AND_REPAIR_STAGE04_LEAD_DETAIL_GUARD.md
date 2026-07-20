# LF-PROD-SOT-G15-R16 — Classify and repair Stage04 LeadDetail guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_STAGE04_LEAD_DETAIL_GUARD_RECONCILED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
4c637f84575867efd8056c76f20a365fded15f4e

APP_VERIFIED_HEAD:
fa06138fb2151d1b35e1aa66b6dde96cbfcca263

PR:
#30

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_LEAD_DETAIL_VISUAL_STATIC_AI_RENDER_AND_LOCAL_QUICK_MODAL_GUARD

The historical Stage04 guard required global import of `visual-stage04-lead-detail.css` and static AI follow-up / next-action rail rendering. Current LeadDetail uses later Stage14, Stage211, Stage227E3 and Stage227E4 visual sources. Stage78 explicitly removed the noisy static AI rail cards. The reconciled guard rejects rendered `<LeadAiFollowupDraft>` and `<LeadAiNextAction>` elements without forbidding underlying recommendation-engine symbols elsewhere in the source.

The same historical guard expected local task and event modal state. Current LeadDetail routes task and event creation through the shared `openContextQuickAction` host and consumes `closeflow:context-action-saved` to append saved records before silent refresh.

## Repair

- explicitly reject the inactive Stage04 global CSS import;
- assert current Stage14, Stage211 and Stage227 visual sources;
- assert the Stage78 no-static-AI-rail contract;
- reject obsolete rendered static AI rail components;
- replace stale local task/event modal assertions with shared context-action launcher and save-listener assertions;
- retain the Stage04 stylesheet as historical reference evidence;
- retain lead-to-case, edit, delete, finance, note, task, event and timeline checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R16_WORKFLOW_RUN_ID:
29773886644

G15_R16_WORKFLOW_JOB_ID:
88458499882

FOCUSED_G15_R16_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE04_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29773886831

G15_R6_ARTIFACT_ID:
8473862991

G15_R6_ARTIFACT_DIGEST:
sha256:50aa2726c5349c7c2de5ef67f8a6cf9ae22206182d099294b814ad070ffc34fc

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
12

REPAIRED_COMMAND:
node scripts/check-visual-stage04-lead-detail.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-visual-stage03-leads.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
src/index.css: missing Stage 03 CSS import

NEXT_FAILURE_CLASSIFICATION:
PENDING_NARROW_R17_CLASSIFICATION

EXCLUDED_STALE_DIAGNOSTIC:
Run 29773598419 / artifact 8473752394 contained the earlier local-modal assertion despite naming the newer head and was not used as next-stage evidence.

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

NEXT_STAGE:
LF-PROD-SOT-G15-R17_CLASSIFY_AND_REPAIR_STAGE03_LEADS_GUARD

RESULT: PASS
