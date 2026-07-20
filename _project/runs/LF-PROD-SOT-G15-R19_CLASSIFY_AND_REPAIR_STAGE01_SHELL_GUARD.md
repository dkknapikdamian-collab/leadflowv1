# LF-PROD-SOT-G15-R19 — Classify and repair Stage01 shell guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
PASS_CODE_AND_CI_READY_MERGE_BLOCKED_BY_VERCEL_RATE_LIMIT

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
28073976c7d293c4c1827ac713496c0e8500a409

APP_VERIFIED_HEAD:
6b6104fb04e27fa531c362ffe0f463fcb0ec601c

PR:
#33

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_SHELL_CSS_NAVIGATION_AND_GLOBAL_ACTION_GUARD

The historical Stage01 guard treated `visual-stage01-shell.css` as active and expected obsolete navigation copy (`Szkice AI`, `Pomoc`). Current `src/index.css` no longer imports that stylesheet. Current shell source truth is provided by compact-shell, operator-trim and Stage211 canvas styles plus `OperatorTopBarRuntime`, `VisualFoundationRuntimeStage212M` and the shared context-action host. Current navigation uses plan-gated `Inbox szkiców` and `Zgłoszenia`. Current global actions use plan-gated Quick AI Capture / Inbox, direct client and task dialogs, and routed lead/event actions.

Restoring the historical Stage01 CSS or obsolete navigation labels would regress the current shell.

## Repair

- explicitly reject the inactive Stage01 shell CSS import;
- retain the Stage01 stylesheet as historical reference evidence;
- assert current compact shell, operator trim and canvas sources;
- assert current navigation labels and plan-gated Inbox szkiców;
- reject obsolete Szkice AI and Pomoc navigation items;
- assert current global toolbar plan gates and direct modal contracts;
- retain route bridges, shell scopes, mobile shell and mojibake checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

G15_R19_WORKFLOW_RUN_ID:
29775188547

G15_R19_WORKFLOW_JOB_ID:
88462759483

FOCUSED_G15_R19_TESTS:
5 PASS / 0 FAIL

RECONCILED_STAGE01_GUARD:
PASS

PRODUCTION_BUILD:
PASS

G15_R6_DIAGNOSTIC_RUN_ID:
29775188397

G15_R6_DIAGNOSTIC_JOB_ID:
88462758833

G15_R6_ARTIFACT_ID:
8474356329

G15_R6_ARTIFACT_DIGEST:
sha256:cca9266bcba9c00c31c899a042a8d7ec226663a0567125f55878dc9a41137618

COMMANDS_PASSED_BEFORE_NEXT_FAILURE:
19

REPAIRED_COMMAND:
node scripts/check-visual-stage01-shell.cjs — PASS

NEXT_FIRST_NONZERO_COMMAND:
node scripts/check-client-inline-edit-and-task-edit.cjs

NEXT_FIRST_NONZERO_EXIT_CODE:
1

NEXT_FAILURE_OUTPUT:
ClientDetail missing phone copy icon

NEXT_STAGE:
LF-PROD-SOT-G15-R20_CLASSIFY_AND_REPAIR_CLIENT_INLINE_EDIT_AND_TASK_EDIT_GUARD

NEXT_STAGE_STATUS:
IDENTIFIED_NOT_STARTED_DUE_DEPLOYMENT_BLOCKER

## Deployment blocker

TARGET_BRANCH_HEAD:
28073976c7d293c4c1827ac713496c0e8500a409

VERCEL_2_CLOSEFLOW:
BLOCKED_BUILD_RATE_LIMIT

VERCEL_CLOSEDOCKAPP:
BLOCKED_BUILD_RATE_LIMIT

FAILED_DEPLOYMENT_RETRY_HEADS:
- 89a52bcccbe01f9a427326278f190ec82ad8d0bb
- 9735166175ddfe685d16f870b95d97134e484d79
- 28073976c7d293c4c1827ac713496c0e8500a409

BLOCKER_CLASSIFICATION:
EXTERNAL_ACCOUNT_BUILD_RATE_LIMIT_NOT_CODE_FAILURE

## Scope

MUTATED_FILES:
- scripts/check-visual-stage01-shell.cjs
- tests/lf-prod-sot-g15-r19-stage01-shell-guard.test.cjs
- .github/workflows/g15-r19-stage01-shell-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
LAYOUT_TSX_CHANGED: NO
GLOBAL_QUICK_ACTIONS_TSX_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

MERGE_POLICY:
DO_NOT_MERGE_WHILE_BOTH_TARGET_DEPLOYMENTS_ARE_RATE_LIMITED

RESULT:
PASS_CODE_AND_CI_READY_MERGE_BLOCKED_BY_EXTERNAL_DEPLOYMENT_LIMIT
