const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = process.cwd();
const p = (...parts) => path.join(root, ...parts);
const read = (file) => fs.readFileSync(p(file), 'utf8');
const write = (file, text) => fs.writeFileSync(p(file), text.replace(/\r\n/g, '\n'), 'utf8');
const ensureDir = (dir) => fs.mkdirSync(p(dir), { recursive: true });
function fail(message) { console.error('STAGE80_DESKTOP_VISIBILITY_V3_FAIL: ' + message); process.exit(1); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail('node --check failed for ' + file + '\n' + result.stdout + result.stderr);
}
function ensurePackageScript(pkg, name, command) {
  if (!pkg.scripts) pkg.scripts = {};
  pkg.scripts[name] = command;
}

ensureDir('scripts');
ensureDir('tests');
ensureDir('src/styles');
ensureDir('tools');

let today = read('src/pages/TodayStable.tsx');
const rowStart = today.indexOf('function RowLink({');
const rowEnd = today.indexOf('async function loadStableTodayData');
if (rowStart < 0 || rowEnd < rowStart) fail('cannot isolate RowLink block in TodayStable');
let before = today.slice(0, rowStart);
let row = today.slice(rowStart, rowEnd);
let after = today.slice(rowEnd);

if (!row.includes('cf-today-row-actions')) {
  row = row.replace('className="flex items-center gap-2"', 'className="cf-today-row-actions flex items-center gap-2"');
}
if (!row.includes('cf-today-row-actions')) fail('could not add cf-today-row-actions class to RowLink actions wrapper');

if (!row.includes('stage80TaskRoute')) {
  const oldLine = "  const fb4TaskId = typeof to === 'string' && to.startsWith('/tasks/') ? (to.split('/').filter(Boolean).pop() || '') : '';";
  const newBlock = String.raw`  const stage80TaskRoute = typeof to === 'string' ? to : '';
  const stage80TaskPathId = stage80TaskRoute.startsWith('/tasks/') ? (stage80TaskRoute.split('?')[0].split('/').filter(Boolean).pop() || '') : '';
  const stage80TaskQueryId = stage80TaskRoute.includes('?') ? (new URLSearchParams(stage80TaskRoute.split('?')[1] || '').get('id') || '') : '';
  const fb4TaskId = stage80TaskPathId || stage80TaskQueryId;
  const isStage80TaskBadge = normalizeSemanticLabel(badge).includes('zadanie');`;
  if (!row.includes(oldLine)) fail('cannot find fb4TaskId line to upgrade task route detection');
  row = row.replace(oldLine, newBlock);
}
if (row.includes("const isStage79TaskRow = doneKind === 'task' || Boolean(fb4TaskId);")) {
  row = row.replace("const isStage79TaskRow = doneKind === 'task' || Boolean(fb4TaskId);", "const isStage79TaskRow = doneKind === 'task' || Boolean(fb4TaskId) || isStage80TaskBadge;");
}
if (!row.includes('isStage80TaskBadge')) fail('RowLink missing Stage80 task badge fallback');
if (!row.includes("Boolean(fb4TaskId) || isStage80TaskBadge")) fail('RowLink does not use Stage80 task badge fallback in task row detection');

// Add an explicit class to the task done button. This is idempotent and tied to the existing Stage79 marker.
if (!row.includes('cf-today-task-done-button')) {
  const marker = 'data-stage79-task-done-action="true"';
  const idx = row.indexOf(marker);
  if (idx < 0) fail('cannot find Stage79 task done button marker');
  const buttonStart = row.lastIndexOf('<Button', idx);
  const buttonEnd = row.indexOf('>', idx);
  if (buttonStart < 0 || buttonEnd < 0) fail('cannot isolate Stage79 task done button opening tag');
  const openTag = row.slice(buttonStart, buttonEnd + 1);
  let nextOpenTag = openTag;
  if (openTag.includes('className=')) {
    nextOpenTag = openTag.replace(/className="([^"]*)"/, (m, cls) => `className="${cls} cf-today-task-done-button"`);
  } else {
    nextOpenTag = openTag.replace(marker, marker + '\n              className="cf-today-task-done-button"');
  }
  row = row.slice(0, buttonStart) + nextOpenTag + row.slice(buttonEnd + 1);
}
if (!row.includes('cf-today-task-done-button')) fail('could not add desktop task done button class');

// Add a DOM scope to row links so CSS can target all desktop/mobile variants without relying on Tailwind order.
if (!row.includes('data-cf-today-row-link="true"')) {
  row = row.replace('<div className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50">', '<div data-cf-today-row-link="true" className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50">');
}

today = before + row + after;
write('src/pages/TodayStable.tsx', today);

