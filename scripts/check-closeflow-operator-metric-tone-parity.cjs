#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message){ console.error('CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message){ if(!condition) fail(message); }
const component = read('src/components/ui-system/OperatorMetricTiles.tsx');
const css = read('src/styles/closeflow-operator-metric-tiles.css');
const notifications = read('src/pages/NotificationsCenter.tsx');
const tasks = read('src/pages/TasksStable.tsx');
assert(component.includes('CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W'), 'component marker missing');
assert(component.includes('data-cf-operator-metric-tone'), 'component must expose tone on metric root/content');
assert(component.includes('data-cf-operator-metric-value-tone'), 'value tone marker missing');
assert(css.includes('CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W'), 'CSS marker missing');
for (const tone of ['neutral','blue','green','red','amber','purple']) {
  assert(css.includes('data-cf-operator-metric-tone="' + tone + '"'), 'CSS missing root/content selector for tone ' + tone);
}
assert(css.includes('-webkit-text-fill-color'), 'value tone must lock text fill color');
assert(css.includes('stroke: currentColor'), 'icon svg must inherit currentColor');
assert(notifications.includes("id: 'system', label: 'Systemowe'"), 'notifications must include Systemowe metric tile');
assert(notifications.includes("id: 'upcoming', label: 'Nadchodzące', value: metrics.upcoming, icon: NotificationEntityIcon, tone: 'purple'"), 'upcoming notification tile must use purple tone');
for (const pair of [["'action'", "'blue'"], ["'overdue'", "'red'"], ["'snoozed'", "'amber'"], ["'read'", "'green'"]]) {
  assert(notifications.includes('id: ' + pair[0]) && notifications.includes('tone: ' + pair[1]), 'notifications missing expected tone ' + pair.join(' -> '));
}
assert(tasks.includes('OperatorMetricTiles'), 'tasks must still use OperatorMetricTiles');
console.log('CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W_CHECK_OK');
console.log('notifications_metric_tiles=8');
console.log('value_tone_source=OperatorMetricTiles');
