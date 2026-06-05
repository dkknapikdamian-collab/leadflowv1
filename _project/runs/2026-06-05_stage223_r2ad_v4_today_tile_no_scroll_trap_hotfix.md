# STAGE223 R2AD V4 - Today tile no-scroll trap hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

V1, V2 i V3 nie zaaplikowały się, bo patchery zakładały zbyt dokładny układ tekstu w lokalnym `TodayStable.tsx`.

V4 zmienia metodę:
- najpierw audytuje lokalny plik i zapisuje dokładne fragmenty,
- potem patchuje funkcje i statementy przez parser bloków, nie przez kruche anchory z pustymi liniami.

## ZAKRES

V4:
- `moveTodaySectionToTop` zostaje no-opem,
- `scrollToTodaySection` zostaje no-opem,
- `focusTodaySectionFromMetricTile` tylko rozwija sekcję w miejscu,
- `handleMetricTileClick` ignoruje top metric tile buttons,
- `handleTileClick` ignoruje section headers i top metric tile buttons,
- top metric button ma `data-cf-today-no-scroll-trap="true"` i własny bezpieczny `onClick`,
- guard R2AD trafia do `verify:closeflow:quiet`.

## TESTY

```powershell
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-movement-risk-system.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY

- `/today`: kliknąć wszystkie kafelki górne.
- Sprawdzić, że ekran nie skacze w dół.
- Sprawdzić, że można normalnie wrócić na samą górę.
- Sprawdzić dolne nagłówki sekcji i strzałki rozwijania.
- Zmienić kartę przeglądarki i wrócić — bez scroll trap.

## AUDYT RYZYK

- Zmieniamy UX: kafelek nie przenosi sekcji na górę.
- To świadoma decyzja po screenach.
- Po deployu sprawdzić `/today` produkcyjnie.
