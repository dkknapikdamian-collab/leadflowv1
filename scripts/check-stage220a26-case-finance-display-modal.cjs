const fs = require('fs');

function fail(message) {
  console.error('STAGE220A26_CASE_FINANCE_DISPLAY_MODAL_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const a25Guard = read('scripts/check-stage220a25-case-finance-sync.cjs');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(caseDetail, 'STAGE220A26_CASE_FINANCE_DISPLAY_SOURCE', 'CaseDetail A26 marker');
requireText(caseDetail, 'caseFinanceSourceStage220A26', 'source finance summary');
requireText(caseDetail, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'source uses effective payments');
requireText(caseDetail, 'const caseFinanceSummary = caseFinanceSourceStage220A26;', 'compat alias');
requireText(caseDetail, 'caseFinanceSourceStage220A26.contractValue', 'display contract value source');
requireText(caseDetail, 'caseFinanceSourceStage220A26.clientPaidAmount', 'display paid amount source');
requireText(caseDetail, 'caseFinanceSourceStage220A26.remainingAmount', 'display remaining source');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionRemainingAmount', 'display commission remaining source');
requireText(caseDetail, 'data-stage220a26-case-finance-modal="true"', 'finance modal marker');
requireText(caseDetail, 'data-stage220a26-case-payment-dialog="true"', 'payment dialog marker');
requireText(caseDetail, 'className="cf-vst-input case-finance-edit-select"', 'finance selects VST input');
requireText(caseDetail, 'case-finance-modal-stage220a26-footer', 'finance modal footer VST');

forbidText(caseDetail, 'getCaseFinanceSummary(caseData, effectiveCasePaymentsStage220A25)', 'undefined helper call');
forbidText(caseDetail, '<DialogContent className="case-finance-edit-modal">', 'old finance modal content class');
forbidText(caseDetail, 'className="case-finance-edit-select"', 'old finance select class only');

requireText(a25Guard, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'A25 guard updated to alias helper');

requireText(caseCss, 'STAGE220A26_CASE_FINANCE_MODAL_VST', 'CSS marker');
requireText(caseCss, '.case-finance-modal-stage220a26', 'finance modal CSS');
requireText(caseCss, 'var(--cf-vst-surface-card-solid', 'VST surface token');
requireText(caseCss, 'var(--cf-vst-color-primary', 'VST primary token');

requireText(doc, 'STAGE220A26 - finanse sprawy: źródło wyświetlania i modale', 'doc A26 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a26-case-finance-display-modal.cjs', 'prebuild A26 guard');

console.log('STAGE220A26_CASE_FINANCE_DISPLAY_MODAL_GUARD: OK');
