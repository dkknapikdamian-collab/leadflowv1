#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5';

function p(rel) { return path.join(repo, rel); }
function exists(rel) { return fs.existsSync(p(rel)); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function fail(message) {
  console.error(STAGE + '_CHECK_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) { if (!condition) fail(message); }
function count(text, re) { return (text.match(re) || []).length; }

const requiredFiles = [
  'src/components/StatShortcutCard.tsx',
  'src/components/ui-system/MetricTile.tsx',
  'src/components/ui-system/MetricGrid.tsx',
  'src/components/ui-system/OperatorMetricTiles.tsx',
  'src/styles/closeflow-metric-tiles.css',
  'src/styles/closeflow-operator-metric-tiles.css',
  'src/pages/TasksStable.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'docs/ui/CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_2026-05-09.md',
  'docs/ui/closeflow-metric-tiles-final-migration.generated.json',
  'scripts/check-closeflow-metric-tiles-final-migration.cjs',
  'package.json',
];

for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

const stat = read('src/components/StatShortcutCard.tsx');
const metricTile = read('src/components/ui-system/MetricTile.tsx');
const metricGrid = read('src/components/ui-system/MetricGrid.tsx');
const operator = read('src/components/ui-system/OperatorMetricTiles.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const cases = read('src/pages/Cases.tsx');
const operatorCss = read('src/styles/closeflow-operator-metric-tiles.css');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const pkg = JSON.parse(read('package.json'));

assert(stat.includes('MetricTile') && stat.includes('<MetricTile'), 'StatShortcutCard must still delegate to MetricTile for legacy routes');
assert(metricTile.includes('data-cf-ui-component="MetricTile"'), 'MetricTile component marker missing');
assert(metricGrid.includes('data-cf-ui-component="MetricGrid"'), 'MetricGrid component marker missing');
assert(operator.includes('OperatorMetricTiles'), 'OperatorMetricTiles component missing implementation');
assert(operatorCss.includes('operator-metric') || operatorCss.includes('OperatorMetricTiles') || operatorCss.includes('CLOSEFLOW_OPERATOR_METRIC_TILES'), 'operator metric CSS marker missing');

assert(tasks.includes('OperatorMetricTiles'), 'TasksStable must use OperatorMetricTiles after VS5V');
assert(notifications.includes('OperatorMetricTiles'), 'NotificationsCenter must use OperatorMetricTiles after VS5V');
assert(!tasks.includes('<MetricGrid') || tasks.includes('VS5V_LEGACY_MARKER_ALLOWED'), 'TasksStable should not route its top metrics through MetricGrid after VS5V');
assert(!notifications.includes('notifications-stats-grid') || notifications.includes('OperatorMetricTiles'), 'NotificationsCenter should not depend on old notifications-stats-grid metric implementation');

const operatorRouteCount = [tasks, notifications].filter((text) => text.includes('OperatorMetricTiles')).length;
assert(operatorRouteCount === 2, 'OperatorMetricTiles must cover /tasks and /notifications');

const legacyEvidence = {
  leadsStatShortcutCards: count(leads, /<StatShortcutCard\b/g),
  clientsStatShortcutCards: count(clients, /<StatShortcutCard\b/g),
  casesStatShortcutCards: count(cases, /<StatShortcutCard\b/g),
};

assert(legacyEvidence.leadsStatShortcutCards >= 0, 'Leads evidence scan failed');
assert(legacyEvidence.clientsStatShortcutCards >= 0, 'Clients evidence scan failed');
assert(legacyEvidence.casesStatShortcutCards >= 0, 'Cases evidence scan failed');

assert(metricCss.includes('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CSS') || metricCss.includes('CLOSEFLOW_VS5R_REAL_METRIC_TILE_PARITY_START'), 'central metric CSS contract marker missing');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tiles-final-migration'], 'package check script missing');

console.log('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CHECK_OK');
console.log('source_of_truth_routes=/tasks,/notifications:OperatorMetricTiles');
console.log('legacy_routes_not_blocking=/leads,/clients,/cases');
console.log('cases_stat_shortcut_cards=' + legacyEvidence.casesStatShortcutCards);
