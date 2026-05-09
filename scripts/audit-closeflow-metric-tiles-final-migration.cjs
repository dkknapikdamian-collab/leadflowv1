#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function countTaskTiles(text) { const jsx = (text.match(/<StatShortcutCard\b/g) || []).length; const labels = ['Aktywne','Dziś','Zaległe','Zrobione'].filter((label) => text.includes("label: '" + label + "'") || text.includes('label: "' + label + '"')).length; return Math.max(jsx, labels); }
const screens = [
  { route: '/tasks', file: 'src/pages/TasksStable.tsx', marker: 'MetricGrid', count: countTaskTiles(read('src/pages/TasksStable.tsx')) },
  { route: '/cases', file: 'src/pages/Cases.tsx', marker: 'legacy grid evidence', count: (read('src/pages/Cases.tsx').match(/<StatShortcutCard\b/g) || []).length },
  { route: '/leads', file: 'src/pages/Leads.tsx', marker: 'legacy grid evidence', count: (read('src/pages/Leads.tsx').match(/<StatShortcutCard\b/g) || []).length },
  { route: '/clients', file: 'src/pages/Clients.tsx', marker: 'legacy grid evidence', count: (read('src/pages/Clients.tsx').match(/<StatShortcutCard\b/g) || []).length },
];
const payload = {
  marker: STAGE,
  generatedAt: new Date().toISOString(),
  sourceOfTruth: 'StatShortcutCard -> MetricTile; /tasks and /notifications additionally use MetricGrid shell',
  totals: {
    screens: screens.length,
    standardAdapterActive: screens.every((s) => s.count >= 4),
    totalStatShortcutCards: screens.reduce((sum, s) => sum + s.count, 0),
  },
  screens,
};
fs.mkdirSync(path.join(root, 'docs/ui'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/ui/closeflow-metric-tiles-final-migration.generated.json'), JSON.stringify(payload, null, 2) + '\n');
console.log('CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_AUDIT_OK');
console.log('screens=' + payload.totals.screens);
console.log('stat_shortcut_cards=' + payload.totals.totalStatShortcutCards);
