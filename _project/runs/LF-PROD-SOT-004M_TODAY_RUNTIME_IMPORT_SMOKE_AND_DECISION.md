# LF-PROD-SOT-004M - Today runtime import smoke and decision

Date: 2026-07-03 15:22 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

MANUAL_SMOKE_PENDING / NEXT_RUNTIME_IMPORT_BLOCKED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_GCAL_CHANGE

## Linki SOT / mapa wejsciowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Poprzedni etap: `LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT`
- Poprzedni import host: `src/lib/work-items/normalize.ts`
- Poprzedni import type: `READONLY_METADATA_IMPORT_ONLY`
- Ten etap realizuje: `MANUAL_SMOKE_REQUIRED_AFTER_004L`

## Manual smoke checklist

- Today page checked: PENDING
- TodayStable page checked: PENDING
- Tasks page sanity checked: PENDING
- TasksStable page sanity checked: PENDING
- Today task/event counts checked: PENDING
- Today section counts checked: PENDING
- empty states checked: PENDING
- task/event status labels checked: PENDING
- date precedence checked: PENDING
- date-only defaults checked: PENDING
- local Warsaw day boundary checked: PENDING
- Google Calendar sync untouched checked: PENDING
- console errors checked: PENDING

## Smoke result

MANUAL_SMOKE_PENDING

## Decision

NEXT_RUNTIME_IMPORT_DECISION:
DECISION_REQUIRED_BEFORE_004N

Candidate next planning stages:
- LF-PROD-SOT-004N_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN
- LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN
- LF-PROD-SOT-004N_CALENDAR_FOLLOWUP_BOUNDARY_SMOKE_EXTENSION

Nie tworzono 004N.
Nie wdrazano kolejnego runtime importu.

## Czego nie ruszano

- runtime changes in 004M: NONE
- Today runtime: NOT_TOUCHED
- TodayStable runtime: NOT_TOUCHED
- Tasks runtime: NOT_TOUCHED
- TasksStable runtime: NOT_TOUCHED
- Calendar runtime: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- Google Calendar mapper: NOT_TOUCHED
- remote calendar provider: NOT_TOUCHED
- UI components: NOT_TOUCHED
- CSS: NOT_TOUCHED
- SQL: NOT_TOUCHED
- Supabase/API: NOT_TOUCHED
- CaseDetail runtime: NOT_TOUCHED
- Finance runtime: NOT_TOUCHED

## Wyniki wykonanych komend

- npm run verify:lf-prod-sot-004l-today-status-date-readonly-runtime-import: NOT_RUN_BY_GITHUB_CONNECTOR
- npm run verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision: BLOCKED_UNTIL_PACKAGE_ALIAS_ADDED_LOCALLY_OR_BY_FULL_FILE_UPDATE
- node --test tests/lf-prod-sot-004m-today-runtime-import-smoke-and-decision.test.cjs: NOT_RUN_BY_GITHUB_CONNECTOR
- npm run guard:routes:canonical: NOT_RUN_BY_GITHUB_CONNECTOR
- npm run guard:ui:patch-layers: NOT_RUN_BY_GITHUB_CONNECTOR
- npm run check:polish-mojibake: NOT_RUN_BY_GITHUB_CONNECTOR
- npm run build: NOT_RUN_BY_GITHUB_CONNECTOR
- git diff --check: NOT_RUN_BY_GITHUB_CONNECTOR

## Risk audit

- 004L was a real runtime import boundary.
- 004M does not change runtime.
- Manual smoke is mandatory before any next runtime import.
- Smoke is currently pending, so next runtime import is blocked.
- 004N is blocked until smoke result and Damian decision are recorded.
- GCal, CaseDetail and Finance remain blocked.
- This report was created through GitHub connector, which cannot run local npm/build commands.

## Zapis do Obsidiana

- data/time: 2026-07-03 15:22 Europe/Warsaw
- name/alias: LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION
- canonical_name: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
- target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.md
- save status: APP_REPORT_SAVED_BY_GITHUB_CONNECTOR
- Obsidian GitHub sync: PENDING
- Obsidian local sync: LOCAL_SYNC_PENDING
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- smoke result: MANUAL_SMOKE_PENDING
- next runtime import decision: DECISION_REQUIRED_BEFORE_004N
- tests: NOT_RUN_BY_GITHUB_CONNECTOR
- risk audit: NEXT_RUNTIME_IMPORT_BLOCKED
- what was not touched: runtime, UI, CSS, SQL, Supabase/API, GCal, CaseDetail, Finance
- next step: run local/package verification and production smoke

## Wynik

KONIEC ETAPU LF-PROD-SOT-004M.
NEXT_RUNTIME_IMPORT_BLOCKED.
