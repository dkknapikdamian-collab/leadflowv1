# CloseFlow metric tiles deep source map — VS5T

Marker: `CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T`

## Verdict

- Conclusion: `NOT_PIXEL_LOCKED: Today is still not on the same MetricTile source as Tasks/Notifications.`
- Metric CSS imported: `true`
- Blocking/high findings: `3`

## Main thesis

Do not add another CSS patch. First make Today, Tasks and Notifications use the same MetricGrid -> StatShortcutCard -> MetricTile chain, then delete or quarantine legacy selectors that target generic grid/buttons.

## Blocking findings

- `blocker` `today-not-on-metric-tile-source` in `src/pages/TodayStable.tsx`: Today is the visual reference, but it is not rendered through StatShortcutCard/MetricTile. Pixel parity cannot be guaranteed while the reference screen uses a separate local tile implementation.
- `high` `legacy-hard-lock-targets-raw-buttons` in `src/styles/eliteflow-final-metric-tiles-hard-lock.css`: Legacy hard-lock selectors still target generic section.grid > button / button > div and can override component-owned MetricTile markup.
- `high` `local-metric-card-src-pages-aidrafts-tsx` in `src/pages/AiDrafts.tsx`: Page contains local MetricCard implementation/usage.

## Active page metric source map

| page | StatShortcutCard | MetricGrid | MetricTile | local MetricCard | legacy grid markers |
|---|---:|---:|---:|---:|---|
| `src/pages/TodayStable.tsx` | 0 | 0 | 0 | 0 |  |
| `src/pages/TasksStable.tsx` | 1 | 1 | 0 | 0 | tasks-grid |
| `src/pages/NotificationsCenter.tsx` | 7 | 1 | 0 | 0 | notifications-stats-grid |
| `src/pages/Leads.tsx` | 5 | 0 | 0 | 0 |  |
| `src/pages/Clients.tsx` | 4 | 0 | 0 | 0 | grid-4 |
| `src/pages/Cases.tsx` | 4 | 0 | 0 | 0 | grid-4 |
| `src/pages/Calendar.tsx` | 0 | 0 | 0 | 0 |  |
| `src/pages/AiDrafts.tsx` | 0 | 0 | 0 | 6 |  |
| `src/pages/Activity.tsx` | 6 | 0 | 0 | 0 |  |

## CSS files influencing metric tiles

- `src/index.css` — signals: `eliteflow-metric`
- `src/styles/closeflow-metric-tiles.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `data-cf-metric-tile-contract`, `eliteflow-metric`, `notifications-stats-grid`, `data-p0-tasks-stable-rebuild`, `data-eliteflow-task-stat-grid`, `section.grid > button`, `.grid-4`, `.grid-5`, `.stats-grid`, `.stat-grid`, `.metric-grid`, `.stat-card`, `.summary-card`, `.dashboard-stat-card`, `.metric`
- `src/styles/closeflow-stage16c-tasks-cases-parity.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `data-p0-tasks-stable-rebuild`, `data-eliteflow-task-stat-grid`, `.grid-4`
- `src/styles/closeflow-stage16d-tasks-metric-final-lock.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `data-p0-tasks-stable-rebuild`, `data-eliteflow-task-stat-grid`
- `src/styles/eliteflow-admin-feedback-p1-hotfix.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `.grid-4`, `.grid-5`, `.stats-grid`, `.stat-grid`, `.metric-grid`, `.metric`
- `src/styles/eliteflow-final-metric-tiles-hard-lock.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `eliteflow-metric`, `data-p0-tasks-stable-rebuild`, `section.grid > button`, `.grid-4`, `.grid-5`, `.stats-grid`, `.stat-grid`, `.metric-grid`, `.stat-card`, `.summary-card`, `.dashboard-stat-card`, `.metric`
- `src/styles/eliteflow-metric-text-clip-tasks-repair.css` — signals: `cf-top-metric-tile`, `data-stat-shortcut-card`, `data-p0-tasks-stable-rebuild`, `data-eliteflow-task-stat-grid`
- `src/styles/eliteflow-metric-tiles-color-font-parity.css` — signals: `cf-top-metric-tile`, `eliteflow-metric`, `data-p0-tasks-stable-rebuild`, `section.grid > button`, `.grid-4`, `.grid-5`, `.stats-grid`, `.stat-grid`, `.metric-grid`, `.metric`
- `src/styles/hotfix-task-stat-tiles-clean.css` — signals: `data-stat-shortcut-card`
- `src/styles/stage30a-mobile-contrast-lock.css` — signals: `data-stat-shortcut-card`, `.metric`
- `src/styles/stage37-unified-page-head-and-metrics.css` — signals: `.grid-4`, `.grid-5`, `.metric`
- `src/styles/stage38-metrics-and-relations-polish.css` — signals: `cf-top-metric-tile`
- `src/styles/stage7a-tasks-blue-outline-fix.css` — signals: `.grid-5`
- `src/styles/visual-stage05-clients.css` — signals: `.grid-4`, `.metric`
- `src/styles/visual-stage07-cases.css` — signals: `data-stat-shortcut-card`, `.grid-4`
- `src/styles/visual-stage10-notifications-vnext.css` — signals: `notifications-stats-grid`
- `src/styles/visual-stage16-today-html-reset.css` — signals: `.grid-4`, `.metric`
- `src/styles/visual-stage17-today-hard-1to1.css` — signals: `data-stat-shortcut-card`, `.grid-4`, `.metric`
- `src/styles/visual-stage18-leads-hard-1to1.css` — signals: `data-stat-shortcut-card`, `.grid-5`, `.metric`
- `src/styles/visual-stage19-clients-safe-css.css` — signals: `.grid-5`
- `src/styles/visual-stage21-today-final-lock.css` — signals: `data-stat-shortcut-card`, `.grid-4`, `.metric`
- `src/styles/visual-stage22-leads-final-lock.css` — signals: `.grid-5`, `.metric`
- `src/styles/visual-stage24-leads-html-dom-parity-hardfix.css` — signals: `.grid-5`
- `src/styles/visual-stage25-leads-full-jsx-html-rebuild.css` — signals: `.grid-5`, `.metric`
- `src/styles/visual-stage26-leads-visual-alignment-fix.css` — signals: `.grid-5`, `.metric`
- `src/styles/visual-stage27-cases-vnext.css` — signals: `.grid-4`, `.metric`
- `src/styles/visual-stage28-tasks-vnext.css` — signals: `.grid-5`

## Next implementation direction

1. Treat `MetricTile` as the only renderer of metric tile markup.
2. Migrate `TodayStable.tsx` top decision tiles to `MetricGrid -> StatShortcutCard -> MetricTile`, because Today is the visual reference but currently uses a separate local implementation.
3. Remove or neutralize old generic selectors in `eliteflow-final-metric-tiles-hard-lock.css` that target `section.grid > button` and `button > div`.
4. Keep `/tasks` and `/notifications` on `MetricGrid`, not local `section.grid` / `notifications-stats-grid` ownership.
5. Only after the same source chain is active, tune exact font size, label casing, value/icon gap and width in `MetricTile` once.

## Generated JSON

See `docs/ui/closeflow-metric-tiles-deep-source-map.generated.json`.
