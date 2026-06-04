const fs = require('fs');

function fail(message) {
  console.error('STAGE220A30B_FINANCE_MODAL_A26_GUARD_COMPAT: FAIL');
  console.error(message);
  process.exit(1);
}

const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const a26Guard = fs.readFileSync('scripts/check-stage220a26-case-finance-display-modal.cjs', 'utf8');

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(`${label} missing: ${needle}`);
}

requireText(a26Guard, "requireText(caseDetail, 'case-finance-modal-stage220a26-footer'", 'A26 guard footer requirement');
requireText(caseDetail, 'STAGE220A30B_FINANCE_MODAL_A26_GUARD_COMPAT', 'stage marker');
requireText(caseDetail, 'case-finance-modal-stage220a26-footer', 'A26 footer compatibility token');
requireText(caseDetail, 'case-finance-source-footer-stage220a30', 'new readable finance footer token');
requireText(caseDetail, 'event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30', 'combined footer source of truth tokens');

console.log('OK STAGE220A30B: readable finance modal footer keeps A26 guard compatibility token.');
