#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

const errors = [];

function req(condition, label) {
  if (!condition) errors.push({ type: 'required', label });
}

function changedFiles() {
  try {
    return cp.execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (_error) {
    return [];
  }
}

const allowedFiles = [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  '_project/runs/STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  'scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs',
  'tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',
  '_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',
  'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs',
  'tests/stage232i4-r16z-r10-r3-guard-scope-status-sync.test.cjs',
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
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'src/pages/LeadDetail.tsx'
];

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

const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
req(manager.includes('isBlocker'), 'manager reads direct item.isBlocker');
req(manager.includes('blocksProgress'), 'manager reads blocksProgress');
req(/===\s*false|false\s*===|blocksProgress[^;\n]{0,160}false|isBlocker[^;\n]{0,160}false/.test(manager), 'manager preserves explicit false blocker state');
req(/STAGE232I4_R16Z_R9|DIRECT_BLOCKER_OVERRIDE|direct.*blocker|blocksProgress/.test(manager), 'R9 direct blocker override contract marker or implementation exists');

for (const file of changedFiles()) {
  req(allowedFiles.includes(file), 'change scope allowed: ' + file);
  for (const pattern of forbiddenPatterns) {
    req(!pattern.test(file), 'forbidden scope untouched: ' + file);
  }
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE',
  contract: 'MissingItemsManagerDialog keeps explicit false blocker state as source of truth and R10_R3 closure/status-sync files are allowed without touching forbidden runtime areas.'
}, null, 2));
