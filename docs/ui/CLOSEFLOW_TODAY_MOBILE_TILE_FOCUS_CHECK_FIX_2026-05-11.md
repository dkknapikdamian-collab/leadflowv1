# CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_CHECK_FIX_2026-05-11

## Cel
Naprawa fałszywie czerwonego guarda `check:today-mobile-tile-focus` po wdrożeniu ETAP 2.

## Problem
Kod TodayStable ustawia `data-cf-today-metric-tile-target` przez API DOM `dataset.cfTodayMetricTileTarget`, ale poprzedni check szukał błędnego tekstu `data.cfTodayMetricTileTarget`.

## Zakres
- Nie zmienia logiki Today.
- Nie zmienia danych kafelków.
- Nie zmienia routingu.
- Poprawia tylko guard, aby akceptował prawidłową składnię DOM: `dataset.cfTodayMetricTileTarget` lub `setAttribute('data-cf-today-metric-tile-target', ...)`.

## Kryterium
`npm run check:today-mobile-tile-focus` oraz `npm run verify:closeflow:quiet` mają przechodzić po wdrożeniu.
