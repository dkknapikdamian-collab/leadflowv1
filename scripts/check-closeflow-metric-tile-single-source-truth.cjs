#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S';

function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(message) { console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function count(text, re) { return (text.match(re) || []).length; }

const required = [
  'src/components/ui-system/MetricGrid.tsx',
  'src/components/ui-system/MetricTile.tsx',
  'src/components/StatShortcutCard.tsx',
  'src/components/ui-system/OperatorMetricTiles.tsx',
  'src/styles/closeflow-metric-tiles.css',
  'src/styles/closeflow-operator-metric-tiles.css',
  'src/pages/TasksStable.tsx',
  'src/pages/NotificationsCenter.tsx',
  'docs/ui/CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_2026-05-09.md',
  'docs/ui/closeflow-metric-tile-single-source-truth.generated.json',
];
for (const rel of required) assert(exists(rel), 'missing required file: ' + rel);

const metricGrid = read('src/components/ui-system/MetricGrid.tsx');
const metricTile = read('src/components/ui-system/MetricTile.tsx');
const statShortcut = read('src/components/StatShortcutCard.tsx');
const operator = read('src/components/ui-system/OperatorMetricTiles.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const operatorCss = read('src/styles/closeflow-operator-metric-tiles.css');
const indexCss = read('src/index.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const pkg = JSON.parse(read('package.json'));

assert(metricGrid.includes('data-cf-ui-component="MetricGrid"'), 'MetricGrid component marker missing');
assert(metricTile.includes('data-cf-ui-component="MetricTile"'), 'MetricTile component marker missing');
assert(statShortcut.includes('<MetricTile'), 'StatShortcutCard must still delegate to MetricTile for legacy screens');
assert(operator.includes('data-cf-metric-source-truth="vs5v"'), 'OperatorMetricTiles source truth marker missing');
assert(operatorCss.includes('CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V'), 'OperatorMetricTiles CSS marker missing');
assert(metricCss.includes('CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S'), 'single source truth CSS block missing');
assert(indexCss.includes("@import './styles/closeflow-metric-tiles.css';"), 'closeflow-metric-tiles.css must be imported by index.css');
assert(emergency.includes("@import '../closeflow-operator-metric-tiles.css';"), 'operator metric CSS must load through emergency hotfixes after legacy CSS');

const tasksUsesOperator = tasks.includes('<OperatorMetricTiles');
const tasksUsesLegacyMetricGrid = tasks.includes('<MetricGrid') && tasks.includes('<StatShortcutCard');
const notificationsUsesOperator = notifications.includes('<OperatorMetricTiles');
const notificationsUsesLegacyMetricGrid = notifications.includes('<MetricGrid') && notifications.includes('<StatShortcutCard');

assert(tasksUsesOperator || tasksUsesLegacyMetricGrid, 'TasksStable must use OperatorMetricTiles or MetricGrid->StatShortcutCard');
assert(notificationsUsesOperator || notificationsUsesLegacyMetricGrid, 'NotificationsCenter must use OperatorMetricTiles or MetricGrid->StatShortcutCard');

if (tasksUsesOperator) {
  assert(!tasks.includes('<StatShortcutCard'), 'TasksStable must not mix OperatorMetricTiles with old StatShortcutCard');
  assert(tasks.includes('data-cf-metric-replacement="vs5v"'), 'TasksStable VS5V replacement marker missing');
} else {
  assert(tasks.includes('data-cf-metric-single-source="vs5s"') || tasks.includes('data-eliteflow-task-stat-grid="true"'), 'TasksStable VS5S/legacy grid marker missing');
  assert(count(tasks, /<StatShortcutCard/g) >= 4, 'TasksStable must render at least 4 StatShortcutCard metric tiles');
}

if (notificationsUsesOperator) {
  assert(!notifications.includes('<StatShortcutCard'), 'NotificationsCenter must not mix OperatorMetricTiles with old StatShortcutCard');
  assert(!notifications.includes('<MetricGrid'), 'NotificationsCenter must not render old MetricGrid metric block after VS5V');
  assert(notifications.includes('notificationMetricTiles'), 'NotificationsCenter OperatorMetricTiles item source missing');
} else {
  assert(notifications.includes('notifications-stats-grid'), 'NotificationsCenter metric grid marker missing');
  assert(count(notifications, /<StatShortcutCard/g) >= 7, 'NotificationsCenter must render at least 7 StatShortcutCard metric tiles');
}

assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tile-single-source-truth'], 'package single source truth script missing');

console.log('CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S_CHECK_OK');
console.log('tasks_metric_tiles=' + (tasksUsesOperator ? 4 : count(tasks, /<StatShortcutCard/g)));
console.log('notifications_metric_tiles=' + (notificationsUsesOperator ? 7 : count(notifications, /<StatShortcutCard/g)));
console.log('source_of_truth=' + (tasksUsesOperator && notificationsUsesOperator ? 'OperatorMetricTiles' : 'MetricGrid->StatShortcutCard->MetricTile'));
