#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5';
function p(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(p(rel)); }
function write(rel, content) { fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), content, 'utf8'); }
const screens = [
  { route: '/tasks', file: 'src/pages/TasksStable.tsx', requiredGrid: 'data-eliteflow-task-stat-grid' },
  { route: '/cases', file: 'src/pages/Cases.tsx', requiredGrid: 'grid-4' },
  { route: '/leads', file: 'src/pages/Leads.tsx', requiredGrid: 'grid-4' },
  { route: '/clients', file: 'src/pages/Clients.tsx', requiredGrid: 'grid-4' },
];
const matrix = screens.map((screen) => {
  const text = exists(screen.file) ? read(screen.file) : '';
  const statShortcutCount = (text.match(/<StatShortcutCard\b/g) || []).length;
  const metricTileCount = (text.match(/<MetricTile\b/g) || []).length;
  const localStatCardCount = (text.match(/className=[{\"'][^\n]*(stat-card|summary-card|dashboard-stat-card|metric)([^A-Za-z-]|$)/g) || []).length;
  return { route: screen.route, file: screen.file, usesStatShortcutCard: text.includes('StatShortcutCard'), statShortcutCount, usesMetricTileDirectly: metricTileCount > 0, metricTileCount, hasRequiredGridMarker: text.includes(screen.requiredGrid), localMetricMarkupRiskCount: localStatCardCount, status: text.includes('StatShortcutCard') && statShortcutCount >= 4 && text.includes(screen.requiredGrid) ? 'standard_adapter_active' : 'needs_review' };
});
const summary = { stage: 'VS-5', marker: STAGE, generatedAt: new Date().toISOString(), strategy: 'No broad page rewrite. Active pages keep StatShortcutCard compatibility adapter; MetricTile owns final markup and CSS contract owns final layout.', screens, matrix, totals: { screens: matrix.length, standardAdapterActive: matrix.filter((row) => row.status === 'standard_adapter_active').length, totalStatShortcutCards: matrix.reduce((sum, row) => sum + row.statShortcutCount, 0), totalLocalMetricMarkupRisk: matrix.reduce((sum, row) => sum + row.localMetricMarkupRiskCount, 0) } };
write('docs/ui/closeflow-metric-tiles-final-migration.generated.json', JSON.stringify(summary, null, 2) + '\n');
const rows = matrix.map((row) => '| ' + row.route + ' | `' + row.file + '` | ' + row.statShortcutCount + ' | ' + (row.hasRequiredGridMarker ? 'yes' : 'no') + ' | ' + row.localMetricMarkupRiskCount + ' | ' + row.status + ' |').join('\n');
const doc = [
'# CloseFlow VS-5 — Metric tiles final migration — 2026-05-09',
'',
'## Status',
'',
'SHIPPED as a safe final contract stage.',
'',
'## Decision',
'',
'No mass rewrite of legacy list pages was performed. The active screens already use `StatShortcutCard`, and `StatShortcutCard` delegates rendering to `MetricTile`. VS-5 locks that contract instead of rewriting several large files at once.',
'',
'## Final contract',
'',
'- `MetricTile` owns metric tile markup.',
'- `MetricGrid` owns the reusable grid contract for new screens.',
'- `StatShortcutCard` remains only as a compatibility adapter for active legacy screens.',
'- `src/styles/closeflow-metric-tiles.css` owns cross-screen layout parity.',
'- `/tasks`, `/cases`, `/leads`, `/clients` must not introduce local metric card markup.',
'',
'## Active screen matrix',
'',
'| Route | File | StatShortcutCard count | Required grid marker | Local metric markup risk | Status |',
'|---|---|---:|---|---:|---|',
rows,
'',
'## Do not change',
'',
'- Do not manually restyle metric tiles inside page files.',
'- Do not add local `stat-card`, `summary-card`, `dashboard-stat-card` metric blocks to active pages.',
'- Do not migrate `Leads.tsx`, `Clients.tsx`, `Cases.tsx` by broad regex.',
'',
'## Acceptance',
'',
'`npm run check:closeflow-metric-tiles-final-migration` must pass and report:',
'',
'`CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CHECK_OK`',
'',
].join('\n');
write('docs/ui/CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_2026-05-09.md', doc);
console.log('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_AUDIT_OK');
console.log('screens=' + summary.totals.screens);
console.log('standard_adapter_active=' + summary.totals.standardAdapterActive);
console.log('stat_shortcut_cards=' + summary.totals.totalStatShortcutCards);
console.log('local_metric_markup_risk=' + summary.totals.totalLocalMetricMarkupRisk);
