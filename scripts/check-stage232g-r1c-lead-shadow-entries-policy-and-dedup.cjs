#!/usr/bin/env node
/* STAGE232G_R1C lead shadow entry policy/dedup guard. */
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = process.cwd();
const errors = [];
const stage = 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP';
function rel(p) { return path.join(root, p); }
function read(p) { return fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), 'utf8') : ''; }
function exists(p) { return fs.existsSync(rel(p)); }
function expect(ok, msg) { if (!ok) errors.push(msg); }

const policy = 'src/lib/calendar-lead-shadow-entry-policy.ts';
const scheduling = 'src/lib/scheduling.ts';
const cfRuntimeGuard = 'scripts/check-cf-runtime-00-source-truth.cjs';
const report = '_project/runs/STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md';
const payload = '_project/obsidian_updates/2026-06-23_STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md';

for (const file of [policy, scheduling, cfRuntimeGuard, report, payload]) {
  expect(exists(file), `missing required file: ${file}`);
}

const policyText = read(policy);
const schedulingText = read(scheduling);
const cfGuardText = read(cfRuntimeGuard);

expect(policyText.includes(stage), 'policy module missing R1C marker');
expect(policyText.includes('applyLeadShadowEntryPolicy'), 'policy module missing apply function');
expect(policyText.includes('decideLeadShadowEntry'), 'policy module missing decision helper');
expect(policyText.includes('duplicate_lead_shadow'), 'policy module missing duplicate decision');
expect(policyText.includes('covered_by_task_or_event'), 'policy module missing task/event cover decision');
expect(policyText.includes("'edit'") && policyText.includes("'shift'") && policyText.includes("'open-related'"), 'lead allowed actions must include edit/shift/open-related');
expect(!/LEAD_ALLOWED_ACTIONS[\s\S]{0,220}(complete|restore|delete)/.test(policyText), 'lead allowed action set must not contain complete/restore/delete');

expect(schedulingText.includes("calendar-lead-shadow-entry-policy"), 'scheduling must import lead shadow policy');
expect(schedulingText.includes('applyLeadShadowEntryPolicy'), 'scheduling must apply lead shadow policy');
expect(schedulingText.includes(stage), 'scheduling must contain R1C marker');
expect(/function\s+removeLeadShadowEntries\s*\(|(?:const|let)\s+removeLeadShadowEntries\s*=/.test(schedulingText), 'scheduling must still expose removeLeadShadowEntries function');

expect(cfGuardText.includes('STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_ALLOWLIST'), 'CF runtime guard missing R1C allowlist marker');
for (const file of [policy, scheduling, report, payload, 'scripts/check-stage232g-r1c-lead-shadow-entries-policy-and-dedup.cjs', 'tests/stage232g-r1c-lead-shadow-entries-policy-and-dedup.test.cjs']) {
  expect(cfGuardText.includes(file), `CF runtime guard missing R1C allowlist file: ${file}`);
}

const central = [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_00_START'],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_QUEUE'],
  ['_project/CODEX_CONTEXT_INDEX.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_CODEX'],
  ['_project/06_GUARDS_AND_TESTS.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_GUARDS'],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_TESTS'],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_RISKS'],
];
for (const [file, marker] of central) {
  expect(read(file).includes(marker), `central file missing marker: ${file} / ${marker}`);
}

try {
  const changed = cp.execSync('git diff --name-only', { cwd: root, encoding: 'utf8' }).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const forbidden = new Set([
    'src/pages/Calendar.tsx',
    'src/pages/TodayStable.tsx',
    'api/work-items.ts',
  ]);
  for (const file of changed) {
    if (forbidden.has(file)) errors.push(`forbidden file changed in R1C: ${file}`);
  }
  const allowed = new Set([
    policy,
    scheduling,
    cfRuntimeGuard,
    report,
    payload,
    'scripts/check-stage232g-r1c-lead-shadow-entries-policy-and-dedup.cjs',
    'tests/stage232g-r1c-lead-shadow-entries-policy-and-dedup.test.cjs',
    '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
    '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
    '_project/CODEX_CONTEXT_INDEX.md',
    '_project/06_GUARDS_AND_TESTS.md',
    '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
    '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  ]);
  for (const file of changed) {
    if (!allowed.has(file)) errors.push(`out-of-scope changed file for R1C: ${file}`);
  }
} catch (error) {
  errors.push(`could not read changed files: ${error.message}`);
}

if (errors.length) {
  for (const error of errors) console.error(`STAGE232G_R1C_GUARD_FAIL: ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({
  stage,
  ok: true,
  scope: 'lead shadow entry policy and deduplication in scheduling',
  runtimeTouched: 'scheduling + pure lead shadow policy module only',
  nextRecommended: 'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT'
}, null, 2));
