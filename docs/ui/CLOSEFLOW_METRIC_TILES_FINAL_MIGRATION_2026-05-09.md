# CloseFlow VS-5 — Metric tiles final migration — 2026-05-09

## Status

SHIPPED as a safe final contract stage.

## Decision

No mass rewrite of legacy list pages was performed. The active screens already use `StatShortcutCard`, and `StatShortcutCard` delegates rendering to `MetricTile`. VS-5 locks that contract instead of rewriting several large files at once.

## Final contract

- `MetricTile` owns metric tile markup.
- `MetricGrid` owns the reusable grid contract for new screens.
- `StatShortcutCard` remains only as a compatibility adapter for active legacy screens.
- `src/styles/closeflow-metric-tiles.css` owns cross-screen layout parity.
- `/tasks`, `/cases`, `/leads`, `/clients` must not introduce local metric card markup.

## Active screen matrix

| Route | File | StatShortcutCard count | Required grid marker | Local metric markup risk | Status |
|---|---|---:|---|---:|---|
| /tasks | `src/pages/TasksStable.tsx` | 1 | yes | 0 | needs_review |
| /cases | `src/pages/Cases.tsx` | 4 | yes | 0 | standard_adapter_active |
| /leads | `src/pages/Leads.tsx` | 5 | no | 0 | needs_review |
| /clients | `src/pages/Clients.tsx` | 4 | yes | 0 | standard_adapter_active |

## Do not change

- Do not manually restyle metric tiles inside page files.
- Do not add local `stat-card`, `summary-card`, `dashboard-stat-card` metric blocks to active pages.
- Do not migrate `Leads.tsx`, `Clients.tsx`, `Cases.tsx` by broad regex.

## Acceptance

`npm run check:closeflow-metric-tiles-final-migration` must pass and report:

`CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CHECK_OK`
