#!/usr/bin/env node
/* STAGE232G_R1A calendar/today operational entry contract guard. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = process.cwd();
const errors = [];
function rel(p) { return path.join(root, p); }
function read(p) { return fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), 'utf8') : ''; }
function exists(p) { return fs.existsSync(rel(p)); }
function expect(condition, message) { if (!condition) errors.push(message); }
function includes(file, text) { return read(file).includes(text); }

const stage = 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT';
const contractFile = 'src/lib/calendar-operational-entry-contract.ts';
const schedulingFile = 'src/lib/scheduling.ts';
const reportFile = '_project/runs/STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md';
const payloadFile = '_project/obsidian_updates/2026-06-23_STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md';
const cfRuntimeGuard = 'scripts/check-cf-runtime-00-source-truth.cjs';

for (const file of [contractFile, schedulingFile, reportFile, payloadFile, cfRuntimeGuard]) {
  expect(exists(file), `missing required R1A file: ${file}`);
}

const contract = read(contractFile);
expect(contract.includes(stage), 'contract missing stage marker');
expect(contract.includes("export type OperationalEntryKind = 'event' | 'task' | 'lead'"), 'contract missing OperationalEntryKind event/task/lead');
expect(contract.includes("export type OperationalEntryAction = 'edit' | 'shift' | 'complete' | 'restore' | 'delete' | 'open-related'"), 'contract missing OperationalEntryAction list');
expect(contract.includes('CalendarTodayOperationalEntryContract'), 'contract missing CalendarTodayOperationalEntryContract');
expect(contract.includes('getOperationalRecordMomentRaw'), 'contract missing getOperationalRecordMomentRaw');
expect(contract.includes('toOperationalDayKey'), 'contract missing toOperationalDayKey');
expect(contract.includes('buildCalendarTodayParityFingerprint'), 'contract missing parity fingerprint');
expect(contract.includes('buildOperationalEntryContract'), 'contract missing buildOperationalEntryContract');
expect(contract.includes("['edit', 'shift', 'open-related']"), 'lead actions must stay limited before R1C decision');

for (const needle of [
  "nextActionAt",
  "next_action_at",
  "followUpAt",
  "follow_up_at",
  "scheduledAt",
  "scheduled_at",
  "dueAt",
  "due_at",
  "startAt",
  "startsAt",
  "leadId",
  "caseId",
  "clientId"
]) {
  expect(contract.includes(needle), `contract missing field: ${needle}`);
}

const scheduling = read(schedulingFile);
expect(scheduling.includes("./calendar-operational-entry-contract"), 'scheduling.ts must export R1A contract');
expect(scheduling.includes('buildCalendarTodayParityFingerprint'), 'scheduling.ts missing parity export');
expect(scheduling.includes('CalendarTodayOperationalEntryContract'), 'scheduling.ts missing type export');

const report = read(reportFile);
for (const needle of [
  'Status: READY_TO_APPLY_ZIP / RUNTIME_CONTRACT_FOUNDATION / REVIEW_REQUIRED',
  'R0_RESULT: CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL',
  'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT',
  'WHAT_R1A_DOES_NOT_DO',
  'RISK_AUDIT_AFTER_R1A'
]) {
  expect(report.includes(needle), `run report missing: ${needle}`);
}

const payload = read(payloadFile);
for (const needle of [
  'Status: R1A_READY_TO_APPLY / LOCAL_SYNC_PENDING',
  'LOCAL_SYNC_PENDING',
  'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT'
]) {
  expect(payload.includes(needle), `payload missing: ${needle}`);
}

const cfGuard = read(cfRuntimeGuard);
expect(cfGuard.includes('STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_ALLOWLIST'), 'CF runtime guard missing R1A allowlist marker');
for (const file of [
  contractFile,
  schedulingFile,
  reportFile,
  payloadFile,
  'scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs',
  'tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs'
]) {
  expect(cfGuard.includes(file), `CF runtime guard allowlist missing: ${file}`);
}

const centralChecks = [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_00_START'],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_QUEUE'],
  ['_project/CODEX_CONTEXT_INDEX.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_CODEX'],
  ['_project/06_GUARDS_AND_TESTS.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_GUARDS'],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_TESTS'],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_RISKS'],
];
for (const [file, marker] of centralChecks) {
  expect(includes(file, marker), `central file missing marker: ${file} -> ${marker}`);
}

const allowedChangedFiles = new Set([
  contractFile,
  schedulingFile,
  cfRuntimeGuard,
  reportFile,
  payloadFile,
  'scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs',
  'tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs',
  '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
]);

try {
  const changed = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const file of changed) {
    if (!allowedChangedFiles.has(file)) {
      errors.push(`out-of-scope changed file for R1A: ${file}`);
    }
  }
} catch (error) {
  errors.push(`could not read git diff: ${error.message}`);
}

for (const forbidden of [
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  'src/lib/calendar-items.ts',
  'src/pages/LeadDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'supabase/',
  'migrations/'
]) {
  try {
    const changed = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' });
    if (changed.split(/\r?\n/).includes(forbidden)) errors.push(`forbidden runtime file changed in R1A: ${forbidden}`);
  } catch (_) {}
}

if (errors.length) {
  for (const error of errors) console.error(`STAGE232G_R1A_GUARD_FAIL: ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  stage,
  ok: true,
  scope: 'runtime_contract_foundation',
  runtimeTouched: 'src/lib/calendar-operational-entry-contract.ts + scheduling export only',
  nextRecommended: 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT'
}, null, 2));
