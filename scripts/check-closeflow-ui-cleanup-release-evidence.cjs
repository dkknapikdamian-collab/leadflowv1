const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_UI_CLEANUP_RELEASE_EVIDENCE_2026_05_08';
const commandName = 'check:closeflow-ui-cleanup-release-evidence';
const commandValue = 'node scripts/check-closeflow-ui-cleanup-release-evidence.cjs';

const files = {
  doc: 'docs/ui/CLOSEFLOW_UI_CLEANUP_RELEASE_EVIDENCE_2026-05-08.md',
  script: 'scripts/check-closeflow-ui-cleanup-release-evidence.cjs',
  packageJson: 'package.json',
  metricCss: 'src/styles/closeflow-metric-tiles.css',
  pageHeaderCss: 'src/styles/closeflow-page-header.css',
  surfaceCss: 'src/styles/closeflow-surface-tokens.css',
  listRowCss: 'src/styles/closeflow-list-row-tokens.css',
  alertCss: 'src/styles/closeflow-alert-severity.css',
  actionCss: 'src/styles/closeflow-action-tokens.css',
  actionClusterCss: 'src/styles/closeflow-action-clusters.css',
  formCss: 'src/styles/closeflow-form-actions.css',
  cardCss: 'src/styles/closeflow-card-readability.css',
  entityTypeCss: 'src/styles/closeflow-entity-type-tokens.css',
  app: 'src/App.tsx',
  todayLegacy: 'src/pages/Today.tsx',
  todayActive: 'src/pages/TodayStable.tsx',
};

const activeScreens = [
  'src/pages/TodayStable.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
];

function fail(message) {
  console.error('[closeflow-ui-cleanup-release-evidence] FAIL: ' + message);
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

for (const rel of activeScreens) {
  assert(exists(rel), 'Missing active UI screen: ' + rel);
}

const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson));
const app = read(files.app);

assert(doc.includes(marker), 'release evidence document missing marker');
assert(script.includes(marker), 'release evidence check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

for (const stage of Array.from({ length: 22 }, (_, index) => index)) {
  const pattern = new RegExp('\\|\\s*' + stage + '\\s*\\|');
  assert(pattern.test(doc), 'release evidence missing stage row: ' + stage);
}

for (const token of ['16A', '16B']) {
  assert(doc.includes('| ' + token + ' |') || doc.includes('| ' + token), 'release evidence missing sub-stage row: ' + token);
}

for (const hash of ['24418f4', '23aae58', 'e5adbb8', '69ecdc5', '8e80bd7', '8a53255', '904b02a']) {
  assert(doc.includes(hash), 'release evidence missing known commit hash: ' + hash);
}

for (const token of [
  'metric tiles',
  'page hero',
  'surfaces',
  'list rows',
  'status/progress',
  'alert/severity',
  'actions',
  'forms',
  'cards/empty states',
  'Co jest aktywne',
  'Co jest legacy',
  'Jak zmienic globalnie',
  'Jak zmienic kolor kosza',
  'Jak zmienic kolor bledu',
  'Jak zmienic kolor statusu',
  'Jak zmienic wyglad kafelka',
  'Jak zmienic page hero',
  'Jak zmienic card surface',
  'Checki, ktore przechodza',
  'Pozostale swiadome wyjatki',
]) {
  assert(doc.includes(token), 'release evidence missing required section/token: ' + token);
}

for (const pathToken of [
  'src/components/StatShortcutCard.tsx',
  'src/styles/closeflow-metric-tiles.css',
  'src/styles/closeflow-page-header.css',
  'src/styles/closeflow-surface-tokens.css',
  'src/styles/closeflow-list-row-tokens.css',
  'src/styles/closeflow-alert-severity.css',
  'src/components/entity-actions.tsx',
  'src/styles/closeflow-action-tokens.css',
  'src/styles/closeflow-action-clusters.css',
  'src/styles/closeflow-form-actions.css',
  'src/styles/closeflow-card-readability.css',
  'src/styles/closeflow-entity-type-tokens.css',
]) {
  assert(doc.includes(pathToken), 'release evidence missing source truth path: ' + pathToken);
}

for (const command of [
  'check:closeflow-ui-cleanup-release-evidence',
  'check:closeflow-metric-visual-parity-contract',
  'check:closeflow-visual-qa-stage16b',
  'check:closeflow-dashboard-calendar-color-contract',
  'check:closeflow-final-active-ui-contract-audit',
  'check:closeflow-detail-action-visual-qa',
  'check:closeflow-mobile-parity-contract',
  'audit:closeflow-ui-map',
  'audit:closeflow-style-map',
  'check:closeflow-danger-style-contract',
  'check:polish-mojibake',
]) {
  assert(doc.includes(command), 'release evidence missing check command: ' + command);
}

for (const debt of ['/tasks', '/cases', 'Today.tsx', 'PRZYSZLY_DEBT', 'LEGACY_INACTIVE', 'DO_POTWIERDZENIA_SCREENSHOTEM']) {
  assert(doc.includes(debt), 'release evidence missing exception/debt token: ' + debt);
}

assert(app.includes("import('./pages/TodayStable')"), 'App.tsx must route active Today to TodayStable');
assert(doc.includes('src/pages/Today.tsx') && doc.includes('legacy inactive'), 'document must mark Today.tsx as legacy inactive');

const sourceTruthChecks = [
  [files.metricCss, 'CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A'],
  [files.pageHeaderCss, 'CLOSEFLOW_PAGE_HEADER_CONTRACT'],
  [files.surfaceCss, '--cf-surface-card'],
  [files.listRowCss, '.cf-status-pill'],
  [files.alertCss, '.cf-alert-error'],
  [files.actionCss, '.cf-entity-action-danger'],
  [files.actionClusterCss, '.cf-danger-action-zone'],
  [files.formCss, '.cf-form-actions'],
  [files.cardCss, 'CLOSEFLOW_CARD_READABILITY_CONTRACT'],
  [files.entityTypeCss, 'CLOSEFLOW_ENTITY_TYPE_COLOR_CONTRACT_STAGE17'],
];

for (const [rel, needle] of sourceTruthChecks) {
  assert(read(rel).includes(needle), rel + ' missing source truth token: ' + needle);
}

console.log('CLOSEFLOW_UI_CLEANUP_RELEASE_EVIDENCE_OK: UI cleanup release evidence is complete');
