#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(rel){ return fs.readFileSync(path.join(repoRoot, rel), 'utf8'); }
function expect(condition, message){ if(!condition) errors.push(message); else console.log('PASS: ' + message); }
function blockBetween(content, startNeedle, endNeedle){
  const start = content.indexOf(startNeedle);
  const end = content.indexOf(endNeedle, start);
  if(start === -1 || end === -1) return '';
  return content.slice(start, end);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
const financeSource = read('src/lib/finance/case-finance-source.ts');
const handlePayment = blockBetween(caseDetail, 'async function handleSaveCaseFinancePayment()', 'function openPaymentCorrectionModalStage220A27');
const correction = blockBetween(caseDetail, 'async function handleSavePaymentCorrectionStage220A27()', 'const [caseSettlementSaving');

expect(caseDetail.includes('STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH'), 'CaseDetail has STAGE232K_R2 marker');
expect(caseDetail.includes('function normalizeCaseFinancePaymentTypeStage232K_R2'), 'CaseDetail normalizes payment type for finance write');
expect(caseDetail.includes('function normalizeCaseFinancePaymentStatusStage232K_R2'), 'CaseDetail normalizes payment status for finance write');
expect(handlePayment.includes('financePaymentForm.type'), 'handleSaveCaseFinancePayment reads financePaymentForm.type');
expect(handlePayment.includes('financePaymentForm.status'), 'handleSaveCaseFinancePayment reads financePaymentForm.status');
expect(handlePayment.includes('type: paymentType'), 'handleSaveCaseFinancePayment writes selected paymentType');
expect(handlePayment.includes('status: paymentStatus'), 'handleSaveCaseFinancePayment writes selected paymentStatus');
expect(!handlePayment.includes("type: 'payment'"), 'handleSaveCaseFinancePayment no longer hardcodes type=payment');
expect(!handlePayment.includes("status: 'fully_paid'"), 'handleSaveCaseFinancePayment no longer hardcodes status=fully_paid');
expect(handlePayment.includes('setPayments((previous) => [localPayment, ...previous])'), 'handleSaveCaseFinancePayment updates payments local state');
expect(handlePayment.includes('setCasePayments((previous) => [localPayment, ...previous]'), 'handleSaveCaseFinancePayment updates casePayments local state');
expect(handlePayment.includes('await reloadCaseFinanceData(caseData)'), 'handleSaveCaseFinancePayment reloads case finance data after write');
expect(handlePayment.includes('Dodano wpłatę prowizji'), 'handleSaveCaseFinancePayment has commission success/copy path');
expect(correction.includes('normalizeCaseFinancePaymentTypeStage232K_R2(paymentCorrectionTargetStage220A27.type'), 'payment correction preserves original payment type');
expect(!correction.includes("const paymentType = 'payment'"), 'payment correction no longer rewrites type to payment');
expect(correction.includes('type: paymentType'), 'payment correction writes preserved paymentType');
expect(caseDetail.includes('Pozostało prowizji do zapłaty'), 'case right rail has precise remaining commission label');
expect(financeSource.includes('function getClientCasesFinanceSummary'), 'client finance summary exists');
expect(financeSource.includes('commissionPaidAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionPaidAmount, 0))'), 'client finance summary aggregates commissionPaidAmount');
expect(financeSource.includes("paymentType(payment) === 'commission' && isPaidLike(payment)"), 'case finance source counts only paid commission payments');

const allowlistRequired = [
  'src/pages/CaseDetail.tsx',
  'src/lib/finance/case-finance-source.ts',
  'scripts/check-stage232k-r2-commission-payment-write-and-client-refresh.cjs',
  'tests/stage232k-r2-commission-payment-write-and-client-refresh.test.cjs',
  '_project/runs/STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
];
for (const item of allowlistRequired) expect(cfRuntime.includes(item), 'CF-RUNTIME allowlist contains ' + item);

const forbiddenScope = ['sql/', 'supabase/', 'MissingItemsManagerDialog', 'owner-control', 'Google Calendar', 'Billing'];
const changed = new Set([
  ...cp.execSync('git diff --name-only', { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/),
  ...cp.execSync('git diff --name-only --cached', { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/),
  ...cp.execSync('git ls-files --others --exclude-standard', { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/),
].map((x) => x.trim()).filter(Boolean));
for (const f of [...changed]) {
  expect(!/migrations|\.sql$/i.test(f), 'no SQL scope change: ' + f);
  expect(!f.includes('MissingItemsManagerDialog'), 'no MissingItemsManagerDialog scope change: ' + f);
  expect(!f.includes('owner-control'), 'no Owner Control scope change: ' + f);
  expect(!f.includes('Billing'), 'no billing scope change: ' + f);
}

if(errors.length){
  console.error('STAGE232K_R2 guard failed:');
  for(const e of errors) console.error('- ' + e);
  process.exit(1);
}
console.log('STAGE232K_R2 guard passed.');
