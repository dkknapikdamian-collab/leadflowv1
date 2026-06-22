const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const between = (text, start, end) => {
  const s = text.indexOf(start);
  const e = text.indexOf(end, s);
  assert.notEqual(s, -1, 'missing start: ' + start);
  assert.notEqual(e, -1, 'missing end: ' + end);
  return text.slice(s, e);
};

test('commission payment write uses selected type and status, not hardcoded payment', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  const handle = between(caseDetail, 'async function handleSaveCaseFinancePayment()', 'function openPaymentCorrectionModalStage220A27');
  assert.ok(handle.includes('const paymentType = normalizeCaseFinancePaymentTypeStage232K_R2(financePaymentForm.type)'));
  assert.ok(handle.includes('const paymentStatus = normalizeCaseFinancePaymentStatusStage232K_R2(financePaymentForm.status)'));
  assert.ok(handle.includes('type: paymentType'));
  assert.ok(handle.includes('status: paymentStatus'));
  assert.doesNotMatch(handle, /type:\s*['"]payment['"]/);
  assert.doesNotMatch(handle, /status:\s*['"]fully_paid['"]/);
});

test('commission payment write updates local case state and reloads finance data', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  const handle = between(caseDetail, 'async function handleSaveCaseFinancePayment()', 'function openPaymentCorrectionModalStage220A27');
  assert.ok(handle.includes('setPayments((previous) => [localPayment, ...previous])'));
  assert.ok(handle.includes('setCasePayments((previous) => [localPayment, ...previous]'));
  assert.ok(handle.includes('await reloadCaseFinanceData(caseData)'));
  assert.ok(handle.includes("paymentType === 'commission' ? 'Dodano wpłatę prowizji'"));
});

test('payment correction preserves commission type', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  const correction = between(caseDetail, 'async function handleSavePaymentCorrectionStage220A27()', 'const [caseSettlementSaving');
  assert.ok(correction.includes('normalizeCaseFinancePaymentTypeStage232K_R2(paymentCorrectionTargetStage220A27.type'));
  assert.ok(correction.includes('type: paymentType'));
  assert.doesNotMatch(correction, /const paymentType\s*=\s*['"]payment['"]/);
});

test('case and client finance summaries can show paid commission', () => {
  const source = read('src/lib/finance/case-finance-source.ts');
  assert.ok(source.includes("paymentType(payment) === 'commission' && isPaidLike(payment)"));
  assert.ok(source.includes('commissionPaidAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionPaidAmount, 0))'));
});

test('right rail label names remaining commission precisely', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  assert.ok(caseDetail.includes('Pozostało prowizji do zapłaty'));
});

test('CF runtime allowlist includes R2 scope', () => {
  const guard = read('scripts/check-cf-runtime-00-source-truth.cjs');
  for (const required of [
    'scripts/check-stage232k-r2-commission-payment-write-and-client-refresh.cjs',
    'tests/stage232k-r2-commission-payment-write-and-client-refresh.test.cjs',
    '_project/runs/STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
    '_project/obsidian_updates/2026-06-22_STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
  ]) {
    assert.equal(guard.includes(required), true, required);
  }
});
