const fs = require('fs');

function fail(message) {
  console.error('STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT_GUARD: FAIL');
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
const pkg = JSON.parse(read('package.json'));

requireText(caseDetail, 'STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT', 'A27B R2 marker');
requireText(caseDetail, 'data-stage220a27b-payment-history-modal="true"', 'history modal');
requireText(caseDetail, 'data-stage220a27b-r2-payment-meta="true"', 'one-line meta marker');
requireText(caseDetail, 'case-payment-history-modal-stage220a27b__meta', 'one-line meta class');
requireText(caseDetail, 'Wybierz wpłatę do korekty · oryginał zostaje · korekta tworzy osobny wpis w historii.', 'one-line description');

requireText(caseCss, 'STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT', 'CSS marker');
requireText(caseCss, '[data-stage220a27b-payment-history-modal="true"].case-payment-history-modal-stage220a27b', 'strong modal selector');
requireText(caseCss, 'background: var(--cf-vst-surface-card-solid, #ffffff) !important;', 'light surface forced');
requireText(caseCss, '.case-payment-history-modal-stage220a27b__meta', 'meta chips CSS');
requireText(caseCss, 'color: var(--cf-vst-text-main, #334155) !important;', 'meta text visible');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a27b-r2-payment-history-modal-light.cjs', 'prebuild A27B R2 guard');

console.log('STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT_GUARD: OK');
