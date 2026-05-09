# CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_2026-05-09

## Status
VS-5S Repair 2. This stage fixes the failed Repair 1 package and removes the stale grid-4 assumption from the historical VS-5 check.

## Decision
Metric tiles must be rendered through one chain on the repaired routes:

MetricGrid -> StatShortcutCard -> MetricTile

## What was wrong
- VS5S Repair 1 correctly converted /tasks and /notifications, but the historical VS-5 check still required a literal grid-4 marker in Leads.tsx.
- Leads/Clients/Cases already use StatShortcutCard, but their legacy grid shells are not migrated in this stage.
- /tasks and /notifications are the repaired routes because they were visually wrong.

## Contract
- /tasks uses MetricGrid for task metrics.
- /notifications uses MetricGrid for notification metrics.
- MetricGrid forwards data-* and aria-* props.
- MetricTile owns card geometry, typography and icon layout.
- Local metric card CSS in NotificationsCenter is forbidden.
- Historical VS-5 checks accept mapped task tiles and legacy grid evidence for Leads/Clients/Cases.

## Manual QA
- /tasks: Aktywne, Dziś, Zaległe, Zrobione must not split words.
- /notifications: metrics must not use the old seven-column local card layout.
- /today, /leads, /clients, /cases must not regress.
