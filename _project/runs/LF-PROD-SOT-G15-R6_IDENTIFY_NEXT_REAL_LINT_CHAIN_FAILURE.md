# LF-PROD-SOT-G15-R6 — Identify next real lint-chain failure

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
EXECUTION_PENDING_WORKFLOW_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
fe48efc197b92fb2ab6d23999a50076b4f279c11

## Scope

- add a diagnostic runner that reads the existing `scripts.lint` chain;
- preserve command order and stop on the first non-zero exit code;
- normalize `npm.cmd` to `npm` only outside Windows;
- store complete stdout/stderr for every executed command in a workflow artifact;
- add a focused runner contract test and an isolated diagnostic workflow;
- do not modify runtime, product behavior, dependencies, SQL, schema, RLS or Google Calendar behavior.

## Acceptance pending

The stage remains open until the workflow artifact proves:

- every command that passed before the failure;
- exact first non-zero command;
- exit code;
- complete failure output;
- failure classification and affected files;
- one narrow proposed repair stage.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER
