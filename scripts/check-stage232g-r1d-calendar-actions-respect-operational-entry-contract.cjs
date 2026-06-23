#!/usr/bin/env node
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const stage = 'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT';
const allowedDirty = new Set([
  '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'src/lib/calendar-operational-entry-action-policy.ts',
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md',
  '_project/runs/STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md',
  '_project/runs/STAGE232G_R1D_CALENDAR_ACTION_PATCH_CONTEXT.txt',
  'scripts/check-stage232g-r1d-calendar-actions-respect-operational-entry-contract.cjs',
  'tests/stage232g-r1d-calendar-actions-respect-operational-entry-contract.test.cjs',
]);
function fail(msg) { console.error(`${stage}_FAIL: ${msg}`); process.exitCode = 1; }
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''; }
function normalizeGitPath(line) { return line.replace(/^\s*[AMDRCU?! ]+\s+/, '').replace(/^"/, '').replace(/"$/, '').replace(/\\/g, '/'); }
for (const file of [
  'src/lib/calendar-operational-entry-action-policy.ts',
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  'scripts/check-stage232g-r1d-calendar-actions-respect-operational-entry-contract.cjs',
  'tests/stage232g-r1d-calendar-actions-respect-operational-entry-contract.test.cjs',
  '_project/runs/STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md',
]) if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
const policy = read('src/lib/calendar-operational-entry-action-policy.ts');
if (!policy.includes(stage)) fail('missing policy stage marker');
if (!policy.includes('getSupportedOperationalEntryActions')) fail('policy does not use R1A supported action contract');
if (!policy.includes('blocked_for_lead_shadow')) fail('policy does not protect lead shadow destructive actions');
const calendar = read('src/pages/Calendar.tsx');
const today = read('src/pages/TodayStable.tsx');
if (!calendar.includes('calendar-operational-entry-action-policy')) fail('Calendar.tsx does not import action policy');
if (!today.includes('calendar-operational-entry-action-policy')) fail('TodayStable.tsx does not import action policy');
for (const action of ['complete', 'delete', 'restore']) {
  const token = `STAGE232G_R1D_${action.toUpperCase()}_ACTION_CONTRACT_GUARD`;
  if (!calendar.includes(token) && !today.includes(token)) fail(`missing ${action} action guard in Calendar/Today`);
}
if (!calendar.includes('isOperationalEntryActionAllowed') && !today.includes('isOperationalEntryActionAllowed')) fail('Calendar/Today do not call isOperationalEntryActionAllowed');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
  for (const line of status) {
    const file = normalizeGitPath(line);
    if (!allowedDirty.has(file)) fail(`out-of-scope changed file: ${file}`);
  }
} catch (err) { fail(`could not inspect git status: ${err.message}`); }
if (!process.exitCode) console.log(JSON.stringify({ stage, ok: true, scope: 'Calendar/Today action policy guards', runtimeTouched: 'Calendar.tsx + TodayStable.tsx + pure action policy module only', nextRecommended: 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE' }, null, 2));
