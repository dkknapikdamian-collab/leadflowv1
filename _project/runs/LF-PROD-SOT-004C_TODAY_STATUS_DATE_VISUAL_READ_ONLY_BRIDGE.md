# LF-PROD-SOT-004C - Today/status/date visual read-only bridge

## Status

TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READY_FOR_004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE

## Linki SOT / mapa wejściowa

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Mapa wejsciowa uzyta przez ten etap: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md`
- Poprzedni zamkniety etap Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md`
- Poprzedni zamkniety etap app run: `_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md`
- Ten etap korzysta z mapy: `LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP`
- Ten etap jest konsumentem mapy: `LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE`
- Zasada: nie duplikowac calej mapy; trzymac link, status, decyzje, guardy i wynik.

## Zakres

Etap dodaje wylacznie read-only bridge dla Today / TodayStable.
Nie podpina bridge do runtime widokow.
Nie zmienia widocznego outputu.

## Dodane pliki 004C

- `src/lib/source-of-truth/today-readonly-bridge.ts`
- `scripts/guards/verify-lf-prod-sot-004c-today-readonly-bridge.cjs`
- `tests/lf-prod-sot-004c-today-readonly-bridge.test.cjs`
- `_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md`
- `package.json` alias: `verify:lf-prod-sot-004c-today-readonly-bridge`

## Twarde reguly

- runtimeBehaviorChange: FORBIDDEN
- uiChange: FORBIDDEN
- cssChange: FORBIDDEN
- sortingChange: FORBIDDEN
- filteringChange: FORBIDDEN
- bucketChange: FORBIDDEN
- datePrecedenceChange: FORBIDDEN
- statusLabelChange: FORBIDDEN
- badgeChange: FORBIDDEN
- colorChange: FORBIDDEN
- googleCalendarSyncChange: FORBIDDEN
- dataWriteChange: FORBIDDEN
- sourceOfTruthUsage: GUARDS_TESTS_READONLY_BRIDGE_ONLY
- TodayRuntimeAdoption: NOT_STARTED
- TodayStableRuntimeAdoption: NOT_STARTED
- manualSmokeRequiredByDamian: REQUIRED_BEFORE_RUNTIME_IMPORT

## Czego nie ruszano

- Today runtime: NOT_TOUCHED
- TodayStable runtime: NOT_TOUCHED
- runtime behavior: NOT_TOUCHED
- sorting: NOT_TOUCHED
- filtering: NOT_TOUCHED
- date buckets: NOT_TOUCHED
- status labels: NOT_TOUCHED
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
- CaseDetail runtime: NOT_TOUCHED
- LF-PROD-SOT-004D: NOT_STARTED

## Wyniki wykonanych komend

- `npm run verify:lf-prod-sot-004b-readonly-runtime-adoption`: PASS
- `npm run verify:lf-prod-sot-004c-today-readonly-bridge`: PASS
- `node --test tests/lf-prod-sot-004c-today-readonly-bridge.test.cjs`: PASS
- `npm run guard:routes:canonical`: PASS
- `npm run guard:ui:patch-layers`: PASS
- `npm run check:polish-mojibake`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Risk audit

- Today/TodayStable sa HIGH_RISK_DATE_TIME_ADOPTION.
- Etap nie przepina runtime i nie zmienia widocznego outputu.
- Realne podpiecie bridge do Today wymaga osobnego runtime adoption i manual smoke Damiana.
- Calendar/Google Calendar boundary pozostaje zablokowane do 004G.
- CaseDetail pozostaje zablokowany do 004F.
- Finance/Billing pozostaja poza tym etapem.

## Wynik

KONIEC ETAPU LF-PROD-SOT-004C.
