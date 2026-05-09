# CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_REPAIR3_2026-05-09

## Status

VS-5X Repair3 finalizes the metric tile source of truth without regex migration of large legacy pages.

## Decision

The final renderer is `OperatorMetricTile`.

- `/tasks` and `/notifications` use `OperatorMetricTiles -> OperatorMetricTile`.
- `/leads`, `/clients`, and `/cases` keep `StatShortcutCard` as a compatibility adapter, but `StatShortcutCard` renders `OperatorMetricTile`.

## Color source of truth

One `tone` controls:

- value color,
- icon color,
- icon background,
- active/root tile identity.

## Tone meaning

- red: risk, overdue, blocked, no movement,
- green: good/done/value,
- amber: waiting, warning, missing case, snoozed,
- blue: active/today/working,
- purple: AI/system/history,
- neutral: plain count.

Marker: CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3
