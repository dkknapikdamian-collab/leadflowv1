# LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA

Date: 2026-07-05 18:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA
CANONICAL_STATUS_API_CONTRACT_GUARD_ADDED
GUARD_ONLY
CONTRACT_ONLY
NO_RUNTIME_REWIRE
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
SRC_TOUCHED: NO
PACKAGE_ALIAS_ADDED: NO
PACKAGE_ALIAS_NOTE: NOT_ADDED_BY_CONNECTOR_SAFE_WRITE_LIMITATION
PRODUCTION_HOST_SMOKE_NOT_EXECUTED
MANUAL_SMOKE_STILL_NOT_PASS
SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE
FINAL_ACCEPTANCE_BLOCKED
NEXT_STAGE_SELECTED: LF-PROD-SOT-005C-R2_DOMAIN_STATUSES_FACADE_DECISION_DO_POTWIERDZENIA
005C_R2_CREATED: NO

## Linki SOT / mapa wejsciowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Aktualny stan: `10_PROJEKTY/CloseFlow_Lead_App/02_AKTUALNY_STAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`
- Status map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001A_STATUS_MAP.md`
- Status repository: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001B_STATUS_REPOSITORY.md`
- Status usage/source ownership map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005B_STATUS_USAGE_GREP_AND_SOURCE_OWNERSHIP_MAP.md`
- Status rewire plan: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R0_STATUS_REWIRE_PLAN_DO_POTWIERDZENIA.md`

## Zakres etapu

Ten etap dodaje guard i node test dla canonical status API contract.
Nie wykonuje runtime rewire.
Nie zmienia `src/**`.
Nie zmienia UI, CSS, SQL, Supabase/API, Google Calendar, CaseDetail, Finance, runtime data ani `data/flows.json`.

## App changes

Allowed app files changed:

- `scripts/guards/verify-lf-prod-sot-005c-r1-canonical-status-api-contract-guard.cjs`
- `tests/lf-prod-sot-005c-r1-canonical-status-api-contract-guard.test.cjs`
- `_project/runs/LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA.md`

`package.json` was not changed in this connector commit. The alias can be added in a follow-up local-safe repair if required.

## Canonical status API contract

Guard checks that these files exist and expose the expected current contract:

- `src/lib/source-of-truth/status-repository.ts`
- `src/lib/source-of-truth/lead-options.ts`
- `src/lib/source-of-truth/case-options.ts`
- `src/lib/config/lead-status.ts`
- `src/lib/config/case-status.ts`

Guard treats the current canonical contract as:

- `statusRepository`
- `STATUS_REPOSITORY_SOURCE_MAP`
- `StatusRepositorySection`
- `items`
- `labels`
- `tones`
- `closedValues`
- `legacyAliases`
- lead/case source-of-truth option/meta files
- lead/case config facades

## New duplication guard

Guard scans status-map/list patterns and fails if a new unclassified local status map/list appears outside the known 005B debt whitelist.

Blocked/unclassified patterns include:

- `CLOSED_STATUSES`
- `OPEN_CASE_STATUSES`
- `PAID_LIKE_STATUSES`
- `DUE_LIKE_STATUSES`
- `STATUS_LABELS`
- `STATUS_TONES`
- `STATUS_COLORS`
- `LEGACY_STATUS_MAP`
- `caseStatusMap`
- `leadStatusMap`
- `statusMap`
- `statusLabels`

Known debt remains allowed only as debt until later scoped stages.

## Known legacy debt

Known status debt from 005B remains not repaired in this stage:

- `src/lib/domain-statuses.ts`
- `src/lib/data-contract.ts`
- `src/lib/lead-health.ts`
- `src/lib/scheduling.ts`
- `src/lib/lead-finance.ts`
- `src/lib/finance/case-finance-source.ts`
- `src/lib/owner-control/*`
- `src/lib/reminders.ts`
- `src/lib/topic-contact.ts`
- `src/pages/CaseDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Cases.tsx`
- `src/components/work-item-card.tsx`
- `src/components/detail/MissingItemsManagerDialog.tsx`
- `src/components/ContextActionDialogs.tsx`

## Guard/test results

Prepared commands:

```txt
node scripts/guards/verify-lf-prod-sot-005c-r1-canonical-status-api-contract-guard.cjs
node --test tests/lf-prod-sot-005c-r1-canonical-status-api-contract-guard.test.cjs
git diff --check
```

Connector limitation: local app tests/build were not executed by ChatGPT. Damian must run local verification after pulling the commit.

## Co nie bylo ruszane

```txt
src/**: NOT_CHANGED
runtime/UI/CSS: NOT_CHANGED
SQL/Supabase/API: NOT_CHANGED
Google Calendar: NOT_CHANGED
CaseDetail runtime: NOT_CHANGED
Finance runtime: NOT_CHANGED
runtime/data/**: NOT_CHANGED
data/flows.json: NOT_CHANGED
_project/tmp/**: NOT_CHANGED
.env*: NOT_CHANGED
dist/**: NOT_CHANGED
```

## Ryzyka

- This is guard/contract only. It does not fix status drift.
- `status-repository.ts` still imports domain/options sources and is not standalone runtime owner.
- `domain-statuses.ts` still owns values, normalizers and legacy maps.
- `package.json` alias was not added in this connector commit.
- Final acceptance remains blocked until local verification and Obsidian status sync.

## Zapis do Obsidiana

```txt
data/time: 2026-07-05 18:00 Europe/Warsaw
name/alias: LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA
canonical_name: CloseFlow / LeadFlow
repo app: dkknapikdamian-collab/leadflowv1
branch app: dev-rollout-freeze
local path app: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
app commit: TO_BE_FILLED_AFTER_PUSH
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
save status app repo: APP_REPORT_ADDED
Obsidian GitHub sync: PENDING
Obsidian local sync: LOCAL_SYNC_PENDING
tests: LOCAL_REVERIFY_PENDING
risk audit: no runtime rewire; package alias not added in connector commit
what was not touched: src, runtime, UI, CSS, SQL, Supabase/API, GCal, CaseDetail, Finance, runtime data, data/flows, _project/tmp
next step: local pull, run guard/test, then Obsidian report/router/status sync
```