const cssPath = 'src/styles/stage80-today-task-done-desktop-visibility.css';
const css = String.raw`/* STAGE80_TODAY_TASK_DONE_DESKTOP_VISIBILITY
   Desktop lock for Today task rows. Stage79 already owns the data write; this file only prevents desktop layouts/stage CSS from hiding the action button.
*/
[data-p0-today-stable-rebuild="true"] [data-cf-today-row-link="true"] {
  overflow: visible !important;
}

[data-p0-today-stable-rebuild="true"] .cf-today-row-actions {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 0.5rem !important;
  flex-wrap: wrap !important;
  min-width: max-content;
  overflow: visible !important;
}

[data-p0-today-stable-rebuild="true"] .cf-today-task-done-button[data-stage79-task-done-action="true"] {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  white-space: nowrap !important;
  flex: 0 0 auto !important;
  position: relative !important;
  z-index: 3 !important;
}

@media (min-width: 640px) {
  [data-p0-today-stable-rebuild="true"] .cf-today-row-actions {
    flex-direction: row !important;
    width: auto !important;
  }

  [data-p0-today-stable-rebuild="true"] .cf-today-task-done-button[data-stage79-task-done-action="true"] {
    min-width: max-content !important;
    transform: none !important;
  }
}
`;
write(cssPath, css);

let main = read('src/main.tsx');
const cssImport = "import './styles/stage80-today-task-done-desktop-visibility.css';";
if (!main.includes(cssImport)) {
  const indexImport = "import './index.css';";
  if (main.includes(indexImport)) {
    main = main.replace(indexImport, indexImport + '\n' + cssImport);
  } else {
    main += '\n' + cssImport + '\n';
  }
  write('src/main.tsx', main);
}

const check = String.raw`const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE80_TODAY_TASK_DONE_DESKTOP_VISIBILITY_FAIL: ' + message); process.exit(1); }
const today = read('src/pages/TodayStable.tsx');
const css = read('src/styles/stage80-today-task-done-desktop-visibility.css');
const main = read('src/main.tsx');
for (const token of [
  'cf-today-row-actions',
  'cf-today-task-done-button',
  'data-stage79-task-done-action',
  'stage80TaskRoute',
  'stage80TaskPathId',
  'stage80TaskQueryId',
  'isStage80TaskBadge',
  "Boolean(fb4TaskId) || isStage80TaskBadge",
  "status: 'done'",
]) {
  if (!today.includes(token)) fail('TodayStable missing desktop/task-done token: ' + token);
}
for (const token of [
  '.cf-today-row-actions',
  '.cf-today-task-done-button[data-stage79-task-done-action="true"]',
  'display: inline-flex !important',
  'visibility: visible !important',
  'opacity: 1 !important',
  '@media (min-width: 640px)',
]) {
  if (!css.includes(token)) fail('desktop visibility CSS missing token: ' + token);
}
if (!main.includes("stage80-today-task-done-desktop-visibility.css")) fail('main.tsx does not import Stage80 desktop visibility CSS');
const badHidden = /\.cf-today-task-done-button[\s\S]{0,220}(display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0)/i;
if (badHidden.test(css)) fail('Stage80 CSS hides the task done button');
console.log('OK stage80 today task done desktop visibility');
`;
write('scripts/check-stage80-today-task-done-desktop-visibility.cjs', check);

const test = String.raw`const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, file + '\n' + result.stdout + result.stderr);
}
test('Stage80 checker is syntactically valid', () => {
  nodeCheck('scripts/check-stage80-today-task-done-desktop-visibility.cjs');
});
test('Stage80 guard passes current repo', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage80-today-task-done-desktop-visibility.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('Today RowLink exposes desktop-visible task done action', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.ok(today.includes('cf-today-row-actions'));
  assert.ok(today.includes('cf-today-task-done-button'));
  assert.ok(today.includes('isStage80TaskBadge'));
  assert.ok(today.includes("status: 'done'"));
});
test('Stage80 CSS forces desktop visibility instead of mobile-only action', () => {
  const css = read('src/styles/stage80-today-task-done-desktop-visibility.css');
  assert.ok(css.includes('@media (min-width: 640px)'));
  assert.ok(css.includes('display: inline-flex !important'));
  assert.ok(css.includes('visibility: visible !important'));
  assert.ok(css.includes('opacity: 1 !important'));
});
`;
write('tests/stage80-today-task-done-desktop-visibility.test.cjs', test);

let pkg = JSON.parse(read('package.json'));
ensurePackageScript(pkg, 'check:stage80-today-task-done-desktop-visibility', 'node scripts/check-stage80-today-task-done-desktop-visibility.cjs');
ensurePackageScript(pkg, 'test:stage80-today-task-done-desktop-visibility', 'node --test tests/stage80-today-task-done-desktop-visibility.test.cjs');
write('package.json', JSON.stringify(pkg, null, 2) + '\n');

for (const file of [
  'scripts/check-stage80-today-task-done-desktop-visibility.cjs',
  'tests/stage80-today-task-done-desktop-visibility.test.cjs',
]) nodeCheck(file);
console.log('OK: Stage80 Today task done desktop visibility v3 patch applied.');
