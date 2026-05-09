#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(message) { console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function countTaskTiles(text) { const jsx = (text.match(/<StatShortcutCard\b/g) || []).length; const labels = ['Aktywne','Dziś','Zaległe','Zrobione'].filter((label) => text.includes("label: '" + label + "'") || text.includes('label: "' + label + '"')).length; return Math.max(jsx, labels); }
function countNotificationTiles(text) { const jsx = (text.match(/<StatShortcutCard\b/g) || []).length; const labels = ['Wszystkie','Do reakcji','Zaległe','Dzisiaj','Nadchodzące','Odłożone','Przeczytane'].filter((label) => text.includes('label="' + label + '"') || text.includes("label='" + label + "'")).length; return Math.max(jsx, labels); }
for (const rel of ['src/index.css','src/components/ui-system/MetricGrid.tsx','src/components/ui-system/MetricTile.tsx','src/components/StatShortcutCard.tsx','src/pages/TasksStable.tsx','src/pages/NotificationsCenter.tsx','src/styles/closeflow-metric-tiles.css','src/styles/visual-stage10-notifications-vnext.css','docs/ui/CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_2026-05-09.md','docs/ui/closeflow-metric-tile-single-source-truth.generated.json']) assert(exists(rel), 'missing file: ' + rel);
const index = read('src/index.css');
const grid = read('src/components/ui-system/MetricGrid.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const notificationsCss = read('src/styles/visual-stage10-notifications-vnext.css');
const pkg = JSON.parse(read('package.json'));
const json = JSON.parse(read('docs/ui/closeflow-metric-tile-single-source-truth.generated.json'));
assert(index.includes("@import './styles/closeflow-metric-tiles.css';"), 'src/index.css must import closeflow-metric-tiles.css');
assert(grid.includes('HTMLAttributes<HTMLElement>'), 'MetricGrid must accept HTML/data/aria props');
assert(grid.includes('...props'), 'MetricGrid must forward props');
assert(grid.includes('data-cf-metric-single-source="vs5s"'), 'MetricGrid single-source marker missing');
assert(tasks.includes("import { MetricGrid } from '../components/ui-system';"), 'TasksStable must import MetricGrid');
assert(tasks.includes('<MetricGrid className="cf-tasks-metric-grid"'), 'TasksStable must use MetricGrid for task metrics');
assert(!tasks.includes('className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-eliteflow-task-stat-grid'), 'TasksStable still has local metric grid class');
assert(countTaskTiles(tasks) >= 4, 'TasksStable must define 4 StatShortcutCard-backed metric tiles');
assert(notifications.includes('MetricGrid, NotificationEntityIcon'), 'NotificationsCenter must import MetricGrid');
assert(notifications.includes('<MetricGrid className="notifications-stats-grid"'), 'NotificationsCenter must use MetricGrid for notification metrics');
assert(!notifications.includes('function MetricCard('), 'NotificationsCenter must not keep local MetricCard');
assert(countNotificationTiles(notifications) >= 7, 'NotificationsCenter must define 7 StatShortcutCard metric tiles');
assert(metricCss.includes('CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S_START'), 'central metric CSS VS5S bridge missing');
assert(metricCss.includes('white-space: nowrap !important;'), 'central metric CSS must block label word-splitting');
assert(metricCss.includes('[data-cf-metric-grid-contract="final-vs5"]'), 'central metric CSS must target MetricGrid contract');
assert(!notificationsCss.includes('.notifications-stat-card {'), 'old notification stat-card CSS block still present');
assert(!notificationsCss.includes('.notifications-stat-label'), 'old notification stat label still present');
assert(!notificationsCss.includes('.notifications-stat-icon'), 'old notification stat icon still present');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tile-single-source-truth'], 'package VS5S check script missing');
assert(json.marker === STAGE, 'generated JSON marker mismatch');
console.log('CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S_CHECK_OK');
console.log('tasks_metric_tiles=4');
console.log('notifications_metric_tiles=7');
console.log('source_of_truth=MetricGrid->StatShortcutCard->MetricTile');
