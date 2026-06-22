#!/usr/bin/env node
const fs = require('node:fs');
const cp = require('node:child_process');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

const failures = [];
function ok(name, cond) {
  if (!cond) {
    failures.push(name);
    console.error('FAIL:', name);
  } else {
    console.log('PASS:', name);
  }
}

const finance = read('src/lib/finance/case-finance-source.ts');
const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const panel = read('src/components/finance/CaseSettlementPanel.tsx');
const paymentList = read('src/components/finance/PaymentList.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');

ok('marker in finance source', finance.includes('STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS'));
ok('deriveCommissionStatus ignores manual explicit commissionStatus', !finance.includes("if (explicit !== 'not_set') return explicit"));
ok('paid status derives from commissionPaidAmount >= commissionAmount', /commissionPaidAmount\s*>=\s*commissionAmount[\s\S]*return 'paid'/.test(finance));
ok('partial status derives from commissionPaidAmount > 0', /commissionPaidAmount\s*>\s*0[\s\S]*return 'partially_paid'/.test(finance));
ok('commission paid amount filters only commission paid-like payments', /paymentType\(payment\)\s*===\s*'commission'\s*&&\s*isPaidLike\(payment\)/.test(finance));
ok('buildCaseFinancePatch does not persist manual commissionStatus input', !/commissionStatus:\s*normalizeCommissionStatus\(input\.commissionStatus\)/.test(finance));
ok('buildCaseFinancePatch neutralizes commissionStatus cache', /commissionStatus:\s*'not_set'/.test(finance));

ok('editor has readonly derived status', editor.includes('data-stage232k-r1-commission-status-readonly="true"'));
ok('editor has no manual paid/partially_paid select options', !/<option value="paid"|<option value="partially_paid"/.test(editor));
ok('editor does not save form.commissionStatus as paid truth', !/normalizeCommissionStatus\(form\.commissionStatus\)/.test(editor));
ok('editor has derived status copy', editor.includes('Status prowizji jest wyliczany automatycznie z wpłat prowizji.'));

ok('settlement panel creates commissionPayments filter', /const commissionPayments = useMemo/.test(panel) && /normalizePaymentType\(payment\.type\)\s*===\s*'commission'/.test(panel));
ok('commission list uses commissionPayments', /title="Lista wpłat prowizji"[\s\S]*payments={commissionPayments}/.test(panel));
ok('remaining label precise', panel.includes('Pozostało prowizji do zapłaty') && editor.includes('Pozostało prowizji do zapłaty'));
ok('PaymentList marker present', paymentList.includes('STAGE232K_R1_PAYMENT_LIST_RECEIVES_FILTERED_COMMISSION_PAYMENTS'));

const changed = cp.execSync('git diff --name-only HEAD', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);

const forbidden = changed.filter((p) => /sql|supabase|MissingItemsManagerDialog|OwnerControl|owner-control|calendar|billing|trial/i.test(p));
ok('no SQL/MissingItems/OwnerControl/Calendar/Billing scope changes', forbidden.length === 0);

const requiredRuntimeAllowlist = [
  'src/lib/finance/case-finance-source.ts',
  'src/components/finance/CaseFinanceEditorDialog.tsx',
  'src/components/finance/CaseSettlementPanel.tsx',
  'src/components/finance/PaymentList.tsx',
  'scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs',
  'tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs',
];
for (const file of requiredRuntimeAllowlist) {
  ok('CF-RUNTIME allowlist contains ' + file, cfRuntime.includes(file));
}

if (failures.length) {
  console.error('STAGE232K_R1 guard failed:', failures.join('; '));
  process.exit(1);
}
console.log('STAGE232K_R1 guard passed.');
