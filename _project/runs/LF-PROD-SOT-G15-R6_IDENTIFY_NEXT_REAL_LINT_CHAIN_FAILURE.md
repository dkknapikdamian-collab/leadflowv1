# LF-PROD-SOT-G15-R6 — Identify next real lint-chain failure

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
IMPLEMENTED_PENDING_DIAGNOSTIC_WORKFLOW_EVIDENCE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
fe48efc197b92fb2ab6d23999a50076b4f279c11

BRANCH:
g15-r6-identify-first-lint-failure

## Purpose

Identify the first real command inside the historical lint chain that returns non-zero after G15-R5 repaired the Windows-only `npm.cmd` entry on Ubuntu.

## Diagnostic design

- parse `scripts.lint` from `package.json` without duplicating the chain;
- preserve command order and quoted `&&` content;
- normalize `npm.cmd` to `npm` only on non-Windows platforms;
- execute one command at a time;
- stop at the first non-zero exit code;
- save complete per-command logs, `diagnostic.json` and `diagnostic.txt`;
- print only command summaries and the bounded failure tail to the workflow log;
- upload the full diagnostic directory as a GitHub Actions artifact.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED
CI_FAILURE_HIDDEN: NO

## Acceptance

- diagnostic runner tests: 8 PASS / 0 FAIL;
- original lint order preserved;
- exact first non-zero command identified;
- original exit code captured;
- all earlier command PASS results recorded;
- full log artifact uploaded;
- cause classified from evidence;
- one narrow next repair stage proposed;
- no product repair is implemented in G15-R6.

CURRENT_FAILURE_IDENTITY:
INSUFFICIENT_EVIDENCE_PENDING_WORKFLOW

PROPOSED_NEXT_STAGE:
PENDING_DIAGNOSTIC_RESULT
