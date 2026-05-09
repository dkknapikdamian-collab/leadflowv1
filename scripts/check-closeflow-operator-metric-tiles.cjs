#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V';

function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(message) { console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }

const required = [
  'src/components/ui-system/OperatorMetricTiles.tsx',
  'src/styles/closeflow-operator-metric-tiles.css',
  'src/pages/TasksStable.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/styles/emergency/emergency-hotfixes.css',
  'docs/ui/CLOSEFLOW_OPERATOR_METRIC_TILES_2026-05-09.md',
  'docs/ui/closeflow-operator-metric-tiles.generated.json',
];

for (const rel of required) assert(exists(rel), 'missing required file: ' + rel);

const component = read('src/components/ui-system/OperatorMetricTiles.tsx');
const css = read('src/styles/closeflow-operator-metric-tiles.css');
const uiIndex = read('src/components/ui-system/index.ts');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const pkg = JSON.parse(read('package.json'));
const json = JSON.parse(read('docs/ui/closeflow-operator-metric-tiles.generated.json'));

assert(component.includes('data-cf-operator-metric-tile'), 'OperatorMetricTiles tile marker missing');
assert(component.includes('data-cf-metric-source-truth="vs5v"'), 'OperatorMetricTiles source truth marker missing');
assert(!component.includes('data-stat-shortcut-card'), 'OperatorMetricTiles must not expose old data-stat-shortcut-card marker');
assert(!component.includes('cf-top-metric-tile'), 'OperatorMetricTiles must not expose old cf-top-metric-tile classes');
assert(css.includes('CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V'), 'operator metric CSS stage marker missing');
assert(css.includes('.cf-operator-metric-label'), 'operator metric label style missing');
assert(css.includes('white-space: nowrap'), 'operator metric label nowrap rule missing');
assert(uiIndex.includes("export * from './OperatorMetricTiles';"), 'ui-system export missing');
assert(emergency.includes("@import '../closeflow-operator-metric-tiles.css';"), 'operator metric CSS import missing from emergency hotfixes');
assert(!emergency.includes("@import '../hotfix-task-stat-tiles-clean.css';"), 'old task stat hotfix import must be removed from emergency hotfixes');

assert(tasks.includes('OperatorMetricTiles'), 'TasksStable must import/use OperatorMetricTiles');
assert(tasks.includes('<OperatorMetricTiles'), 'TasksStable must render OperatorMetricTiles');
assert(!tasks.includes('<StatShortcutCard'), 'TasksStable must not render old StatShortcutCard metric tiles');
assert(tasks.includes('data-cf-metric-replacement="vs5v"'), 'TasksStable replacement marker missing');
assert(tasks.includes('data-eliteflow-task-stat-grid="true"'), 'TasksStable legacy guard marker must remain for older checks');

assert(notifications.includes('OperatorMetricTiles'), 'NotificationsCenter must import/use OperatorMetricTiles');
assert(notifications.includes('<OperatorMetricTiles'), 'NotificationsCenter must render OperatorMetricTiles');
assert(notifications.includes('notificationMetricTiles'), 'NotificationsCenter metric item source missing');
assert(!notifications.includes('<StatShortcutCard'), 'NotificationsCenter must not render old StatShortcutCard metric tiles');
assert(!notifications.includes('<MetricGrid'), 'NotificationsCenter must not render old MetricGrid for metric tiles');
assert(notifications.includes('data-cf-metric-replacement="vs5v"'), 'NotificationsCenter replacement marker missing');

assert(pkg.scripts && pkg.scripts['check:closeflow-operator-metric-tiles'], 'package script check:closeflow-operator-metric-tiles missing');
assert(json.marker === 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V', 'generated json marker mismatch');
assert(json.replaced && json.replaced.includes('/tasks') && json.replaced.includes('/notifications'), 'generated json replaced routes mismatch');

console.log('CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_CHECK_OK');
console.log('replaced_routes=/tasks,/notifications');
console.log('renderer=OperatorMetricTiles');
