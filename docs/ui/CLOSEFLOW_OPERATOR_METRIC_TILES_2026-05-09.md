# CLOSEFLOW_OPERATOR_METRIC_TILES_2026-05-09

Marker: CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V

## Cel

Stare kafelki metryk na /tasks i /notifications zostały wycięte z renderowania opartego o StatShortcutCard/MetricTile, ponieważ nadal łapały stare selektory EliteFlow i hotfixy.

## Decyzja

Dodajemy nowy izolowany renderer:

- src/components/ui-system/OperatorMetricTiles.tsx
- src/styles/closeflow-operator-metric-tiles.css

Ten renderer nie używa:

- data-stat-shortcut-card
- cf-top-metric-tile
- cf-top-metric-tile-label
- cf-top-metric-tile-value

Dzięki temu stare CSS-y nie mogą już łapać tych kafelków przez historyczne selektory.

## Zakres

Zmienione runtime:

- /tasks
- /notifications

Nietknięte runtime:

- /today
- /leads
- /clients
- /cases
- dane
- API
- routing

## Dlaczego nie kolejny CSS patch

Audyt VS5T pokazał, że problemem są stare selektory łapiące generyczne kafelki i buttony. Dlatego ten etap usuwa stare kafelki z miejsc, gdzie problem jest widoczny, i wstawia nowy renderer o nowych klasach.

## Kryterium zakończenia

/tasks i /notifications używają OperatorMetricTiles, a nie starego StatShortcutCard renderowanego bezpośrednio w stronie.
