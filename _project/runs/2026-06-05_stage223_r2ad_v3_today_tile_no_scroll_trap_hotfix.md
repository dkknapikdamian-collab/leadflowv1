# STAGE223 R2AD V3 - Today tile no-scroll trap hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

R2AD V1 i V2 nie zaaplikowały się przez zbyt kruche anchory patchera.

V3 jest oparty o rzeczywisty obecny układ `TodayStable.tsx`:
- `moveTodaySectionToTop` używało `parent.insertBefore`,
- `scrollToTodaySection` używało `scrollIntoView`,
- `focusTodaySectionFromMetricTile` odpalało timeout + reorder + scroll,
- root/capture click bridges mogły obsłużyć jeden click równolegle.

## ZAKRES

R2AD V3:
- zamienia `moveTodaySectionToTop` na no-op,
- zamienia `scrollToTodaySection` na no-op,
- zmienia `focusTodaySectionFromMetricTile` na expand/collapse w miejscu,
- root listener ignoruje top metric tiles,
- capture listener ignoruje section headers i top metric tiles,
- top metric tile button dostaje `data-cf-today-no-scroll-trap="true"` i własne bezpieczne `onClick`,
- dodaje guard `scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`.

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
- Zmienić kartę przeglądarki i wrócić — bez agresywnego odświeżania/scroll trap.

## AUDYT RYZYK

- Zmieniamy zachowanie: kafelek nie przenosi sekcji na górę.
- To jest świadome, bo poprzedni mechanizm powodował scroll trap.
- Po deployu sprawdzić `/today` produkcyjnie.
