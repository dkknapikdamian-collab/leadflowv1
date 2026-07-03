# LF-PROD-SOT-004M - Today runtime import smoke and decision

Date: 2026-07-03 18:31 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

TECHNICAL_VERIFY_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / REPO_CLEAN / MANUAL_SMOKE_PENDING / NEXT_RUNTIME_IMPORT_BLOCKED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / NO_GCAL_CHANGE

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

Candidate next planning stages after smoke/decision only:
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

From local run after BOM fix and guard-scope repair:

- git pull --ff-only origin dev-rollout-freeze: PASS / ALREADY_SYNCED_TO_D7F9C3E5
- git status --short --branch: CLEAN
- package.json BOM check: PASS / package.json no BOM
- npm run verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision: PASS
- node --test tests/lf-prod-sot-004m-today-runtime-import-smoke-and-decision.test.cjs: PASS 6/6
- npm run guard:routes:canonical: PASS
- npm run guard:ui:patch-layers: PASS
- npm run check:polish-mojibake: PASS
- npm run build: PASS_WITH_EXISTING_VITE_CHUNK_WARNINGS
- git diff --check: PASS
- final git status --short --branch: CLEAN

## Risk audit

- 004M is technical green but still smoke/decision only.
- 004M does not change runtime.
- Manual production smoke is mandatory before any next runtime import unless owner explicitly defers it.
- 004N is blocked until smoke result and Damian decision are recorded.
- GCal, CaseDetail and Finance remain blocked.
- Vite chunk warnings are existing warnings and not a build failure.

## Zapis do Obsidiana

- data/time: 2026-07-03 18:31 Europe/Warsaw
- name/alias: LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION
- canonical_name: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
- target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.md
- save status: APP_REPORT_UPDATED_BY_GITHUB_CONNECTOR
- Obsidian GitHub sync: PENDING_SEPARATE_OBSIDIAN_UPDATE
- Obsidian local sync: LOCAL_SYNC_PENDING
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- tests: TECHNICAL_VERIFY_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / REPO_CLEAN
- risk audit: NEXT_RUNTIME_IMPORT_BLOCKED_UNTIL_MANUAL_SMOKE_AND_DECISION
- what was not touched: runtime, UI, CSS, SQL, Supabase/API, GCal, CaseDetail, Finance
- next step: production manual smoke and decision before 004N

## Wynik

KONIEC TECHNICZNEJ WERYFIKACJI LF-PROD-SOT-004M.
MANUAL_SMOKE_PENDING.
NEXT_RUNTIME_IMPORT_BLOCKED.
004N_NOT_CREATED.

## R2 owner decision - manual smoke deferred until full rewire - 2026-07-03 18:55 Europe/Warsaw

- Owner decision: Damian will not run manual smoke now.
- Owner reason: manual smoke will be easier after the full read-only rewire is finished.
- Manual smoke status: DEFERRED_BY_OWNER / NOT_PASS.
- This is not a smoke PASS and must not be reported as PASS.
- Queue policy change: continue only with read-only / no-output-drift stages.
- Runtime behavior changes remain forbidden until explicit stage scope allows them.
- UI/CSS/SQL/Supabase/API/GCal/CaseDetail/Finance remain blocked.
- Every next stage must record SMOKE_DEFERRED_DEBT_FROM_004M.
- Full manual smoke remains required before final acceptance / production closeout.
- 004N created in this stage: NO.
- Next allowed step: plan-only or read-only no-drift runtime migration stage, with deferred-smoke debt explicitly recorded.
