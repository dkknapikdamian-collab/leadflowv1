const fs = require('fs');

function fail(message) {
  console.error('STAGE220A27A_PAYMENT_CORRECTION_HISTORY_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const financeSource = read('src/lib/finance/case-finance-source.ts');
const pkg = JSON.parse(read('package.json'));

requireText(caseDetail, 'STAGE220A27A_PAYMENT_CORRECTION_HISTORY', 'CaseDetail marker');
requireText(caseDetail, 'paymentCorrectionTargetStage220A27', 'correction state');
requireText(caseDetail, 'paymentCorrectionFormStage220A27', 'correction form state');
requireText(caseDetail, 'openPaymentCorrectionModalStage220A27', 'correction open handler');
requireText(caseDetail, 'handleSavePaymentCorrectionStage220A27', 'correction save handler');
requireText(caseDetail, "type: 'refund'", 'correction stored as refund');
requireText(caseDetail, "status: 'paid'", 'correction stored as paid');
requireText(caseDetail, 'paidAt: correctionPaidAt', 'correction has date');
requireText(caseDetail, 'amount,', 'correction has amount');
requireText(caseDetail, 'reason', 'correction has reason');
requireText(caseDetail, "eventType: 'payment_correction_added'", 'correction activity');
requireText(caseDetail, 'data-stage220a27-payment-history="true"', 'payment history UI');
requireText(caseDetail, 'data-stage220a27-payment-correction-modal="true"', 'correction modal');
requireText(caseDetail, 'data-stage220a27-payment-correction-amount="true"', 'correction amount input');
requireText(caseDetail, 'data-stage220a27-payment-correction-date="true"', 'correction date input');
requireText(caseDetail, 'data-stage220a27-payment-correction-reason="true"', 'correction reason input');

requireText(financeSource, "paymentType(payment) === 'refund'", 'refund subtracts from paid amount');
requireText(financeSource, '-amount', 'refund is negative in paid sum');
requireText(financeSource, 'refundAmount', 'refund amount summary exists');

requireText(caseCss, 'STAGE220A27A_PAYMENT_CORRECTION_HISTORY', 'correction CSS marker');
requireText(caseCss, '.case-finance-payment-history-stage220a27', 'payment history CSS');
requireText(caseCss, '.case-payment-correction-modal-stage220a27__summary', 'correction modal summary CSS');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a27a-payment-correction-history.cjs', 'prebuild A27A guard');

console.log('STAGE220A27A_PAYMENT_CORRECTION_HISTORY_GUARD: OK');
