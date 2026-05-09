const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assertIncludes(rel, needle) { if (!read(rel).includes(needle)) throw new Error(rel + ' missing: ' + needle); }
function assertNotIncludes(rel, needle) { if (read(rel).includes(needle)) throw new Error(rel + ' should not include legacy marker: ' + needle); }
assertIncludes('src/components/ui-system/OperatorMetricTiles.tsx', 'export function OperatorMetricTile');
assertIncludes('src/components/StatShortcutCard.tsx', 'OperatorMetricTile');
assertNotIncludes('src/components/StatShortcutCard.tsx', '<MetricTile');
assertIncludes('src/pages/TasksStable.tsx', 'OperatorMetricTiles');
assertIncludes('src/pages/NotificationsCenter.tsx', 'OperatorMetricTiles');
for (const rel of ['src/pages/Leads.tsx', 'src/pages/Clients.tsx', 'src/pages/Cases.tsx']) assertIncludes(rel, 'StatShortcutCard');
assertIncludes('src/styles/closeflow-operator-metric-tiles.css', 'cf-operator-metric-value');
assertIncludes('src/styles/closeflow-operator-metric-tiles.css', 'cf-operator-metric-icon');
console.log('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_CHECK_OK');
console.log('final_renderer=OperatorMetricTile');
console.log('legacy_adapter=StatShortcutCard');
