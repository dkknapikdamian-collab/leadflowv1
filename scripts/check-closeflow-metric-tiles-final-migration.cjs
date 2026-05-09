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

function countTaskTiles(text) {
  const jsx = (text.match(/<StatShortcutCard\b/g) || []).length;
  const labels = ['Aktywne', 'Dziś', 'Zaległe', 'Zrobione'].filter((label) => text.includes("label: '" + label + "'") || text.includes('label: "' + label + '"')).length;
  return Math.max(jsx, labels);
}
function countNotificationTiles(text) {
  const jsx = (text.match(/<StatShortcutCard\b/g) || []).length;
  const labels = ['Wszystkie', 'Do reakcji', 'Zaległe', 'Dzisiaj', 'Nadchodzące', 'Odłożone', 'Przeczytane'].filter((label) => text.includes('label="' + label + '"') || text.includes("label='" + label + "'")).length;
  return Math.max(jsx, labels);
}
function hasLegacyMetricGridEvidence(text) {
  return text.includes('grid-4') || text.includes('grid-5') || text.includes('stats-grid') || text.includes('metric-grid') || text.includes('summary-grid') || text.includes('main-leads-html') || text.includes('main-clients-html') || text.includes('main-cases-html');
}

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
assert(grid.includes(STAGE), 'MetricGrid VS-5 marker missing');
assert(grid.includes('data-cf-ui-component="MetricGrid"'), 'MetricGrid component marker missing');
assert(grid.includes('data-cf-metric-grid-contract="final-vs5"'), 'MetricGrid final contract marker missing');
assert(css.includes('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CSS'), 'VS-5 CSS contract marker missing');
for (const needle of ['.main-leads-html > .grid-4', '.main-clients-html > .grid-4', '.main-cases-html > .grid-4', 'data-eliteflow-task-stat-grid']) assert(css.includes(needle), 'CSS missing legacy compatibility selector: ' + needle);
for (const needle of ['Owner:', 'Reason:', 'Scope:', 'remove_after_stage:']) assert(css.includes(needle), 'hotfix metadata missing in VS-5 CSS block: ' + needle);
const screenExpectations = [
  ['src/pages/TasksStable.tsx', 4, 'tasks'],
  ['src/pages/Cases.tsx', 4, 'legacy'],
  ['src/pages/Leads.tsx', 4, 'legacy'],
  ['src/pages/Clients.tsx', 4, 'legacy'],
];
for (const [rel, minCount, mode] of screenExpectations) {
  const text = read(rel);
  const count = rel.endsWith('TasksStable.tsx') ? countTaskTiles(text) : (text.match(/<StatShortcutCard\b/g) || []).length;
  assert(text.includes('../components/StatShortcutCard'), rel + ' must import StatShortcutCard');
  assert(count >= minCount, rel + ' must define at least ' + minCount + ' StatShortcutCard-backed tiles, found ' + count);
  if (mode === 'tasks') assert(text.includes('<MetricGrid className="cf-tasks-metric-grid"'), rel + ' must use MetricGrid as final grid shell');
  if (mode === 'legacy') assert(hasLegacyMetricGridEvidence(text), rel + ' missing legacy metric grid evidence');
  assert(!/<MetricTile\b/.test(text), rel + ' should not bypass StatShortcutCard adapter yet');
}
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
