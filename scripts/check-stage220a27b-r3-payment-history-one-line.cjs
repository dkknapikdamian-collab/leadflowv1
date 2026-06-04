const fs = require('fs');

function fail(message) {
  console.error('STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const pkg = JSON.parse(read('package.json'));

requireText(caseDetail, 'STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE', 'R3 marker');
requireText(caseDetail, 'case-payment-history-modal-stage220a27b-r3-light', 'R3 modal class');
requireText(caseDetail, 'data-stage220a27b-r2-payment-meta="true"', 'payment meta still present');
requireText(caseDetail, '<span>Data: {formatDateTime(getCasePaymentDateStage220A27(payment), \'Bez daty\')}</span>', 'date chip');
requireText(caseDetail, '<span>Wartość: {formatMoney(signedAmount, payment.currency || caseFinanceSourceStage220A26.currency)}</span>', 'value chip');
forbidText(caseDetail, 'Status: {billingStatusLabel(payment.status)}', 'redundant paid status chip');

requireText(caseCss, 'STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE', 'CSS marker');
requireText(caseCss, 'grid-template-columns: minmax(0, 1fr) auto !important;', 'one-line row grid');
requireText(caseCss, 'flex-wrap: nowrap !important;', 'desktop no-wrap meta');
requireText(caseCss, 'display: none !important;', 'compact note hidden');
requireText(caseCss, 'background: #ffffff !important;', 'literal light surface');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a27b-r3-payment-history-one-line.cjs', 'prebuild R3 guard');

console.log('STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE_GUARD: OK');
