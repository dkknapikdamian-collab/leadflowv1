const fs = require('fs');

function fail(message) {
  console.error('STAGE220A27B_PAYMENT_HISTORY_MODAL_GUARD: FAIL');
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

requireText(caseDetail, 'STAGE220A27B_PAYMENT_HISTORY_MODAL', 'A27B marker');
requireText(caseDetail, 'isPaymentHistoryOpenStage220A27B', 'history modal state');
requireText(caseDetail, 'openPaymentCorrectionFromHistoryStage220A27B', 'history modal selection handler');
requireText(caseDetail, 'data-stage220a27b-open-payment-history-modal="true"', 'finance card correction action');
requireText(caseDetail, 'data-stage220a27b-payment-history-modal="true"', 'history modal');
requireText(caseDetail, 'data-stage220a27b-payment-history-context="case"', 'case context in modal');
requireText(caseDetail, 'data-stage220a27b-select-payment-correction="true"', 'select payment correction button');
forbidText(caseDetail, 'data-stage220a27-open-payment-correction="true"', 'old inline correction button');

requireText(caseCss, 'STAGE220A27B_PAYMENT_HISTORY_MODAL', 'A27B CSS marker');
requireText(caseCss, '.case-payment-history-modal-stage220a27b__row', 'history modal row CSS');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a27b-payment-history-modal.cjs', 'prebuild A27B guard');

console.log('STAGE220A27B_PAYMENT_HISTORY_MODAL_GUARD: OK');
