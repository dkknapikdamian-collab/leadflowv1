#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function req(condition, label) {
  if (!condition) errors.push({ type: 'required', label });
}

const errors = [];
const r10CoreFiles = [
  "src/pages/LeadDetail.tsx",
  "scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs",
  "tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs",
  "_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md"
];
const r10R3ClosureFiles = [
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md",
  "_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md",
  "_project/runs/STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md",
  "_project/runs/STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md",
  "_project/runs/STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md",
  "_project/runs/STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md",
  "_project/runs/STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md",
  "_project/runs/STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md",
  "_project/runs/STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md",
  "_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md",
  "_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md",
  "scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs",
  "tests/stage232i4-r16z-r10-r3-guard-scope-status-sync.test.cjs"
];

const cf = read('scripts/check-cf-runtime-00-source-truth.cjs');
const activeArrayMatch = cf.match(/const\s+allowedChangePrefixes\s*=\s*\[\s*([\s\S]*?)\n\];/m);
req(Boolean(activeArrayMatch), 'CF-RUNTIME active allowedChangePrefixes exists');
const activeArray = activeArrayMatch ? activeArrayMatch[1] : '';

for (const file of r10CoreFiles.concat(r10R3ClosureFiles)) {
  req(activeArray.includes("'" + file + "'") || activeArray.includes('"' + file + '"'), 'CF-RUNTIME active allowlist contains: ' + file);
}

const r5 = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
req(!/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX_ALLOWLIST/.test(r5), 'R5 close guard has no dead R10 allowlist constant');

const r10Run = read('_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md');
const r10RunHead = r10Run.split(/\r?\n/).slice(0, 140).join('\n');
req(/PASS_PUSHED/.test(r10RunHead), 'R10 run report head has PASS_PUSHED');
req(/CLOSED/.test(r10RunHead), 'R10 run report head has CLOSED');
req(/OWNER_SMOKE_OK/.test(r10RunHead), 'R10 run report head has OWNER_SMOKE_OK');
req(!/(APPLY_LOCAL|SMOKE_PENDING|PUSH_PENDING)/.test(r10RunHead), 'R10 run report head no longer has pending status');

const r10R3Run = read('_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md');
req(/OWNER_SMOKE_OK/.test(r10R3Run), 'R10_R3 run report records owner smoke ok');
req(/STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH/.test(r10R3Run), 'R10_R3 run report points next stage');

const codex = read('_project/CODEX_CONTEXT_INDEX.md');
req(/STAGE232I4_R16Z_R10/.test(codex), 'CODEX_CONTEXT_INDEX references R10');
req(/OWNER_SMOKE_OK|PASS_PUSHED|CLOSED/.test(codex), 'CODEX_CONTEXT_INDEX has closure status');
req(/STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH/.test(codex), 'CODEX_CONTEXT_INDEX points next stage');

const obsidianStartPath = path.resolve(repoRoot, '..', '00_OBSIDIAN_VAULT', '10_PROJEKTY', 'CloseFlow_Lead_App', '00_START - CloseFlow Lead App.md');
if (fs.existsSync(obsidianStartPath)) {
  const start = fs.readFileSync(obsidianStartPath, 'utf8');
  req(!/Najbliższy etap:\s*STAGE232I2/.test(start), 'Obsidian 00_START no longer points to STAGE232I2 as next');
  req(/STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH|STAGE232I4_R16Z_R10/.test(start), 'Obsidian 00_START references closure or next stage');
} else {
  console.warn('WARN: local Obsidian 00_START not found; checked repo payloads only.');
}

let changed = [];
try {
  changed = cp.execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (_error) {
  changed = [];
}

const forbiddenPatterns = [
  /\.sql$/i,
  /(^|\/)migrations\//i,
  /(^|\/)supabase\//i,
  /src\/pages\/ClientDetail\.tsx$/,
  /src\/pages\/CaseDetail\.tsx$/,
  /src\/pages\/Calendar\.tsx$/,
  /src\/pages\/Billing\.tsx$/,
  /OwnerControl|owner-control|ownerControl/
];

for (const file of changed) {
  for (const pattern of forbiddenPatterns) {
    req(!pattern.test(file), 'forbidden scope untouched: ' + file);
  }
}

if (errors.length) {
  console.error(JSON.stringify({
    ok: false,
    stage: 'STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE',
    errors
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE',
  contract: 'R10 is closed after owner smoke, active CF runtime allowlist contains closure scope, no dead R10 close-guard allowlist remains, and forbidden runtime areas were not touched.'
}, null, 2));
