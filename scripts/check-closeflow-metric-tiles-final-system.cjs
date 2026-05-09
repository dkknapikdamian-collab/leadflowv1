const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function mustInclude(rel, needle) { if (!read(rel).includes(needle)) throw new Error(rel + ' missing: ' + needle); }
function mustNotInclude(rel, needle) { if (read(rel).includes(needle)) throw new Error(rel + ' must not include: ' + needle); }

mustInclude('src/components/ui-system/OperatorMetricTiles.tsx', 'export function OperatorMetricTile');
mustInclude('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-metric-source-truth');
mustInclude('src/components/ui-system/OperatorMetricTiles.tsx', 'vs5x-repair3');
mustInclude('src/components/StatShortcutCard.tsx', 'OperatorMetricTile');
mustInclude('src/components/StatShortcutCard.tsx', 'StatShortcutCard is a compatibility adapter to OperatorMetricTile');
mustNotInclude('src/components/StatShortcutCard.tsx', '<MetricTile');
mustInclude('src/styles/closeflow-operator-metric-tiles.css', 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3');
for (const tone of ['neutral', 'blue', 'green', 'red', 'amber', 'purple']) mustInclude('src/styles/closeflow-operator-metric-tiles.css', 'data-cf-operator-metric-tone="' + tone + '"');
mustInclude('src/styles/closeflow-operator-metric-tiles.css', '-webkit-text-fill-color');
mustInclude('src/styles/closeflow-operator-metric-tiles.css', 'stroke: currentColor');
mustInclude('src/styles/emergency/emergency-hotfixes.css', '@import "../closeflow-operator-metric-tiles.css";');
mustInclude('src/pages/TasksStable.tsx', 'OperatorMetricTiles');
mustInclude('src/pages/NotificationsCenter.tsx', 'OperatorMetricTiles');
for (const rel of ['src/pages/Leads.tsx', 'src/pages/Clients.tsx', 'src/pages/Cases.tsx']) mustInclude(rel, 'StatShortcutCard');
const pkg = JSON.parse(read('package.json'));
for (const scriptName of ['check:closeflow-operator-metric-tone-parity', 'check:closeflow-metric-tiles-final-system', 'check:closeflow-metric-tiles-final-migration']) {
  if (!pkg.scripts || !pkg.scripts[scriptName]) throw new Error('package.json missing script ' + scriptName);
}
console.log('CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR1_CHECK_OK');
console.log('renderer=OperatorMetricTile');
console.log('adapter=StatShortcutCard->OperatorMetricTile');
console.log('direct_routes=/tasks,/notifications');
console.log('adapter_routes=/leads,/clients,/cases');
