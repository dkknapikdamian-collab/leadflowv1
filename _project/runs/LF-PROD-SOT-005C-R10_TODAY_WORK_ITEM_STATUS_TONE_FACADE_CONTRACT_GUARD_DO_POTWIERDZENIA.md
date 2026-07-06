# LF-PROD-SOT-005C-R10_TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA

Date: 2026-07-06 11:35 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
App repo: dkknapikdamian-collab/leadflowv1
App branch: dev-rollout-freeze

## Status

```txt
LF-PROD-SOT-005C-R10_TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA
TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_CREATED
CONTRACT_GUARD_STAGE
PARTIAL_CONNECTOR_IMPLEMENTATION
NO_WORK_ITEM_CARD_RUNTIME_REWIRE
NO_TODAYSTABLE_CALLSITE_REWIRE
NO_RUNTIME_REWIRE
NO_RUNTIME_CHANGE
SRC_TOUCHED: YES_ONLY_SOURCE_OF_TRUTH_TODAY_WORK_ITEM_STATUS_CONTRACT
PACKAGE_ALIAS_ADDED: PENDING_LOCAL_PATCH_REQUIRED
NO_ACTION_CALLBACK_CHANGE
NO_DONE_EDIT_DELETE_RESCHEDULE_OPEN_CHANGE
NO_TASK_EVENT_MUTATION_CHANGE
NO_CASEDETAIL_CHANGE
NO_LEADDETAIL_CHANGE
NO_CLIENTDETAIL_CHANGE
NO_FINANCE_CHANGE
NO_SQL_CHANGE
NO_SUPABASE_API_CHANGE
NO_RUNTIME_DATA_CHANGE
NO_DATA_FLOWS_CHANGE
NO_CSS_UI_REDESIGN
NO_MANUAL_SMOKE_NOW
MANUAL_SMOKE_DEFERRED_TO_FINAL_SERIES_GATE
GUARD_CREATED
NODE_TEST_CREATED
BUILD_NOT_EXECUTED_BY_CHATGPT
DIFF_CHECK_NOT_EXECUTED_BY_CHATGPT
APP_PUSH_PARTIAL_DONE
NEXT_STAGE_SELECTED: HOLD_UNTIL_PACKAGE_ALIAS_AND_LOCAL_TESTS_PASS
005C_R11_CREATED: NO
```

## Changed files

```txt
src/lib/source-of-truth/today-work-item-status.ts
scripts/guards/verify-lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.cjs
tests/lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.test.cjs
_project/runs/LF-PROD-SOT-005C-R10_TODAY_WORK_ITEM_STATUS_TONE_FACADE_CONTRACT_GUARD_DO_POTWIERDZENIA.md
```

## Contract file

```txt
src/lib/source-of-truth/today-work-item-status.ts
```

Exports:

```txt
TodayWorkItemKind
TodayWorkItemTone
isTodayWorkItemClosed
isTodayWorkItemOverdue
getTodayWorkItemStatusLabel
getTodayWorkItemStatusTone
```

## Behavior parity contract

```txt
closed/done status => Zrobione / success
overdue non-closed item => Zaległe / danger
item scheduled for today => Dziś / neutral
future/planned task => Zaplanowane zadanie / neutral
future/planned event => Zaplanowane wydarzenie / neutral
```

## Guard / test

```txt
guard path:
scripts/guards/verify-lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.cjs

test path:
tests/lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.test.cjs
```

## Connector limitation

```txt
ChatGPT GitHub connector created the contract, guard, test, and report.
Package.json is very large and the connector only exposes whole-file replacement, not safe patch editing.
The package alias still requires local patch before R10 can be marked PASS.
```

Required package alias:

```json
"verify:lf-prod-sot-005c-r10": "node scripts/guards/verify-lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.cjs"
```

## Tests to run locally before closeout

```powershell
node scripts/guards/verify-lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.cjs
node --test tests/lf-prod-sot-005c-r10-today-work-item-status-tone-facade-contract.test.cjs
npm run build
git diff --check
```

## Scope preserved

```txt
WorkItemCard runtime rewire: NO
TodayStable call-site rewire: NO
action callbacks changed: NO
task/event mutation logic changed: NO
SQL/Supabase/API touched: NO
runtime/data touched: NO
data/flows.json touched: NO
CSS/UI redesign: NO
manual smoke: NOT_EXECUTED / DEFERRED
```

## Current blocker

```txt
BLOCKER:
PACKAGE_ALIAS_ADDED: PENDING_LOCAL_PATCH_REQUIRED
LOCAL_TESTS: PENDING_USER_TERMINAL
BUILD: PENDING_USER_TERMINAL
DIFF_CHECK: PENDING_USER_TERMINAL
```

## Next step

```txt
Apply package.json alias locally, run guard/test/build/diff, then close R10 and update Obsidian/router if PASS.
```
