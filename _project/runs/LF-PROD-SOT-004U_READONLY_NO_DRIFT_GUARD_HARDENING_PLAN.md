# LF-PROD-SOT-004U - Read-only/no-drift guard hardening plan

Date: 2026-07-04 08:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN / GUARD_HARDENING_PLAN_ONLY / PLAN_ONLY / NO_RUNTIME_CHANGE / NO_OUTPUT_DRIFT / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_SUPABASE_API_CHANGE / NO_GCAL_CHANGE / NO_CASEDETAIL_CHANGE / NO_FINANCE_CHANGE / NO_RUNTIME_DATA_CHANGE / NO_DATA_FLOWS_CHANGE / PRODUCTION_HOST_SMOKE_NOT_EXECUTED / MANUAL_SMOKE_STILL_NOT_PASS / SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE / FINAL_ACCEPTANCE_BLOCKED / NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION / 004V_CREATED: NO / GUARD_HELPER_CREATED: NO

## Current constraints

- Production smoke: PRODUCTION_HOST_SMOKE_NOT_EXECUTED.
- Manual smoke: MANUAL_SMOKE_STILL_NOT_PASS.
- Smoke debt: SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE.
- Final acceptance: FINAL_ACCEPTANCE_BLOCKED.
- Next stages allowed only if read-only/no-drift.
- This stage is plan-only and guard-hardening-plan only.

## Guard-hardening objective

Future read-only/no-drift stages must be guarded by one common contract helper or guard pattern.

Every following read-only/no-drift stage must declare and verify:

- no runtime change,
- no output drift,
- no UI/CSS,
- no SQL/Supabase/API,
- no GCal,
- no CaseDetail,
- no Finance,
- no runtime/data,
- no data/flows.json,
- no smoke PASS claim,
- no final acceptance claim.

## Proposed future allowed implementation shape

Future stage 004V may add this helper:

```txt
scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs
```

This 004U stage does not create that helper.

GUARD_HELPER_CREATED: NO

## Required future guard checks

Future guard contract must check changed files allowlist per stage.

Forbidden prefixes for future read-only/no-drift stages:

```txt
src/pages/
src/components/
src/styles/
src/index.css
src/lib/calendar-items.ts
src/lib/work-items/normalize.ts
src/lib/clients.ts
src/lib/cases.ts
src/lib/google-calendar
src/lib/gcal
src/lib/calendar-sync
src/lib/calendar-provider
src/pages/CaseDetail.tsx
src/lib/finance/
supabase/
migrations/
sql/
runtime/data/
data/flows.json
```

Forbidden positive-claim categories for future helper checks:

```txt
manual/host/today/tasks/calendar/lists smoke pass claims
smoke debt resolved claims
final acceptance pass or unblocked claims
production verified claims
runtime import completed claims
output/UI/CSS/GCal/SQL changed claims
```

## Selected next stage

NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION
004V_CREATED: NO

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
Runtime helper created: NO
UI output changed: NO

## Smoke and acceptance ledger

PRODUCTION_HOST_SMOKE_NOT_EXECUTED
MANUAL_SMOKE_STILL_NOT_PASS
SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE
FINAL_ACCEPTANCE_BLOCKED

Does this stage claim smoke PASS: NO
Does this stage claim final acceptance: NO

## Scope result

KONIEC ETAPU LF-PROD-SOT-004U.
GUARD_HARDENING_PLAN_ONLY.
PLAN_ONLY.
NO_RUNTIME_CHANGE.
NO_OUTPUT_DRIFT.
PRODUCTION_HOST_SMOKE_NOT_EXECUTED.
MANUAL_SMOKE_STILL_NOT_PASS.
SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE.
FINAL_ACCEPTANCE_BLOCKED.
NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.
004V_CREATED: NO.
GUARD_HELPER_CREATED: NO.
