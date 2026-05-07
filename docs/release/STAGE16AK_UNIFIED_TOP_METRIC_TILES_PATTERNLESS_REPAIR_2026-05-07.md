# STAGE16AK_UNIFIED_TOP_METRIC_TILES_PATTERNLESS_REPAIR_2026-05-07

Cel: ujednolicić kafelki metryk u górnych sekcjach aplikacji do stylu z ekranu Dziś.

Zakres:
- `src/components/StatShortcutCard.tsx` jako wspólny komponent kafelków metryk.
- `src/styles/closeflow-metric-tiles.css` jako globalny styl dla starszych kafelków `.metric`, `.stat-card`, `.summary-card`, `.dashboard-stat-card`.
- `src/App.tsx` importuje globalny styl.
- `package.json` ma skrypty `check:unified-top-metric-tiles` i `test:unified-top-metric-tiles`.

Ważne:
- Ten etap nie zmienia danych, liczników, API, billing, AI ani logiki filtrowania.
- To naprawa wizualnego kontraktu kafelków.
- Patch nie używa kruchego szukania starego bloku w `StatShortcutCard.tsx`, tylko nadpisuje mały wspólny komponent kontrolowanym kodem.

Kryterium zakończenia:
- `npm run build`
- `npm run check:unified-top-metric-tiles`
- `npm run test:unified-top-metric-tiles`
- `npm run test:critical`
- `npm run verify:closeflow:quiet`
