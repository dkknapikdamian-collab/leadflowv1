const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function fail(message) {
  console.error('[eliteflow-tasks-tiles-text-clip-repair] FAIL: ' + message);
  process.exit(1);
}

const tasks = read('src/pages/TasksStable.tsx');
const stat = read('src/components/StatShortcutCard.tsx');
const index = read('src/index.css');
const css = read('src/styles/eliteflow-metric-text-clip-tasks-repair.css');

const importLine = "@import './styles/eliteflow-metric-text-clip-tasks-repair.css';";
if (!index.includes(importLine)) fail('src/index.css missing final text clip/tasks repair import');
if (!index.trim().endsWith(importLine)) fail('text clip/tasks repair import must be the final non-empty line in src/index.css');

[
  "import { StatShortcutCard } from '../components/StatShortcutCard';",
  'data-eliteflow-task-stat-grid="true"',
  '<StatShortcutCard',
  'valueClassName={card.tone}',
  'iconClassName={card.iconClassName}',
].forEach((needle) => {
  if (!tasks.includes(needle)) fail('TasksStable missing marker: ' + needle);
});

if (tasks.includes('<button key={card.id} type="button" onClick={() => setScope(card.id)}')) {
  fail('TasksStable still renders old hardcoded top metric buttons');
}

[
  'cf-top-metric-tile-label truncate',
  'cf-top-metric-tile-helper mt-1 truncate',
  'cf-top-metric-tile-value min-w-0 max-w-[11rem] truncate',
].forEach((needle) => {
  if (stat.includes(needle)) fail('StatShortcutCard still has clipping class: ' + needle);
});

[
  'ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_2026_05_07',
  'overflow: visible !important',
  'line-height: 1.16 !important',
  'section[data-eliteflow-task-stat-grid="true"]',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important',
].forEach((needle) => {
  if (!css.includes(needle)) fail('repair CSS missing marker: ' + needle);
});

console.log('[eliteflow-tasks-tiles-text-clip-repair] OK: Tasks top tiles use StatShortcutCard and metric text is not clipped');
