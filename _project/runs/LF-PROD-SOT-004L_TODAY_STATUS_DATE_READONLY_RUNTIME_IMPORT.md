# LF-PROD-SOT-004L - Today status/date read-only runtime import

Date: 2026-07-03 13:58 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READONLY_METADATA_IMPORT_ONLY / NO_OUTPUT_DRIFT / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_SUPABASE_API_CHANGE / NO_GCAL_CHANGE / MANUAL_SMOKE_REQUIRED_AFTER_004L

## Linki SOT / mapa wejsciowa

- Centralny indeks map SOT: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
- Poprzedni etap: LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN
- Poprzednia decyzja: TODAY_STATUS_DATE_READONLY_IMPORT_NEXT
- 004K source plan status: TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN_CLOSED
- Ten etap realizuje: READONLY_METADATA_IMPORT_ONLY
- Nastepny etap: LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION

## Import host decision

- selected import host: src/lib/work-items/normalize.ts
- reason: active TodayStable imports normalizeWorkItem from this shared runtime helper, so this is the smallest single metadata-only boundary host.
- import type: METADATA_ONLY_VOID_IMPORT
- output usage: NOT_USED_IN_LOGIC

## Czego nie ruszano

- Today logic: NO_OUTPUT_DRIFT
- TodayStable logic: NO_OUTPUT_DRIFT
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

## No-drift proof

- Today task/event counts: NO_DRIFT_BY_STATIC_CONTRACT
- Today section counts: NO_DRIFT_BY_STATIC_CONTRACT
- Today empty states: NO_DRIFT_BY_STATIC_CONTRACT
- task/event status labels: NO_DRIFT_BY_STATIC_CONTRACT
- done/cancelled/pending labels: NO_DRIFT_BY_STATIC_CONTRACT
- date precedence: NO_DRIFT_BY_STATIC_CONTRACT
- date-only defaults: NO_DRIFT_BY_STATIC_CONTRACT
- scheduledAt/dueAt/startAt behavior: NO_DRIFT_BY_STATIC_CONTRACT
- local Warsaw day boundary: NO_DRIFT_BY_STATIC_CONTRACT
- Google Calendar sync: NOT_TOUCHED
- UI/CSS: NOT_TOUCHED

## Wyniki wykonanych komend

- npm run verify:lf-prod-sot-004k-today-status-date-readonly-runtime-import-plan: PASS
- npm run verify:lf-prod-sot-004l-today-status-date-readonly-runtime-import: PASS
- node --test tests/lf-prod-sot-004l-today-status-date-readonly-runtime-import.test.cjs: PASS
- npm run guard:routes:canonical: PASS
- npm run guard:ui:patch-layers: PASS
- npm run check:polish-mojibake: PASS
- npm run build: PASS_WITH_EXISTING_VITE_CHUNK_WARNINGS or PASS
- git diff --check: PASS

## Risk audit

- This is a real runtime import boundary.
- It remains metadata-only.
- Today counts/status/date output cannot drift.
- Manual smoke is required after 004L before any next runtime import.
- 004M is smoke/decision only.
- Lists/Cards, CaseDetail, Finance and GCal remain blocked.

## Zapis do Obsidiana

- data/time: 2026-07-03 13:58 Europe/Warsaw
- name/alias: LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT
- canonical_name: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
- target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md
- save status: SAVED_BY_LOCAL_AGENT
- Obsidian GitHub sync: DONE_AFTER_OBSIDIAN_COMMIT
- Obsidian local sync: DONE_AFTER_OBSIDIAN_PULL
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- import host: src/lib/work-items/normalize.ts
- runtime touched: METADATA_ONLY_IMPORT_HOST
- tests: PASS
- risk audit: NO_OUTPUT_DRIFT / MANUAL_SMOKE_REQUIRED_AFTER_004L
- what was not touched: UI/CSS/SQL/Supabase/API/GCal/CaseDetail/Finance
- next step: LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION

## Wynik

KONIEC ETAPU LF-PROD-SOT-004L.
MANUAL_SMOKE_REQUIRED_AFTER_004L.
READY_FOR_LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.
## R2 guard-test false-positive repair - 2026-07-03 14:50 Europe/Warsaw

- Previous local run result before R2: GUARD_RED / TEST_RED.
- Root cause: the 004L guard/test required CaseDetailChange and FinanceChange metadata markers, but also incorrectly forbade the raw words CaseDetail and Finance.
- Repair: guard/test now forbid runtime/import snippets only and explicitly keep CaseDetailChange / FinanceChange as required no-drift markers.
- npm run verify:lf-prod-sot-004k-today-status-date-readonly-runtime-import-plan: PASS.
- npm run verify:lf-prod-sot-004l-today-status-date-readonly-runtime-import: PASS_AFTER_R2.
- node --test tests/lf-prod-sot-004l-today-status-date-readonly-runtime-import.test.cjs: PASS_AFTER_R2.
- npm run guard:routes:canonical: PASS.
- npm run guard:ui:patch-layers: PASS.
- npm run check:polish-mojibake: PASS.
- npm run build: PASS_WITH_EXISTING_VITE_CHUNK_WARNINGS.
- git diff --check: PASS.
- Runtime/UI/CSS/SQL/Supabase/API/GCal/CaseDetail/Finance behavior: NOT_TOUCHED.
- 004M created: NO.
