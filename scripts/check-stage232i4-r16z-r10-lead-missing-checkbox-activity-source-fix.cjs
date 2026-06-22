#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function req(condition, label) {
  if (!condition) {
    errors.push({ type: 'required', label });
  }
}

function changedFiles() {
  let out = '';
  try {
    out = cp.execFileSync('git', ['status', '--porcelain'], { cwd: repoRoot, encoding: 'utf8' });
  } catch (_error) {
    return [];
  }

  return out
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const raw = line.slice(3).trim();
      if (raw.includes(' -> ')) return raw.split(' -> ').pop().trim();
      return raw;
    })
    .filter(Boolean);
}

const errors = [];

const allowedChangedFiles = new Set([
  'src/pages/LeadDetail.tsx',

  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',

  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',

  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',
  '_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',

  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',

  '_project/runs/STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md',
  '_project/runs/STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md',
  '_project/runs/STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
  '_project/runs/STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md',
  '_project/runs/STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  '_project/runs/STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  '_project/runs/STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',

  'scripts/check-cf-runtime-00-source-truth.cjs',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs',
  'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs',

  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  'tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs',
  'tests/stage232i4-r16z-r10-r3-guard-scope-status-sync.test.cjs'
]);

const leadDetail = read('src/pages/LeadDetail.tsx');
req(/STAGE232I4_R16Z_R10/.test(leadDetail), 'LeadDetail has STAGE232I4_R16Z_R10 marker');
req(/blocking_missing_item/.test(leadDetail), 'LeadDetail maps blocking_missing_item');
req(/missing_item/.test(leadDetail), 'LeadDetail maps missing_item');
req(/blocksProgress/.test(leadDetail), 'LeadDetail reads blocksProgress direct override');
req(/missing_item_state_updated/.test(leadDetail), 'LeadDetail writes neutral missing_item_state_updated activity');

const r10Test = read('tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs');
req(/direct task false beats stale activity fallback/.test(r10Test), 'R10 test protects direct false over stale activity');
req(/activity metadata keeps newest state and explicit false/.test(r10Test), 'R10 test protects newest activity metadata and explicit false');
req(/toggle writes neutral state activity/.test(r10Test), 'R10 test protects neutral state activity write');

const r10Run = read('_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md');
const r10Head = r10Run.split(/\r?\n/).slice(0, 120).join('\n');
req(/PASS_PUSHED|OWNER_SMOKE_OK|CLOSED/.test(r10Head), 'R10 run report head has closure markers');
req(!/(APPLY_LOCAL|SMOKE_PENDING|PUSH_PENDING)/.test(r10Head), 'R10 run report head no longer says pending');

const r10R3Run = read('_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md');
req(/OWNER_SMOKE_OK|PASS|CLOSED/.test(r10R3Run), 'R10_R3 run report exists and records closure/pass');

const codex = read('_project/CODEX_CONTEXT_INDEX.md');
req(/STAGE232I4_R16Z_R10/.test(codex), 'CODEX_CONTEXT_INDEX references R10');
req(/STAGE232K|OWNER_SMOKE_OK|CLOSED/.test(codex), 'CODEX_CONTEXT_INDEX references closure or next stage');

const cf = read('scripts/check-cf-runtime-00-source-truth.cjs');
req(/allowedChangePrefixes/.test(cf), 'CF-RUNTIME has active allowedChangePrefixes');
for (const must of [
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',
  'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs'
]) {
  req(cf.includes(must), 'CF-RUNTIME active scope contains: ' + must);
}

const r5 = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
req(!/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX_ALLOWLIST/.test(r5), 'R5 close guard has no dead R10 allowlist constant');

for (const file of changedFiles()) {
  req(allowedChangedFiles.has(file), 'change scope allowed: ' + file);
  req(!/\.sql$/i.test(file), 'no SQL touched: ' + file);
  req(!/(^|\/)migrations\//i.test(file), 'no migrations touched: ' + file);
  req(!/(^|\/)supabase\//i.test(file), 'no Supabase folder touched: ' + file);
  req(!/src\/pages\/ClientDetail\.tsx$/.test(file), 'ClientDetail runtime untouched');
  req(!/src\/pages\/CaseDetail\.tsx$/.test(file), 'CaseDetail runtime untouched');
  req(!/src\/pages\/Calendar\.tsx$/.test(file), 'Calendar runtime untouched');
  req(!/src\/pages\/Billing\.tsx$/.test(file), 'Billing runtime untouched');
  req(!/OwnerControl|owner-control|ownerControl/.test(file), 'Owner Control runtime untouched');
}

if (errors.length) {
  console.error(JSON.stringify({
    ok: false,
    stage: 'STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX',
    errors
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX',
  contract: 'Lead missing checkbox state uses direct task/payload blocker state before stale activity metadata, closure/status-sync scope is allowed, and forbidden runtime areas are untouched.'
}, null, 2));
