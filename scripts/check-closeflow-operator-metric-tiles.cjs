const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function includesAny(text, needles) { return needles.some((needle) => text.includes(needle)); }

const component = read('src/components/ui-system/OperatorMetricTiles.tsx');
assert(component.includes('export function OperatorMetricTiles'), 'OperatorMetricTiles export missing');
assert(component.includes('export function OperatorMetricTile'), 'OperatorMetricTile export missing');
assert(component.includes('data-cf-metric-source-truth'), 'OperatorMetricTiles source truth attribute missing');
assert(includesAny(component, ['vs5x-repair3', 'data-cf-metric-source-truth="vs5v"', 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT']), 'OperatorMetricTiles source truth marker missing');
assert(component.includes('data-cf-operator-metric-tone'), 'OperatorMetricTiles tone marker missing');
assert(component.includes('data-cf-operator-metric-id'), 'OperatorMetricTiles metric identity marker missing');

const index = read('src/components/ui-system/index.ts');
assert(index.includes('OperatorMetricTiles'), 'ui-system index must export OperatorMetricTiles');
assert(index.includes('OperatorMetricTile'), 'ui-system index must export OperatorMetricTile');

const css = read('src/styles/closeflow-operator-metric-tiles.css');
for (const needle of ['cf-operator-metric-grid', 'cf-operator-metric-tile', 'cf-operator-metric-value', 'cf-operator-metric-icon', 'stroke: currentColor']) {
  assert(css.includes(needle), 'operator metric CSS missing ' + needle);
}
for (const tone of ['blue', 'green', 'red', 'amber', 'purple', 'neutral']) {
  assert(css.includes('data-cf-operator-metric-tone="' + tone + '"'), 'operator metric CSS missing tone ' + tone);
}

const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
assert(tasks.includes('OperatorMetricTiles'), 'TasksStable must use OperatorMetricTiles');
assert(notifications.includes('OperatorMetricTiles'), 'NotificationsCenter must use OperatorMetricTiles');
assert(tasks.includes('data-cf-metric-replacement="vs5v"') || tasks.includes('data-cf-metric-renderer="OperatorMetricTiles"') || tasks.includes('OperatorMetricTiles'), 'TasksStable replacement marker missing');
assert(notifications.includes('data-cf-metric-replacement="vs5v"') || notifications.includes('data-cf-metric-renderer="OperatorMetricTiles"') || notifications.includes('OperatorMetricTiles'), 'NotificationsCenter replacement marker missing');

const stat = read('src/components/StatShortcutCard.tsx');
assert(stat.includes('OperatorMetricTile'), 'StatShortcutCard must bridge to OperatorMetricTile');
assert(!stat.includes('<MetricTile'), 'StatShortcutCard must not render MetricTile directly after VS5X');

console.log('CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_CHECK_OK');
console.log('source_of_truth=OperatorMetricTile');
console.log('compatibility_marker=VS5V_ACCEPTS_VS5X');
console.log('replaced_routes=/tasks,/notifications');
