# CLOSEFLOW_OPERATOR_METRIC_TILES_REPAIR1_2026-05-09

Marker: CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_REPAIR1

## Cel

Naprawa po zatrzymaniu VS-5V na starym checku VS5S.

## Problem

VS-5V poprawnie podmienił kafelki /tasks i /notifications na OperatorMetricTiles, ale historyczny check `check:closeflow-metric-tile-single-source-truth` nadal wymagał importu `MetricGrid` w `TasksStable.tsx`.

## Decyzja

Po VS-5V są dwa akceptowane źródła kafelków:

1. starsze ekrany: `StatShortcutCard -> MetricTile`,
2. problematyczne ekrany /tasks i /notifications: `OperatorMetricTiles`.

OperatorMetricTiles jest celowo izolowany i nie używa starych markerów:

- `data-stat-shortcut-card`,
- `cf-top-metric-tile`,
- `cf-top-metric-tile-label`,
- `cf-top-metric-tile-value`.

## Zakres

Zmienione są tylko checki i dokumentacja naprawy. Runtime zmiany z VS-5V pozostają bez cofania.
