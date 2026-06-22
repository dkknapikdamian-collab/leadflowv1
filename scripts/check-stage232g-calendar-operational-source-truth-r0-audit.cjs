#!/usr/bin/env node
/* STAGE232G_R0 calendar operational source truth audit guard.
 * Scope: docs/report completeness + no runtime diff.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = process.cwd();
const reportPath = path.join(root, '_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md');

function fail(message) {
  console.error(`STAGE232G_R0_GUARD_FAIL: ${message}`);
  process.exitCode = 1;
}

function read(rel) {
  const full = path.join(root, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

if (!fs.existsSync(reportPath)) {
  fail(`missing report: ${path.relative(root, reportPath)}`);
} else {
  const report = fs.readFileSync(reportPath, 'utf8');

  const requiredSections = [
    'STATUS_PRECONDITION',
    'ACTIVE_ROUTE_MAP',
    'CALENDAR_RENDER_FILES_MAP',
    'CALENDAR_DATA_MODEL_MAP',
    'LEAD_SHADOW_ENTRY_STATUS',
    'TODAY_CALENDAR_PARITY_STATUS',
    'ACTION_FIELD_MATRIX',
    'SELECTED_DAY_WEEK_MONTH_VERIFICATION',
    'LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND',
    'GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS',
    'CALENDAR_SOURCE_TRUTH_STATUS',
    'DO_POTWIERDZENIA',
    'ZAKAZY_ZAKRESU_R0',
    'R1_DECISION_GATE',
    'RUNTIME_TOUCHED'
  ];

  for (const section of requiredSections) {
    if (!report.includes(section)) fail(`report missing section: ${section}`);
  }

  const actionLabels = ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Przywróć', 'Usuń'];
  for (const action of actionLabels) {
    if (!report.includes(action)) fail(`ACTION_FIELD_MATRIX missing action: ${action}`);
  }

  const fieldLabels = ['scheduledAt', 'dueAt', 'date', 'time', 'leadId', 'caseId', 'clientId'];
  for (const field of fieldLabels) {
    if (!report.includes(field)) fail(`ACTION_FIELD_MATRIX missing field: ${field}`);
  }

  const forbiddenTopics = [
    'SQL / RLS',
    'finanse / prowizje',
    'Owner Control runtime',
    'Google Calendar OAuth'
  ];
  for (const topic of forbiddenTopics) {
    if (!report.includes(topic)) fail(`report missing forbidden scope note: ${topic}`);
  }
}

const centralChecks = [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', 'STAGE232G_R0 router/status precheck correction'],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT'],
  ['_project/CODEX_CONTEXT_INDEX.md', 'STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT'],
  ['_project/06_GUARDS_AND_TESTS.md', 'STAGE232G_R0 calendar audit guard'],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', 'STAGE232G_R0 calendar audit tests'],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', 'STAGE232G_R0 calendar source-truth risk audit'],
];

for (const [rel, needle] of centralChecks) {
  const content = read(rel);
  if (!content) fail(`missing central file: ${rel}`);
  if (!content.includes(needle)) fail(`central file missing marker/text: ${rel} -> ${needle}`);
}

const runtimePaths = [
  'src/pages/Calendar.tsx',
  'src/lib/scheduling.ts',
  'src/lib/calendar-items.ts',
  'src/pages/TodayStable.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
];

try {
  const diffNameOnly = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const rel of runtimePaths) {
    if (diffNameOnly.includes(rel)) fail(`R0 must not modify runtime file: ${rel}`);
  }
} catch (error) {
  fail(`could not inspect git diff: ${error.message}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(JSON.stringify({
  stage: 'STAGE232G_R0_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_AUDIT',
  ok: true,
  scope: 'docs_guard_test_only',
  runtimeTouched: false,
}, null, 2));
