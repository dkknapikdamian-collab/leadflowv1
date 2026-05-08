const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_TASKS_METRIC_TILE_FINAL_LOCK_STAGE16D_2026_05_08';
const cssMarker = 'CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK';
const commandName = 'check:closeflow-stage16d-tasks-metric-final-lock';
const commandValue = 'node scripts/check-closeflow-stage16d-tasks-metric-final-lock.cjs';

const files = {
  doc: 'docs/ui/CLOSEFLOW_TASKS_METRIC_TILE_FINAL_LOCK_STAGE16D_2026-05-08.md',
  script: 'scripts/check-closeflow-stage16d-tasks-metric-final-lock.cjs',
  packageJson: 'package.json',
  indexCss: 'src/index.css',
  css: 'src/styles/closeflow-stage16d-tasks-metric-final-lock.css',
  tasks: 'src/pages/TasksStable.tsx',
  statShortcut: 'src/components/StatShortcutCard.tsx',
};

function fail(message) { console.error('[closeflow-stage16d-tasks-metric-final-lock] FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function abs(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(abs(rel)); }
function read(rel) { return fs.readFileSync(abs(rel), 'utf8'); }
function bytes(rel) { return fs.readFileSync(abs(rel)); }
function assertNoBom(rel) {
  const b = bytes(rel);
  assert(!(b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf), rel + ' must be UTF-8 without BOM');
}
function assertNoControl(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}
function assertNoMojibake(rel, text) {
  const markers = [String.fromCharCode(0x00c4), String.fromCharCode(0x00c5), String.fromCharCode(0x0139), String.fromCharCode(0xfffd)];
  for (const item of markers) assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase());
}

for (const rel of Object.values(files)) assert(exists(rel), 'Missing required file: ' + rel);
for (const rel of [files.doc, files.script, files.css, files.packageJson]) {
  assertNoBom(rel);
  const text = read(rel);
  assertNoControl(rel, text);
  assertNoMojibake(rel, text);
}

const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson).replace(/^\uFEFF/, ''));
const indexCss = read(files.indexCss);
const css = read(files.css);
const tasks = read(files.tasks);
const statShortcut = read(files.statShortcut);

assert(doc.includes(marker), 'Stage16D doc missing marker');
assert(script.includes(cssMarker), 'Stage16D check missing CSS marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);
assert(indexCss.includes("@import './styles/closeflow-stage16d-tasks-metric-final-lock.css';"), 'index.css missing Stage16D import');
assert(css.includes(cssMarker), 'Stage16D CSS missing marker');

const importPos = indexCss.indexOf("@import './styles/closeflow-stage16d-tasks-metric-final-lock.css';");
const knownLateImport = indexCss.indexOf("@import './styles/eliteflow-semantic-badges-and-today-sections.css';");
assert(knownLateImport === -1 || importPos > knownLateImport, 'Stage16D import must be after late eliteflow imports');

for (const token of [
  'main[data-p0-tasks-stable-rebuild="true"][data-stage16c-tasks-cases-repair="tasks"]',
  '--cf-stage16d-task-metric-radius: 16px',
  '--cf-stage16d-task-metric-min-height: 56px',
  '--cf-stage16d-task-metric-label-size: 11px',
  '--cf-stage16d-task-metric-value-size: 20px',
  '--cf-stage16d-task-metric-icon-size: 26px',
  'section[data-eliteflow-task-stat-grid="true"]',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  'grid-template-columns: 1fr',
  'white-space: nowrap',
  'overflow-wrap: normal',
  'word-break: keep-all',
  'text-overflow: ellipsis',
  'min-width: max-content',
  '@media (max-width: 640px)',
]) {
  assert(css.includes(token), 'Stage16D CSS missing token: ' + token);
}

assert(tasks.includes('CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK'), 'TasksStable missing Stage16D guard');
assert(tasks.includes('data-stage16d-task-metric-final-lock="true"'), 'TasksStable metric section missing Stage16D data marker');
assert(tasks.includes('data-stage16c-tasks-cases-repair="tasks"'), 'TasksStable missing Stage16C tasks marker');
assert(tasks.includes('StatShortcutCard'), 'TasksStable must keep StatShortcutCard');
assert(statShortcut.includes('cf-top-metric-tile-label'), 'StatShortcutCard missing label class');
assert(statShortcut.includes('cf-top-metric-tile-value-row'), 'StatShortcutCard missing value row class');

for (const token of ['AKTYWNE', 'ZROBIONE', 'label jest za duzy', '/tasks', 'POZA_ZAKRESEM', 'npm run build']) {
  assert(doc.toLowerCase().includes(token.toLowerCase()), 'Stage16D doc missing evidence token: ' + token);
}

console.log('CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK_OK: /tasks metric tiles are locked to compact visual parity');
