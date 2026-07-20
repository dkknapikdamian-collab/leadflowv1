# LF-PROD-SOT-G15-R19 — Classify and repair Stage01 shell guard

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
28073976c7d293c4c1827ac713496c0e8500a409

APP_EXECUTION_HEAD:
87fff3507e0f69d4f82fdf14e443eaee388ec5a1

PR:
PENDING

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_SHELL_NAVIGATION_AND_GLOBAL_ACTION_GUARD

The Stage01 shell remains active, but its historical guard expected obsolete navigation copy (`Szkice AI`, `Pomoc`) and accepted stale action markers from comments. Current shell uses plan-gated `Inbox szkiców`, `Zgłoszenia`, later compact-shell/operator-trim/Stage211 sources, `OperatorTopBarRuntime`, `VisualFoundationRuntimeStage212M` and the shared context-action host. Current global actions use plan-gated Quick AI Capture / Inbox, direct client and task dialogs, and routed lead/event actions.

## Repair

- retain and verify the active Stage01 shell stylesheet;
- assert current compact shell, operator trim and canvas sources;
- assert current navigation labels and plan-gated Inbox szkiców;
- reject obsolete Szkice AI and Pomoc labels;
- assert current global toolbar plan gates and direct modal contracts;
- retain route bridges, shell scopes, mobile shell and mojibake checks;
- add focused executable tests and an Ubuntu production-build gate.

## Verification evidence

FOCUSED_G15_R19_TESTS:
PENDING_CI

RECONCILED_STAGE01_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_LINT_DIAGNOSTIC:
PENDING_CI

VERCEL_2_CLOSEFLOW:
BLOCKED_BUILD_RATE_LIMIT_ON_TARGET_BRANCH

VERCEL_CLOSEDOCKAPP:
BLOCKED_BUILD_RATE_LIMIT_ON_TARGET_BRANCH

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

RESULT: PENDING_CI
