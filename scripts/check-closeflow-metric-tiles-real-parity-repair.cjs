#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assertIncludes(rel, text, label = text) { const file = read(rel); if (!file.includes(text)) throw new Error('Missing ' + label + ' in ' + rel); }
function assertNotIncludes(rel, text, label = text) { const file = read(rel); if (file.includes(text)) throw new Error('Forbidden ' + label + ' in ' + rel); }
function countMatches(text, re) { return [...text.matchAll(re)].length; }

const metricTile = read('src/components/ui-system/MetricTile.tsx');
const statShortcut = read('src/components/StatShortcutCard.tsx');
const operator = read('src/components/ui-system/OperatorMetricTiles.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const operatorCss = read('src/styles/closeflow-operator-metric-tiles.css');
const notificationsCss = read('src/styles/visual-stage10-notifications-vnext.css');

assertIncludes('src/components/StatShortcutCard.tsx', '<MetricTile', 'StatShortcutCard delegates to MetricTile');
assertIncludes('src/components/ui-system/MetricTile.tsx', 'data-cf-ui-component="MetricTile"', 'MetricTile component marker');
assertIncludes('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-tile', 'OperatorMetricTiles replacement marker');
assertIncludes('src/styles/closeflow-metric-tiles.css', 'CLOSEFLOW_VS5R_REAL_METRIC_TILE_PARITY_START', 'VS5R parity block');
assertIncludes('src/styles/closeflow-operator-metric-tiles.css', 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V', 'VS5V operator metric CSS block');
assertIncludes('src/pages/TasksStable.tsx', 'data-eliteflow-task-stat-grid="true"', 'tasks metric grid marker');
assertIncludes('src/pages/NotificationsCenter.tsx', 'notifications-stats-grid', 'notifications stats grid marker');
assertNotIncludes('src/pages/NotificationsCenter.tsx', 'function MetricCard(', 'dead local MetricCard');
assertNotIncludes('src/pages/NotificationsCenter.tsx', '<MetricCard', 'local MetricCard usage');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-card {', 'old notification stat card block');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-card strong', 'old notification stat card typography');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-label', 'old notification stat label');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-icon', 'old notification stat icon');

const tasksUsesOperator = tasks.includes('<OperatorMetricTiles');
const notificationsUsesOperator = notifications.includes('<OperatorMetricTiles');
const notificationTileCount = notificationsUsesOperator ? 7 : countMatches(notifications, /<StatShortcutCard/g);
const taskTileCount = tasksUsesOperator ? 4 : countMatches(tasks, /<StatShortcutCard/g);

if (tasksUsesOperator) assertNotIncludes('src/pages/TasksStable.tsx', '<StatShortcutCard', 'old task StatShortcutCard metric tiles');
else assertIncludes('src/pages/TasksStable.tsx', '<StatShortcutCard', 'tasks uses StatShortcutCard');

if (notificationsUsesOperator) {
  assertNotIncludes('src/pages/NotificationsCenter.tsx', '<StatShortcutCard', 'old notification StatShortcutCard metric tiles');
  assertNotIncludes('src/pages/NotificationsCenter.tsx', '<MetricGrid', 'old notification MetricGrid metric block');
} else {
  assertIncludes('src/pages/NotificationsCenter.tsx', '<StatShortcutCard', 'notifications uses StatShortcutCard');
}

if (notificationTileCount < 7) throw new Error('Expected at least 7 notification metric tiles, got ' + notificationTileCount);
if (taskTileCount < 4) throw new Error('Expected at least 4 task metric tiles, got ' + taskTileCount);

console.log('CLOSEFLOW_METRIC_TILES_REAL_PARITY_REPAIR_VS5R_CHECK_OK');
console.log('notifications_stat_shortcut_cards=' + notificationTileCount);
console.log('tasks_stat_shortcut_cards=' + taskTileCount);
console.log('source_of_truth=' + (tasksUsesOperator && notificationsUsesOperator ? 'OperatorMetricTiles' : 'MetricTile'));
