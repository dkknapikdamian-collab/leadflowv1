const fs = require('fs');

function fail(message) {
  console.error('STAGE220A30C_HISTORY_MODAL_LEGACY_GUARD_TOKENS_HOTFIX: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(`${label} missing: ${needle}`);
}

const caseDetail = read('src/pages/CaseDetail.tsx');

requireText(caseDetail, 'STAGE220A30C_HISTORY_MODAL_LEGACY_GUARD_TOKENS_HOTFIX', 'A30C marker');
requireText(caseDetail, 'client-case-form-content case-payment-history-modal-stage220a27b', 'A28 history modal source token');
requireText(caseDetail, 'case-payment-history-modal-stage220a27b-r3-light', 'A27B R3 history modal token');
requireText(caseDetail, 'client-case-form-header case-payment-history-modal-stage220a28-header', 'A28 history header source token');
requireText(caseDetail, 'event-form-vnext-content closeflow-event-modal-readable', 'A30 readable modal token');
requireText(caseDetail, 'case-finance-source-modal-stage220a30--history', 'A30 history modal token');
requireText(caseDetail, 'case-payment-correction-modal-stage220a28-vst', 'A28 correction modal token preserved');

console.log('STAGE220A30C_HISTORY_MODAL_LEGACY_GUARD_TOKENS_HOTFIX: OK');