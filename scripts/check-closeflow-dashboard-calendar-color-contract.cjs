const fs = require('fs');
const path = require('path');

const root = process.cwd();

const files = {
  dashboard: 'src/pages/Dashboard.tsx',
  calendar: 'src/pages/Calendar.tsx',
  indexCss: 'src/index.css',
  actionCss: 'src/styles/closeflow-action-tokens.css',
  entityCss: 'src/styles/closeflow-entity-type-tokens.css',
  doc: 'docs/ui/CLOSEFLOW_DASHBOARD_CALENDAR_COLOR_STAGE17_2026-05-08.md',
  script: 'scripts/check-closeflow-dashboard-calendar-color-contract.cjs',
  packageJson: 'package.json',
};

const marker = 'CLOSEFLOW_DASHBOARD_CALENDAR_COLOR_STAGE17_2026_05_08';
const commandName = 'check:closeflow-dashboard-calendar-color-contract';
const commandValue = 'node scripts/check-closeflow-dashboard-calendar-color-contract.cjs';

function fail(message) {
  console.error('[closeflow-dashboard-calendar-color-contract] FAIL: ' + message);
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
  assert(!(bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), rel + ' must be UTF-8 without BOM');
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
  assertNoBom(rel);
  const text = read(rel);
  assertNoControl(rel, text);
  assertNoMojibake(rel, text);
}

const dashboard = read(files.dashboard);
const calendar = read(files.calendar);
const indexCss = read(files.indexCss);
const actionCss = read(files.actionCss);
const entityCss = read(files.entityCss);
const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson));

assert(doc.includes(marker), 'Stage17 document missing marker');
assert(script.includes(marker), 'Stage17 check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

assert(dashboard.includes('cf-session-action-danger'), 'Dashboard logout must use cf-session-action-danger');
assert(dashboard.includes('data-cf-session-action="logout"'), 'Dashboard logout must expose data-cf-session-action="logout"');
for (const token of ['text-red-500', 'hover:text-red-600', 'hover:bg-red-50']) {
  assert(!dashboard.includes(token), 'Dashboard logout local Tailwind color remains: ' + token);
}
assert(!dashboard.includes('cf-entity-action-danger') || !dashboard.includes('data-cf-session-action="logout"'), 'Logout must not use entity action danger class');

assert(actionCss.includes('CLOSEFLOW_SESSION_ACTION_COLOR_CONTRACT_STAGE17'), 'action token CSS missing session action Stage17 marker');
assert(actionCss.includes('.cf-session-action-danger'), 'action token CSS missing cf-session-action-danger class');
assert(!actionCss.includes('EntityActionButton'), 'session action CSS must not claim EntityActionButton usage');

assert(calendar.includes('function getCalendarEntryTypeValue(entry: ScheduleEntry)'), 'Calendar missing entity type value helper');
assert(calendar.includes("return 'cf-entity-type-pill'"), 'Calendar type class must return cf-entity-type-pill');
assert(calendar.includes('data-cf-entity-type={getCalendarEntryTypeValue(entry)}'), 'Calendar type pill must expose data-cf-entity-type');
assert(!calendar.includes("return 'border-amber-100 bg-amber-50 text-amber-700'"), 'Calendar Lead type still returns local amber Tailwind classes');
assert(!calendar.includes('cf-alert-error'), 'Calendar entity type must not use cf-alert-error');

assert(entityCss.includes('CLOSEFLOW_ENTITY_TYPE_COLOR_CONTRACT_STAGE17'), 'entity type CSS missing Stage17 marker');
assert(entityCss.includes('.cf-entity-type-pill'), 'entity type CSS missing base pill class');
for (const type of ['event', 'task', 'lead']) {
  assert(entityCss.includes('data-cf-entity-type="' + type + '"'), 'entity type CSS missing selector for ' + type);
}
assert(entityCss.includes('--cf-entity-type-lead-bg'), 'entity type CSS missing lead token');
assert(!entityCss.includes('cf-alert-error'), 'entity type CSS must not reference alert error');

assert(indexCss.includes("@import './styles/closeflow-action-tokens.css';"), 'index.css must import action token CSS');
assert(indexCss.includes("@import './styles/closeflow-entity-type-tokens.css';"), 'index.css must import entity type token CSS');

for (const token of [
  'Dashboard logout',
  'Calendar entity type',
  'session action',
  'entity type',
  'nie jest delete',
  'nie jest severity',
]) {
  assert(doc.toLowerCase().includes(token.toLowerCase()), 'Stage17 document missing explanation token: ' + token);
}

console.log('CLOSEFLOW_DASHBOARD_CALENDAR_COLOR_STAGE17_OK: logout and entity type colors are semantic tokens');
