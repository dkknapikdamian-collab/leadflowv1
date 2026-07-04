# LF-PROD-SOT-004V - Read-only/no-drift guard helper implementation

Date: 2026-07-04 09:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION / GUARD_HELPER_IMPLEMENTATION_ONLY / PLAN_SUPPORT_ONLY / NO_RUNTIME_CHANGE / NO_OUTPUT_DRIFT / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_SUPABASE_API_CHANGE / NO_GCAL_CHANGE / NO_CASEDETAIL_CHANGE / NO_FINANCE_CHANGE / NO_RUNTIME_DATA_CHANGE / NO_DATA_FLOWS_CHANGE / PRODUCTION_HOST_SMOKE_NOT_EXECUTED / MANUAL_SMOKE_STILL_NOT_PASS / SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE / FINAL_ACCEPTANCE_BLOCKED / GUARD_HELPER_CREATED: YES / NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD / 004W_CREATED: NO

## Stage scope

This stage creates a shared guard helper only:

```txt
scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs
```

It does not change product runtime, output, UI, CSS, SQL, Supabase/API, GCal, CaseDetail, Finance, runtime/data, or data/flows.json.

## Helper contract

Created helper exports:

```txt
assertRequiredTokens
assertForbiddenTokensAbsent
assertNoForbiddenChangedFiles
assertNoFutureStageCreated
assertFileExists
readText
DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES
DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS
```

## Required future behavior

Following read-only/no-drift stages can use the helper to enforce:

- required stage-status tokens,
- forbidden claim categories,
- changed-file allowlists,
- future-stage absence checks,
- file existence checks,
- UTF-8 text reads with BOM stripping.

## Selected next stage

NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD
004W_CREATED: NO

## No-change contract

NO_RUNTIME_CHANGE
NO_OUTPUT_DRIFT
NO_UI_CHANGE
NO_CSS_CHANGE
NO_SQL_CHANGE
NO_SUPABASE_API_CHANGE
NO_GCAL_CHANGE
NO_CASEDETAIL_CHANGE
NO_FINANCE_CHANGE
NO_RUNTIME_DATA_CHANGE
NO_DATA_FLOWS_CHANGE

Runtime/data changed: NO
Data/flows.json changed: NO
UI output changed: NO
Product behavior changed: NO

## Smoke and acceptance ledger

PRODUCTION_HOST_SMOKE_NOT_EXECUTED
MANUAL_SMOKE_STILL_NOT_PASS
SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE
FINAL_ACCEPTANCE_BLOCKED

Does this stage claim smoke completion: NO
Does this stage claim final acceptance completion: NO

## Scope result

KONIEC ETAPU LF-PROD-SOT-004V.
GUARD_HELPER_IMPLEMENTATION_ONLY.
PLAN_SUPPORT_ONLY.
NO_RUNTIME_CHANGE.
NO_OUTPUT_DRIFT.
PRODUCTION_HOST_SMOKE_NOT_EXECUTED.
MANUAL_SMOKE_STILL_NOT_PASS.
SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE.
FINAL_ACCEPTANCE_BLOCKED.
GUARD_HELPER_CREATED: YES.
NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.
004W_CREATED: NO.

## Zapis do Obsidiana

Target Obsidian file:

```txt
10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md
```
