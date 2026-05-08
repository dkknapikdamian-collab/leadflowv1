const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_TASKS_CASES_VISUAL_MOBILE_REPAIR_STAGE16C_2026_05_08';
const cssMarker = 'CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR';
const commandName = 'check:closeflow-stage16c-tasks-cases-visual-mobile-repair';
const commandValue = 'node scripts/check-closeflow-stage16c-tasks-cases-visual-mobile-repair.cjs';

const files = {
  doc: 'docs/ui/CLOSEFLOW_TASKS_CASES_VISUAL_MOBILE_REPAIR_STAGE16C_2026-05-08.md',
  script: 'scripts/check-closeflow-stage16c-tasks-cases-visual-mobile-repair.cjs',
  packageJson: 'package.json',
  indexCss: 'src/index.css',
  css: 'src/styles/closeflow-stage16c-tasks-cases-parity.css',
  tasks: 'src/pages/TasksStable.tsx',
  cases: 'src/pages/Cases.tsx',
  metricCss: 'src/styles/closeflow-metric-tiles.css',
  pageHeaderCss: 'src/styles/closeflow-page-header.css',
  stage21Doc: 'docs/ui/CLOSEFLOW_UI_CLEANUP_RELEASE_EVIDENCE_2026-05-08.md',
};

function fail(message) {
  console.error('[closeflow-stage16c-tasks-cases-visual-mobile-repair] FAIL: ' + message);
  process.exit(1);
}
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
const cases = read(files.cases);
const metricCss = read(files.metricCss);
const pageHeaderCss = read(files.pageHeaderCss);
const stage21Doc = read(files.stage21Doc);

assert(doc.includes(marker), 'Stage16C doc missing marker');
assert(script.includes(cssMarker), 'Stage16C check missing CSS marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);
assert(indexCss.includes("@import './styles/closeflow-stage16c-tasks-cases-parity.css';"), 'index.css missing Stage16C CSS import');
assert(css.includes(cssMarker), 'Stage16C CSS missing marker');

for (const token of [
  'main[data-p0-tasks-stable-rebuild="true"]',
  '.cf-html-view.main-cases-html',
  '--cf-stage16c-page-max-width',
  'max-width: var(--cf-stage16c-page-max-width)',
  '.cf-page-hero',
  '.page-head',
  'section[data-eliteflow-task-stat-grid="true"]',
  '.grid-4',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  'grid-template-columns: 1fr',
  '@media (max-width: 720px)',
  '@media (max-width: 640px)',
  'overflow-wrap: anywhere',
  'text-overflow: ellipsis',
]) {
  assert(css.includes(token), 'Stage16C CSS missing token: ' + token);
}

assert(tasks.includes('data-stage16c-tasks-cases-repair="tasks"'), 'TasksStable missing Stage16C repair data marker');
assert(tasks.includes('cf-page-hero-actions'), 'TasksStable header actions must use cf-page-hero-actions');
assert(tasks.includes('section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-eliteflow-task-stat-grid="true"'), 'TasksStable metric grid anchor changed unexpectedly');
assert(tasks.includes('StatShortcutCard'), 'TasksStable must keep StatShortcutCard');

assert(cases.includes('data-stage16c-tasks-cases-repair="cases"'), 'Cases missing Stage16C repair data marker');
assert(cases.includes('data-stage16c-page-head="cases"'), 'Cases page head missing Stage16C data marker');
assert(cases.includes('data-stage16c-cases-stat-grid="true"'), 'Cases stat grid missing Stage16C data marker');
assert(cases.includes('StatShortcutCard'), 'Cases must keep StatShortcutCard');

for (const token of ['/tasks', '/cases', 'REPAIRED_CONTRACT', 'POZA_ZAKRESEM', 'nie zmienia danych', 'screenshot', 'npm run build']) {
  assert(doc.toLowerCase().includes(token.toLowerCase()), 'Stage16C doc missing decision token: ' + token);
}
assert(stage21Doc.includes('/tasks') && stage21Doc.includes('/cases') && stage21Doc.includes('PRZYSZLY_DEBT'), 'Stage21 evidence must still describe previous tasks/cases debt');
assert(metricCss.includes('CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A'), 'metric source truth missing Stage16A marker');
assert(pageHeaderCss.includes('CLOSEFLOW_PAGE_HEADER_CONTRACT'), 'page header source truth missing contract marker');

console.log('CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR_OK: tasks/cases visual and mobile parity repair is scoped and contract-driven');
