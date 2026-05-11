#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = process.cwd();
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function has(rel, needle, label) { assert(read(rel).includes(needle), `${label} missing: ${needle}`); }

const audit = spawnSync(process.execPath, ['scripts/audit-closeflow-active-screen-layout-matrix.cjs'], {
  cwd: repo,
  stdio: 'inherit',
});
if (audit.status !== 0) fail('audit script failed');

const requiredFiles = [
  'src/App.tsx',
  'docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md',
  'docs/ui/closeflow-active-screen-layout-matrix.generated.json',
  'scripts/audit-closeflow-active-screen-layout-matrix.cjs',
  'scripts/check-closeflow-active-screen-layout-matrix.cjs',
  'package.json',
];
for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

const requiredScreens = [
  'TodayStable',
  'TasksStable',
  'Leads',
  'Clients',
  'Cases',
  'Calendar',
  'AiDrafts',
  'NotificationsCenter',
  'Templates',
  'Activity',
  'LeadDetail',
  'ClientDetail',
  'CaseDetail',
  'Billing',
  'Settings',
  'SupportCenter',
];

const requiredScreenFiles = [
  'src/pages/TodayStable.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Templates.tsx',
  'src/pages/Activity.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/Billing.tsx',
  'src/pages/Settings.tsx',
  'src/pages/SupportCenter.tsx',
];
for (const rel of requiredScreenFiles) assert(exists(rel), 'active screen file missing: ' + rel);

const app = read('src/App.tsx');
for (const screen of requiredScreens) {
  assert(app.includes(`./pages/${screen}`) || app.includes(`./pages/${screen.replace('Stable', '')}`), 'App.tsx missing lazy/import reference for screen: ' + screen);
}

const generated = JSON.parse(read('docs/ui/closeflow-active-screen-layout-matrix.generated.json'));
assert(generated.marker === 'CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4', 'generated JSON marker mismatch');
assert(generated.stage === 'VS-4', 'generated JSON stage mismatch');
assert(Array.isArray(generated.matrix), 'generated matrix is not an array');
assert(generated.matrix.length === requiredScreens.length, 'matrix screen count mismatch');

const allowedStatus = new Set(['OK', 'MIGRATE', 'LEGACY', 'OUT_OF_SCOPE']);
const requiredFields = [
  'route',
  'file',
  'pageShellSource',
  'pageHeroSource',
  'metricSource',
  'entityIconSource',
  'actionIconSource',
  'surfaceCardSource',
  'listRowSource',
  'actionClusterSource',
  'formFooterSource',
  'financeSource',
  'legacyCss',
  'temporaryOverrides',
  'status',
  'nextMigrationStage',
];

const byScreen = new Map(generated.matrix.map((row) => [row.screen, row]));
for (const screen of requiredScreens) {
  assert(byScreen.has(screen), 'matrix missing screen: ' + screen);
  const row = byScreen.get(screen);
  for (const field of requiredFields) {
    assert(Object.prototype.hasOwnProperty.call(row, field), `matrix row ${screen} missing field: ${field}`);
    assert(row[field] !== null && row[field] !== undefined && String(row[field]).length > 0, `matrix row ${screen} empty field: ${field}`);
  }
  assert(allowedStatus.has(row.status), `matrix row ${screen} has invalid status: ${row.status}`);
}

const doc = read('docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md');
for (const screen of requiredScreens) assert(doc.includes(screen) || doc.includes(byScreen.get(screen).file), 'docs missing screen/file: ' + screen);
for (const label of [
  'PageShell source',
  'PageHero source',
  'Metric source',
  'EntityIcon source',
  'ActionIcon source',
  'SurfaceCard source',
  'ListRow source',
  'ActionCluster source',
  'FormFooter source',
  'Finance source',
  'Legacy CSS',
  'Temporary overrides',
  'Next migration stage',
]) {
  assert(doc.includes(label), 'docs matrix missing column label: ' + label);
}
for (const status of ['OK', 'MIGRATE', 'LEGACY', 'OUT_OF_SCOPE']) assert(doc.includes('`' + status + '`'), 'docs missing status legend: ' + status);

has('scripts/audit-closeflow-active-screen-layout-matrix.cjs', 'SCREEN_TARGETS', 'audit screen target registry');
has('scripts/audit-closeflow-active-screen-layout-matrix.cjs', 'LEGACY_CSS_HINTS', 'audit legacy CSS mapping');
has('scripts/audit-closeflow-active-screen-layout-matrix.cjs', 'TEMPORARY_HINTS', 'audit temporary override mapping');

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['audit:closeflow-active-screen-layout-matrix'] === 'node scripts/audit-closeflow-active-screen-layout-matrix.cjs', 'package script audit:closeflow-active-screen-layout-matrix missing or wrong');
assert(pkg.scripts && pkg.scripts['check:closeflow-active-screen-layout-matrix'] === 'node scripts/check-closeflow-active-screen-layout-matrix.cjs', 'package script check:closeflow-active-screen-layout-matrix missing or wrong');

console.log('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_CHECK_OK');
console.log('screen_count=' + generated.matrix.length);
console.log('allowed_statuses=OK,MIGRATE,LEGACY,OUT_OF_SCOPE');
