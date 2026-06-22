#!/usr/bin/env node
const fs = require('node:fs');
const cp = require('node:child_process');

const failures = [];
function read(p) { return fs.readFileSync(p, 'utf8'); }
function ok(name, condition) {
  if (!condition) {
    failures.push(name);
    console.error('FAIL:', name);
  } else {
    console.log('PASS:', name);
  }
}

const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
const required = [
  'STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR',
  'src/lib/finance/case-finance-source.ts',
  'src/components/finance/CaseFinanceEditorDialog.tsx',
  'src/components/finance/CaseSettlementPanel.tsx',
  'src/components/finance/PaymentList.tsx',
  'scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs',
  'tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs',
  'scripts/check-stage232k-r1d-cf-runtime-allowlist-repair.cjs',
  'tests/stage232k-r1d-cf-runtime-allowlist-repair.test.cjs',
  '_project/runs/STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS.md',
  '_project/runs/STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR.md',
];
for (const item of required) ok('CF-RUNTIME allowlist contains ' + item, cfRuntime.includes(item));

const changed = cp.execSync('git diff --name-only HEAD', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const forbidden = changed.filter((p) => /sql|supabase|MissingItemsManagerDialog|OwnerControl|owner-control|calendar|billing|trial/i.test(p));
ok('no forbidden scope changes', forbidden.length === 0);

if (failures.length) {
  console.error('STAGE232K_R1D guard failed:', failures.join('; '));
  process.exit(1);
}
console.log('STAGE232K_R1D guard passed.');
