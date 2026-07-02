# LF-PROD-SOT-004D - Lists/cards status/date visual bridge

## Status

LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READY_FOR_004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE

## Linki SOT / mapa wejściowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Mapa wejściowa użyta przez ten etap: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md`
- Poprzedni zamknięty etap Obsidian 004B: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md`
- Poprzedni zamknięty etap Obsidian 004C: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md`
- Poprzedni zamknięty etap app run 004C: `_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md`
- Ten etap korzysta z mapy: `LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP`
- Ten etap jest konsumentem mapy: `LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE`
- Zasada: nie duplikować całej mapy; trzymać link, status, decyzję, guardy i wynik.

## Zakres

Etap dodaje wyłącznie read-only bridge dla list/kart:
- Leads list/card
- Clients list/card
- Cases list/card

Etap nie podpina bridge do runtime widoków.
Etap nie zmienia widocznego outputu.
Etap nie dotyka CaseDetail.

## Dodane pliki 004D

- `src/lib/source-of-truth/lists-cards-readonly-bridge.ts`
- `scripts/guards/verify-lf-prod-sot-004d-lists-cards-readonly-bridge.cjs`
- `tests/lf-prod-sot-004d-lists-cards-readonly-bridge.test.cjs`
- `_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md`
- `package.json` alias: `verify:lf-prod-sot-004d-lists-cards-readonly-bridge`

## Twarde reguły

- runtimeBehaviorChange: FORBIDDEN
- uiChange: FORBIDDEN
- cssChange: FORBIDDEN
- sortingChange: FORBIDDEN
- filteringChange: FORBIDDEN
- listCountChange: FORBIDDEN
- cardLabelChange: FORBIDDEN
- statusBucketChange: FORBIDDEN
- statusLabelChange: FORBIDDEN
- datePrecedenceChange: FORBIDDEN
- silenceMarkerChange: FORBIDDEN
- nextActionLabelChange: FORBIDDEN
- clientHealthRecalculation: FORBIDDEN
- clientSourcePortalMerge: FORBIDDEN
- caseLifecycleRecalculation: FORBIDDEN
- CaseDetailRuntimeAdoption: FORBIDDEN_UNTIL_004F
- badgeChange: FORBIDDEN
- colorChange: FORBIDDEN
- googleCalendarSyncChange: FORBIDDEN
- dataWriteChange: FORBIDDEN
- sourceOfTruthUsage: GUARDS_TESTS_READONLY_BRIDGE_ONLY
- LeadsRuntimeAdoption: NOT_STARTED
- LeadDetailRuntimeAdoption: NOT_STARTED
- ClientsRuntimeAdoption: NOT_STARTED
- ClientDetailRuntimeAdoption: NOT_STARTED
- CasesRuntimeAdoption: NOT_STARTED
- visibleOutputDrift: FORBIDDEN
- manualSmokeRequiredByDamian: REQUIRED_BEFORE_RUNTIME_IMPORT

## Czego nie ruszano

- Leads runtime: NOT_TOUCHED
- LeadDetail runtime: NOT_TOUCHED
- Clients runtime: NOT_TOUCHED
- ClientDetail runtime: NOT_TOUCHED
- Cases runtime: NOT_TOUCHED
- CaseDetail runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004F
- Today runtime: NOT_TOUCHED
- TodayStable runtime: NOT_TOUCHED
- runtime behavior: NOT_TOUCHED
- sorting: NOT_TOUCHED
- filtering: NOT_TOUCHED
- list counts: NOT_TOUCHED
- status buckets: NOT_TOUCHED
- status labels: NOT_TOUCHED
- date precedence: NOT_TOUCHED
- silence markers: NOT_TOUCHED
- next-action labels: NOT_TOUCHED
- client health: NOT_TOUCHED
- client source/portal: NOT_TOUCHED
- case lifecycle: NOT_TOUCHED
- badges/colors: NOT_TOUCHED
- CSS: NOT_TOUCHED
- Tailwind config: NOT_TOUCHED
- UI components: NOT_TOUCHED
- status repository: NOT_TOUCHED
- date-time repository: NOT_TOUCHED
- visual repository: NOT_TOUCHED
- SQL: NOT_TOUCHED
- Supabase/API: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- routing/auth: NOT_TOUCHED
- Finance: NOT_TOUCHED
- LF-PROD-SOT-004E: NOT_STARTED

## Wyniki wykonanych komend

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: PASS
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: PASS
- `npm run verify:lf-prod-sot-004d-lists-cards-readonly-bridge`: PASS
- `node --test tests/lf-prod-sot-004d-lists-cards-readonly-bridge.test.cjs`: PASS
- `npm run guard:routes:canonical`: PASS
- `npm run guard:ui:patch-layers`: PASS
- `npm run check:polish-mojibake`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Risk audit

- Leads/LeadDetail mają MEDIUM/HIGH risk przez lastContactAt, silence 7/14 i next action fallback.
- Clients/ClientDetail mają MEDIUM risk przez mieszanie source/health/portal/activity.
- Cases list może dostać read-only policy, ale CaseDetail jest zablokowany do 004F.
- Etap nie przepina runtime i nie zmienia widocznego outputu.
- Realne podpięcie bridge do list/kart wymaga osobnego runtime adoption i manual smoke Damiana.
- Calendar/Google Calendar boundary pozostaje zablokowane do 004G.
- Finance/Billing pozostają poza tym etapem.

## Wynik

KONIEC ETAPU LF-PROD-SOT-004D.

## R2 BOM/build closeout � 2026-07-02 09:00 Europe/Warsaw

Status korekty:
- R1 code/guard/test zosta� wypchni�ty jako commit 87a696fd.
- R1 build by� RED przed commitem z powodu UTF-8 BOM na pocz�tku package.json.
- R2 usuwa BOM z package.json.
- Po R2 wymagane: 004D guard PASS, node test PASS, routes guard PASS, UI patch guard PASS, mojibake PASS, build PASS, git diff --check PASS.
- To nie zmienia runtime, UI, CSS, SQL, Supabase/API, Google Calendar ani CaseDetail.

