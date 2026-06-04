const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src', 'pages', 'CaseDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-case-finance-modal-stage220a30.css');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`STAGE220A30 guard failed: ${label}\nMissing token: ${token}`);
}

function assertNotIncludes(text, token, label) {
  if (text.includes(token)) throw new Error(`STAGE220A30 guard failed: ${label}\nForbidden token still present: ${token}`);
}

const caseDetail = read(caseDetailPath);
const css = read(cssPath);

assertIncludes(caseDetail, "import '../styles/closeflow-case-finance-modal-stage220a30.css';", 'CaseDetail imports finance modal VST CSS');
assertIncludes(caseDetail, 'STAGE220A30_CASE_FINANCE_MODAL_VISUAL_SOURCE_TRUTH', 'stage marker exists');
assertIncludes(caseDetail, 'event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30', 'finance modals use shared readable dialog shell');
assertIncludes(caseDetail, 'case-finance-source-header-stage220a30', 'finance modal headers use source class');
assertIncludes(caseDetail, 'case-finance-source-form-stage220a30', 'finance modal forms use source class');
assertIncludes(caseDetail, 'case-finance-source-footer-stage220a30', 'finance modal footers use source class');
assertIncludes(caseDetail, 'case-payment-history-modal-stage220a30__actions', 'payment history actions have no-overlap action row class');
assertIncludes(caseDetail, 'case-payment-history-modal-stage220a30__delete', 'delete action uses stage220a30 no-overlap class');
assertIncludes(caseDetail, 'Wpisz kwotę, datę i krótki opis', 'add payment description is specific and readable');
assertIncludes(caseDetail, 'Termin płatności (opcjonalnie)', 'due date label is explicit');
assertIncludes(caseDetail, '<span>Wartość sprawy</span>', 'case value label is shortened');
assertNotIncludes(caseDetail, 'className="cf-vst-dialog case-finance-edit-modal case-finance-modal-stage220a26"', 'old finance modal class removed from finance dialogs');
assertNotIncludes(caseDetail, 'className="cf-vst-dialog case-detail-payment-dialog case-finance-modal-stage220a26"', 'old add-payment modal class removed');

assertIncludes(css, '.case-finance-source-modal-stage220a30', 'CSS defines modal source class');
assertIncludes(css, '.case-finance-source-form-stage220a30', 'CSS defines form source class');
assertIncludes(css, '.case-payment-history-modal-stage220a30__actions', 'CSS defines no-overlap action row');
assertIncludes(css, 'grid-template-columns: minmax(0, 1fr) auto', 'payment history row reserves action column');
assertIncludes(css, 'color: #1e293b', 'labels have readable dark color');
assertIncludes(css, 'background: #ffffff', 'inputs/modals force readable light surface');

console.log('OK STAGE220A30: finance/payment modals use readable source-truth styling and history actions do not overlap.');
