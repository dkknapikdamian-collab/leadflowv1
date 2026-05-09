const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assertIncludes(rel, text, label = text) { const file = read(rel); if (!file.includes(text)) throw new Error('Missing ' + label + ' in ' + rel); }
function assertNotIncludes(rel, text, label = text) { const file = read(rel); if (file.includes(text)) throw new Error('Forbidden ' + label + ' in ' + rel); }

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

const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
assertIncludes('src/components/StatShortcutCard.tsx', '<MetricTile', 'StatShortcutCard delegates to MetricTile');
assertIncludes('src/components/ui-system/MetricTile.tsx', 'data-cf-ui-component="MetricTile"', 'MetricTile component marker');
assertIncludes('src/styles/closeflow-metric-tiles.css', 'CLOSEFLOW_VS5R_REAL_METRIC_TILE_PARITY_START', 'VS5R parity block');
assertIncludes('src/styles/closeflow-metric-tiles.css', '.notifications-stats-grid', 'notifications grid in central metric CSS');
assertIncludes('src/styles/closeflow-metric-tiles.css', 'data-eliteflow-task-stat-grid="true"', 'tasks grid in central metric CSS');
assertIncludes('src/pages/TasksStable.tsx', 'data-eliteflow-task-stat-grid="true"', 'tasks metric grid marker');
assertIncludes('src/pages/TasksStable.tsx', '<StatShortcutCard', 'tasks uses StatShortcutCard');
assertIncludes('src/pages/TasksStable.tsx', '<MetricGrid className="cf-tasks-metric-grid"', 'tasks uses MetricGrid shell');
assertIncludes('src/pages/NotificationsCenter.tsx', 'notifications-stats-grid', 'notifications stats grid marker');
assertIncludes('src/pages/NotificationsCenter.tsx', '<StatShortcutCard', 'notifications uses StatShortcutCard');
assertIncludes('src/pages/NotificationsCenter.tsx', '<MetricGrid className="notifications-stats-grid"', 'notifications uses MetricGrid shell');
assertNotIncludes('src/pages/NotificationsCenter.tsx', 'function MetricCard(', 'dead local MetricCard');
assertNotIncludes('src/pages/NotificationsCenter.tsx', '<MetricCard', 'local MetricCard usage');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-card {', 'old notification stat card block');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-card strong', 'old notification stat card typography');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-label', 'old notification stat label');
assertNotIncludes('src/styles/visual-stage10-notifications-vnext.css', '.notifications-stat-icon', 'old notification stat icon');
const notificationTileCount = countNotificationTiles(notifications);
const taskTileCount = countTaskTiles(tasks);
if (notificationTileCount < 7) throw new Error('Expected at least 7 notification StatShortcutCard tiles, got ' + notificationTileCount);
if (taskTileCount < 4) throw new Error('Expected at least 4 task StatShortcutCard-backed tiles, got ' + taskTileCount);
console.log('CLOSEFLOW_METRIC_TILES_REAL_PARITY_REPAIR_VS5R_CHECK_OK');
console.log('notifications_stat_shortcut_cards=' + notificationTileCount);
console.log('tasks_stat_shortcut_cards=' + taskTileCount);
console.log('source_of_truth=MetricTile');
