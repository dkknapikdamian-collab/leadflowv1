#!/usr/bin/env node
/* STAGE232G_R1B Today uses operational entry contract guard. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = process.cwd();
const errors = [];
const stage = 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT';
function rel(p) { return path.join(root, p); }
function read(p) { return fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), 'utf8') : ''; }
function exists(p) { return fs.existsSync(rel(p)); }
function expect(ok, msg) { if (!ok) errors.push(msg); }

const today = 'src/pages/TodayStable.tsx';
const adapter = 'src/lib/calendar-operational-entry-today-adapter.ts';
const contract = 'src/lib/calendar-operational-entry-contract.ts';
const cfRuntimeGuard = 'scripts/check-cf-runtime-00-source-truth.cjs';
const report = '_project/runs/STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md';
const payload = '_project/obsidian_updates/2026-06-23_STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md';

for (const file of [today, adapter, contract, cfRuntimeGuard, report, payload]) {
  expect(exists(file), `missing required file: ${file}`);
}

const todayText = read(today);
const adapterText = read(adapter);
const cfGuardText = read(cfRuntimeGuard);

expect(adapterText.includes(stage), 'adapter missing R1B stage marker');
expect(adapterText.includes('getTodayTaskMomentRaw'), 'adapter missing task moment wrapper');
expect(adapterText.includes('getTodayEventMomentRaw'), 'adapter missing event moment wrapper');
expect(adapterText.includes('getTodayLeadMomentRaw'), 'adapter missing lead moment wrapper');
expect(adapterText.includes('getTodayOperationalDayKey'), 'adapter missing day key wrapper');
expect(adapterText.includes("from './calendar-operational-entry-contract'"), 'adapter must use R1A contract');

expect(todayText.includes(stage), 'TodayStable missing R1B marker');
expect(todayText.includes('calendar-operational-entry-today-adapter'), 'TodayStable must import R1B adapter');
expect(todayText.includes('getTodayTaskMomentRaw'), 'TodayStable missing getTodayTaskMomentRaw usage');
expect(todayText.includes('getTodayEventMomentRaw'), 'TodayStable missing getTodayEventMomentRaw usage');
expect(todayText.includes('getTodayLeadMomentRaw'), 'TodayStable missing getTodayLeadMomentRaw usage');
expect(todayText.includes('getTodayOperationalDayKey'), 'TodayStable missing getTodayOperationalDayKey usage');

const wrapperExpectations = [
  ['getTaskMomentRaw', 'getTodayTaskMomentRaw'],
  ['getEventMomentRaw', 'getTodayEventMomentRaw'],
  ['getLeadMomentRaw', 'getTodayLeadMomentRaw'],
  ['getDateKey', 'getTodayOperationalDayKey'],
];
for (const [fnName, wrapperName] of wrapperExpectations) {
  const fnIndex = todayText.indexOf(fnName);
  expect(fnIndex >= 0, `TodayStable missing function reference: ${fnName}`);
  const window = fnIndex >= 0 ? todayText.slice(fnIndex, fnIndex + 900) : '';
  expect(window.includes(wrapperName), `${fnName} must delegate to ${wrapperName}`);
}

for (const forbidden of ['src/pages/Calendar.tsx', 'api/work-items.ts']) {
  try {
    const changed = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
    if (changed.includes(forbidden)) errors.push(`forbidden file changed in R1B: ${forbidden}`);
  } catch (error) {
    errors.push(`could not read git diff for forbidden files: ${error.message}`);
  }
}

expect(cfGuardText.includes('STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_ALLOWLIST'), 'CF runtime guard missing R1B allowlist marker');
for (const file of [today, adapter, report, payload, 'scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs', 'tests/stage232g-r1b-today-uses-operational-entry-contract.test.cjs']) {
  expect(cfGuardText.includes(file), `CF runtime guard missing R1B allowlist file: ${file}`);
}

const central = [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_00_START'],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_QUEUE'],
  ['_project/CODEX_CONTEXT_INDEX.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_CODEX'],
  ['_project/06_GUARDS_AND_TESTS.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_GUARDS'],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_TESTS'],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_RISKS'],
];
for (const [file, marker] of central) {
  expect(read(file).includes(marker), `central file missing marker: ${file} / ${marker}`);
}

try {
  const changed = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' }).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const allowed = new Set([
    today,
    adapter,
    cfRuntimeGuard,
    report,
    payload,
    'scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs',
    'tests/stage232g-r1b-today-uses-operational-entry-contract.test.cjs',
    '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
    '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
    '_project/CODEX_CONTEXT_INDEX.md',
    '_project/06_GUARDS_AND_TESTS.md',
    '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
    '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  ]);
  for (const file of changed) {
    if (!allowed.has(file)) errors.push(`out-of-scope changed file for R1B: ${file}`);
  }
} catch (error) {
  errors.push(`could not read changed files: ${error.message}`);
}

if (errors.length) {
  for (const error of errors) console.error(`STAGE232G_R1B_GUARD_FAIL: ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  stage,
  ok: true,
  scope: 'TodayStable uses shared operational entry contract wrappers',
  runtimeTouched: 'TodayStable + today adapter only',
  nextRecommended: 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP'
}, null, 2));
