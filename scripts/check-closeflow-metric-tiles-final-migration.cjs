#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5';
function p(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(p(rel)); }
function fail(message) { console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
const requiredFiles = ['src/components/StatShortcutCard.tsx','src/components/ui-system/MetricTile.tsx','src/components/ui-system/MetricGrid.tsx','src/styles/closeflow-metric-tiles.css','src/pages/TasksStable.tsx','src/pages/Leads.tsx','src/pages/Clients.tsx','src/pages/Cases.tsx','docs/ui/CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_2026-05-09.md','docs/ui/closeflow-metric-tiles-final-migration.generated.json','scripts/audit-closeflow-metric-tiles-final-migration.cjs','scripts/check-closeflow-metric-tiles-final-migration.cjs','package.json'];
for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);
const stat = read('src/components/StatShortcutCard.tsx');
const tile = read('src/components/ui-system/MetricTile.tsx');
const grid = read('src/components/ui-system/MetricGrid.tsx');
const css = read('src/styles/closeflow-metric-tiles.css');
const doc = read('docs/ui/CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_2026-05-09.md');
const json = JSON.parse(read('docs/ui/closeflow-metric-tiles-final-migration.generated.json'));
const pkg = JSON.parse(read('package.json'));
assert(stat.includes(STAGE), 'StatShortcutCard VS-5 marker missing');
assert(stat.includes("import { MetricTile"), 'StatShortcutCard must import MetricTile');
assert(stat.includes('<MetricTile'), 'StatShortcutCard must delegate to MetricTile');
assert(tile.includes(STAGE), 'MetricTile VS-5 marker missing');
assert(tile.includes('data-cf-ui-component="MetricTile"'), 'MetricTile data component marker missing');
assert(tile.includes('data-cf-metric-tile-contract="final-vs5"'), 'MetricTile final contract data marker missing');
assert(tile.includes('cf-top-metric-tile-content'), 'MetricTile must own cf-top-metric-tile-content');
assert(tile.includes('data-eliteflow-metric-tone'), 'MetricTile tone marker missing');
assert(grid.includes(STAGE), 'MetricGrid VS-5 marker missing');
assert(grid.includes('data-cf-ui-component="MetricGrid"'), 'MetricGrid component marker missing');
assert(grid.includes('data-cf-metric-grid-contract="final-vs5"'), 'MetricGrid final contract marker missing');
assert(css.includes('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CSS'), 'VS-5 CSS contract marker missing');
for (const needle of ['.main-leads-html > .grid-4', '.main-clients-html > .grid-4', '.main-cases-html > .grid-4', 'data-eliteflow-task-stat-grid']) assert(css.includes(needle), 'CSS missing metric surface selector: ' + needle);
for (const needle of ['Owner:', 'Reason:', 'Scope:', 'remove_after_stage:']) assert(css.includes(needle), 'hotfix metadata missing in VS-5 CSS block: ' + needle);
const screenExpectations = [['src/pages/TasksStable.tsx', 'data-eliteflow-task-stat-grid'], ['src/pages/Cases.tsx', 'grid-4'], ['src/pages/Leads.tsx', 'grid-4'], ['src/pages/Clients.tsx', 'grid-4']];
for (const [rel, gridMarker] of screenExpectations) { const text = read(rel); const count = (text.match(/<StatShortcutCard\b/g) || []).length; assert(text.includes('../components/StatShortcutCard'), rel + ' must import StatShortcutCard'); assert(count >= 4, rel + ' must use at least 4 StatShortcutCard tiles, found ' + count); assert(text.includes(gridMarker), rel + ' missing grid marker ' + gridMarker); assert(!/<MetricTile\b/.test(text), rel + ' should not bypass StatShortcutCard adapter yet'); }
assert(doc.includes('VS-5'), 'doc missing VS-5 label');
assert(json && json.marker === STAGE, 'generated JSON marker mismatch');
assert(json.totals && json.totals.screens === 4, 'generated JSON screen count mismatch');
assert(pkg.scripts && pkg.scripts['audit:closeflow-metric-tiles-final-migration'], 'package audit script missing');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tiles-final-migration'], 'package check script missing');
assert(pkg.scripts && pkg.scripts['verify:closeflow-metric-tiles-final-migration'], 'package verify script missing');
console.log('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CHECK_OK');
console.log('screens=' + json.totals.screens);
console.log('standard_adapter_active=' + json.totals.standardAdapterActive);
console.log('stat_shortcut_cards=' + json.totals.totalStatShortcutCards);
