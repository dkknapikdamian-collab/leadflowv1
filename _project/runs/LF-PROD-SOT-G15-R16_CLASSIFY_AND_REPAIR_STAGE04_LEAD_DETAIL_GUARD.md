# LF-PROD-SOT-G15-R16 — Classify and repair Stage04 LeadDetail guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
4c637f84575867efd8056c76f20a365fded15f4e

APP_EXECUTION_HEAD:
eef83c4cceec413babf92768af1fbeb3da1f6be1

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_LEAD_DETAIL_VISUAL_AND_STATIC_AI_GUARD

The historical Stage04 guard required global import of `visual-stage04-lead-detail.css` and static `LeadAiFollowupDraft` / `LeadAiNextAction` rail components. Current LeadDetail uses later Stage14, Stage211, Stage227E3 and Stage227E4 visual sources. Stage78 explicitly removed the noisy static AI follow-up rail cards while preserving the wider AI draft engine outside that rail. Restoring the old CSS or components would regress the current cockpit.

## Repair

- explicitly reject the inactive Stage04 global CSS import;
- assert current Stage14, Stage211 and Stage227 visual sources;
- assert the Stage78 no-static-AI-card contract;
- reject obsolete static AI rail components;
- retain the Stage04 stylesheet as historical reference evidence;
- retain lead-to-case, edit, delete, finance, note, task, event and tab checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R16_TESTS:
PENDING_CI

RECONCILED_STAGE04_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_LINT_DIAGNOSTIC:
PENDING_CI

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

RESULT: PENDING_CI
