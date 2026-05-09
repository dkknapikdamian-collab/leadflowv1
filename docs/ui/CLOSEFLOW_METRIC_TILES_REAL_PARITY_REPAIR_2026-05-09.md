# CloseFlow VS-5R — Metric tiles real parity repair

Status: implemented

## Problem

VS-5 finalized the component contract, but two active screens could still look different in the browser:

- /tasks
- /notifications

The reason was not business logic. The source of drift was visual legacy:

- /tasks already used `StatShortcutCard -> MetricTile`, but kept a route-specific grid adapter.
- /notifications already rendered `StatShortcutCard`, but the page still carried a dead local `MetricCard` implementation and old `.notifications-stat-card` CSS.

## Decision

Do not rebuild active pages from scratch yet.

Use a smaller repair:

1. Keep one source of truth for the tile card: `MetricTile`.
2. Keep `StatShortcutCard` only as compatibility adapter.
3. Remove dead local notification MetricCard code.
4. Remove old notification stat-card CSS.
5. Add one final compatibility bridge in `closeflow-metric-tiles.css` for:
   - `.notifications-stats-grid`
   - `main[data-p0-tasks-stable-rebuild="true"] section[data-eliteflow-task-stat-grid="true"]`

## Files changed

- `src/pages/NotificationsCenter.tsx`
- `src/styles/visual-stage10-notifications-vnext.css`
- `src/styles/closeflow-metric-tiles.css`
- `scripts/check-closeflow-metric-tiles-real-parity-repair.cjs`
- `docs/ui/closeflow-metric-tiles-real-parity-repair.generated.json`

## Manual QA

Check:

- /tasks
- /notifications
- /leads
- /clients
- /cases

Expected:

- same tile height
- same value font
- same icon position
- same rounded radius
- same responsive 4 -> 2 -> 1 column behavior
- no old notification stat cards

## Guard marker

CLOSEFLOW_VS5R_REAL_METRIC_TILE_PARITY
