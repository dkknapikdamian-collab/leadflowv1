const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('CF runtime allowlist includes STAGE232K R1/R1D touched files', () => {
  const cfRuntime = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');
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
  for (const item of required) assert.equal(cfRuntime.includes(item), true, item);
});
