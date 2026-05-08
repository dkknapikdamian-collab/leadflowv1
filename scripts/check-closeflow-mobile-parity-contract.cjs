const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_MOBILE_PARITY_STAGE20_2026_05_08';
const commandName = 'check:closeflow-mobile-parity-contract';
const commandValue = 'node scripts/check-closeflow-mobile-parity-contract.cjs';

const files = {
  doc: 'docs/ui/CLOSEFLOW_MOBILE_PARITY_STAGE20_2026-05-08.md',
  script: 'scripts/check-closeflow-mobile-parity-contract.cjs',
  packageJson: 'package.json',
  metricCss: 'src/styles/closeflow-metric-tiles.css',
  pageHeaderCss: 'src/styles/closeflow-page-header.css',
  formActionsCss: 'src/styles/closeflow-form-actions.css',
  actionClustersCss: 'src/styles/closeflow-action-clusters.css',
  surfaceCss: 'src/styles/closeflow-surface-tokens.css',
  listRowCss: 'src/styles/closeflow-list-row-tokens.css',
  cardReadabilityCss: 'src/styles/closeflow-card-readability.css',
};

const activeScreens = {
  '/today': 'src/pages/TodayStable.tsx',
  '/tasks': 'src/pages/TasksStable.tsx',
  '/leads': 'src/pages/Leads.tsx',
  '/clients': 'src/pages/Clients.tsx',
  '/cases': 'src/pages/Cases.tsx',
  '/calendar': 'src/pages/Calendar.tsx',
  '/ai-drafts': 'src/pages/AiDrafts.tsx',
  '/notifications': 'src/pages/NotificationsCenter.tsx',
};

function fail(message) {
  console.error('[closeflow-mobile-parity-contract] FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readBytes(rel) {
  return fs.readFileSync(abs(rel));
}

function assertNoBom(rel) {
  const bytes = readBytes(rel);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  assert(!hasBom, rel + ' must be UTF-8 without BOM');
}

function assertNoControl(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function assertNoMojibake(rel, text) {
  const markers = [
    String.fromCharCode(0x00c4),
    String.fromCharCode(0x00c5),
    String.fromCharCode(0x0139),
    String.fromCharCode(0xfffd),
  ];
  for (const item of markers) {
    assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase());
  }
}

for (const rel of Object.values(files)) {
  assert(exists(rel), 'Missing required file: ' + rel);
}

for (const rel of [files.doc, files.script, files.packageJson]) {
  assertNoBom(rel);
  const text = read(rel);
  assertNoControl(rel, text);
  assertNoMojibake(rel, text);
}

for (const [route, rel] of Object.entries(activeScreens)) {
  assert(exists(rel), 'Missing active screen for ' + route + ': ' + rel);
}

const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson));
const metricCss = read(files.metricCss);
const pageHeaderCss = read(files.pageHeaderCss);
const formActionsCss = read(files.formActionsCss);
const actionClustersCss = read(files.actionClustersCss);
const surfaceCss = read(files.surfaceCss);
const listRowCss = read(files.listRowCss);
const cardReadabilityCss = read(files.cardReadabilityCss);

assert(doc.includes(marker), 'Stage20 document missing marker');
assert(script.includes(marker), 'Stage20 check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

for (const route of Object.keys(activeScreens)) {
  assert(doc.includes('| `' + route + '` |'), 'Stage20 document missing route row: ' + route);
}

for (const token of [
  'OK_CONTRACT',
  'WYMAGA_OSOBNEGO_ETAPU',
  'PRZYSZLY_DEBT',
  'DO_POTWIERDZENIA_SCREENSHOTEM',
  'grid-template-columns: 1fr',
  'Danger action',
  'right-card',
  'Dlugie nazwy',
]) {
  assert(doc.includes(token), 'Stage20 document missing decision token: ' + token);
}

for (const route of ['/tasks', '/cases']) {
  const row = doc.split('\n').find((line) => line.includes('| `' + route + '` |')) || '';
  assert(row.includes('WYMAGA_OSOBNEGO_ETAPU'), route + ' must stay marked as WYMAGA_OSOBNEGO_ETAPU');
}

for (const route of ['/today', '/leads', '/clients', '/calendar', '/ai-drafts', '/notifications']) {
  const row = doc.split('\n').find((line) => line.includes('| `' + route + '` |')) || '';
  assert(row.includes('OK_CONTRACT'), route + ' must be documented as OK_CONTRACT');
}

assert(metricCss.includes('@media (max-width: 640px)'), 'metric tiles CSS missing mobile media query');
assert(metricCss.includes('grid-template-columns: 1fr'), 'metric tiles CSS missing one-column mobile grid');
assert(metricCss.includes('white-space: nowrap'), 'metric tiles CSS must keep short labels unbroken');
assert(metricCss.includes('overflow: hidden'), 'metric tiles CSS must protect long labels with overflow handling');
assert(metricCss.includes('text-overflow: ellipsis'), 'metric tiles CSS must ellipsize long metric labels');

assert(pageHeaderCss.includes('@media (max-width: 720px)'), 'page header CSS missing mobile media query');
assert(pageHeaderCss.includes('flex-direction: column'), 'page header CSS must stack on mobile');
assert(pageHeaderCss.includes('width: 100%'), 'page header actions must be full-width capable on mobile');
assert(pageHeaderCss.includes('justify-content: flex-start'), 'page header actions must not float unpredictably on mobile');

assert(formActionsCss.includes('@media (max-width: 640px)'), 'form actions CSS missing mobile media query');
assert(formActionsCss.includes('align-items: stretch'), 'form actions must stretch on mobile');
assert(formActionsCss.includes('width: 100%'), 'form actions buttons must support full width on mobile');
assert(formActionsCss.includes('min-height: 2.75rem'), 'form actions buttons must keep tap target height');

assert(actionClustersCss.includes('@media (max-width: 640px)'), 'action cluster CSS missing mobile media query');
assert(actionClustersCss.includes('.cf-danger-action-zone'), 'action cluster CSS missing danger zone');
assert(actionClustersCss.includes('justify-content: stretch'), 'action clusters must stretch on mobile');
assert(actionClustersCss.includes('gap: 0.5rem'), 'action clusters must preserve spacing');

assert(surfaceCss.includes('.right-card'), 'surface CSS missing right-card coverage');
assert(surfaceCss.includes('calendar-week-filter'), 'surface CSS missing calendar right-card coverage');
assert(surfaceCss.includes('background: var(--cf-surface-card)'), 'surface CSS missing shared card background');

assert(listRowCss.includes('.cf-list-row-meta'), 'list row CSS missing meta wrapper');
assert(listRowCss.includes('flex-wrap: wrap'), 'list row CSS must allow meta wrapping');
assert(listRowCss.includes('white-space: nowrap'), 'list row pills must protect compact labels');

assert(cardReadabilityCss.includes('CLOSEFLOW_CARD_READABILITY_CONTRACT'), 'card readability CSS missing contract marker');
assert(cardReadabilityCss.includes('.cf-readable-card'), 'card readability CSS missing readable card class');

console.log('CLOSEFLOW_MOBILE_PARITY_STAGE20_OK: mobile parity contract documented and source tokens are present');
