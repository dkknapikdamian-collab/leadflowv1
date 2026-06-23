#!/usr/bin/env node
/* STAGE232G_R0 actual calendar operational source truth audit guard.
 * Scope: docs/report completeness + R0 conclusion + no runtime diff.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = process.cwd();
const reportRel = '_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md';
const payloadRel = '_project/obsidian_updates/2026-06-22_STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md';
const reportPath = path.join(root, reportRel);
const payloadPath = path.join(root, payloadRel);

function fail(message) {
  console.error(`STAGE232G_R0_GUARD_FAIL: ${message}`);
  process.exitCode = 1;
}

function read(rel) {
  const full = path.join(root, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function requireText(content, needle, label) {
  if (!content.includes(needle)) fail(`${label} missing text: ${needle}`);
}

if (!fs.existsSync(reportPath)) {
  fail(`missing report: ${reportRel}`);
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
    'RUNTIME_TOUCHED',
    'RISK_AUDIT_AFTER_R0',
    'NASTĘPNY_KROK'
  ];

  for (const section of requiredSections) requireText(report, section, reportRel);

  const actionLabels = ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Przywróć', 'Usuń'];
  for (const action of actionLabels) requireText(report, action, 'ACTION_FIELD_MATRIX');

  const fieldLabels = ['scheduledAt', 'dueAt', 'date', 'time', 'leadId', 'caseId', 'clientId'];
  for (const field of fieldLabels) requireText(report, field, 'ACTION_FIELD_MATRIX');

  const conclusionChecks = [
    'Status: R0_AUDIT_COMPLETED / REVIEW_REQUIRED / RUNTIME_NOT_TOUCHED',
    'STATUS_PRECONDITION_RESULT: PARTIAL_BUT_R0_ALLOWED_DOCS_ONLY',
    'LEAD_SHADOW_ENTRY_STATUS: PARTIAL',
    'TODAY_CALENDAR_PARITY_STATUS: PARTIAL',
    'CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL',
    'GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS: PASS_WITH_RUNTIME_RISK',
    'R1_RECOMMENDATION: STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX',
    'RUNTIME_TOUCHED: NIE',
    'R1 runtime fix dopiero po pelnym R0'
  ];
  for (const check of conclusionChecks) requireText(report, check, reportRel);

  const forbiddenTemplateMarkers = [
    'Status: DO_WYPELNIENIA',
    '| DO_WYPELNIENIA',
    'CALENDAR_SOURCE_TRUTH_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA',
    'LEAD_SHADOW_ENTRY_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA',
    'TODAY_CALENDAR_PARITY_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA'
  ];
  for (const marker of forbiddenTemplateMarkers) {
    if (report.includes(marker)) fail(`report still contains template marker: ${marker}`);
  }

  const forbiddenTopics = [
    'SQL / RLS',
    'finanse / prowizje',
    'Owner Control runtime',
    'Google Calendar OAuth'
  ];
  for (const topic of forbiddenTopics) requireText(report, topic, 'ZAKAZY_ZAKRESU_R0');
}

if (!fs.existsSync(payloadPath)) {
  fail(`missing obsidian payload: ${payloadRel}`);
} else {
  const payload = fs.readFileSync(payloadPath, 'utf8');
  for (const needle of [
    'Status: R0_AUDIT_COMPLETED / REVIEW_REQUIRED / LOCAL_SYNC_PENDING',
    'CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL',
    'STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX',
    'LOCAL_SYNC_PENDING'
  ]) {
    requireText(payload, needle, payloadRel);
  }
}

const centralChecks = [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_00_START'],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_QUEUE'],
  ['_project/CODEX_CONTEXT_INDEX.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_CODEX'],
  ['_project/06_GUARDS_AND_TESTS.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_GUARDS'],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_TESTS'],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', 'STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_RISKS'],
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

if (process.exitCode) process.exit(process.exitCode);

console.log(JSON.stringify({
  stage: 'STAGE232G_R0_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_AUDIT',
  ok: true,
  scope: 'actual_audit_docs_guard_test_only',
  calendarSourceTruthStatus: 'PARTIAL',
  recommendedNext: 'STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX',
  runtimeTouched: false,
}, null, 2));
