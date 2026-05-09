# CloseFlow VS-7 Repair4 — final metric guard sweep

Data: 2026-05-09
Branch: dev-rollout-freeze

## Cel

Zamknac czerwone guardy po VS-7 bez cofania finalnego systemu kafelkow.

## Problem

Po sweepie zostaly dwa czerwone obszary:

1. `verify:closeflow:quiet` zatrzymuje sie na starym oczekiwaniu `function MetricCard` w `Activity.tsx`.
2. `test:raw` zatrzymuje sie na `tests/unified-top-metric-tiles.test.cjs`, ktory dalej wymaga starych selektorow i markerow sprzed migracji do `OperatorMetricTile`.

## Decyzja

Nie przywracamy martwego `MetricCard` i nie dopisujemy sztucznych legacy selektorow tylko po to, zeby przejsc test.
Aktualizujemy guardy do aktualnego zrodla prawdy:

- `StatShortcutCard` jest adapterem.
- `OperatorMetricTile` / `OperatorMetricTiles` sa finalnym rendererem.
- `closeflow-operator-metric-tiles.css` jest finalnym CSS dla wartosci i ikon.
- `closeflow-metric-tiles.css` zostaje jako legacy compatibility layer, ale nie jest juz jedynym kontraktem.

## Pliki

- `tests/activity-command-center.test.cjs`
- `tests/unified-top-metric-tiles.test.cjs`
- `scripts/check-unified-top-metric-tiles.cjs`

## Kryterium zakonczenia

- `node --test tests/activity-command-center.test.cjs` przechodzi.
- `node --test tests/unified-top-metric-tiles.test.cjs` przechodzi.
- `npm run check:unified-top-metric-tiles` przechodzi.
- `npm run verify:closeflow:quiet` przechodzi.
- `npm run test:raw` przechodzi.
- `npm run build` przechodzi.
