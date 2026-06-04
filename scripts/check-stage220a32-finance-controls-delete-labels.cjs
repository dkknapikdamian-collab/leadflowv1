const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A32B_FINANCE_CONTROLS_DELETE_LABELS_GUARD: FAIL'); console.error(message); process.exit(1); }
function requireText(text, needle, label) { if (!text.includes(needle)) fail(label + ' missing: ' + needle); }
function forbidText(text, needle, label) { if (text.includes(needle)) fail(label + ' forbidden: ' + needle); }

const caseDetail = read('src/pages/CaseDetail.tsx');
const financeCss = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const visualCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const pkg = JSON.parse(read('package.json'));

requireText(caseDetail, 'STAGE220A32_CASE_FINANCE_CONTROLS_DELETE_LABELS', 'A32 marker');
requireText(caseDetail, 'cf-case-detail-delete-action-stage220a32', 'delete action A32 class');
requireText(caseDetail, 'data-stage220a32-delete-case-button="true"', 'delete action A32 data marker');
requireText(caseDetail, 'data-stage220a32-commission-mode-control="true"', 'commission mode control marker');
requireText(caseDetail, "commissionRate: nextMode === 'percent' ? current.commissionRate : ''", 'percent mode clears incompatible rate');
requireText(caseDetail, "commissionAmount: nextMode === 'fixed' ? current.commissionAmount : ''", 'fixed mode clears incompatible amount');
requireText(caseDetail, 'data-stage220a32-commission-rate-input="percent-only"', 'percent input marker');
requireText(caseDetail, 'data-stage220a32-commission-amount-input="fixed-only"', 'fixed input marker');
requireText(caseDetail, "disabled={financeEditForm.commissionMode !== 'percent'}", 'percent input disabled outside percent');
requireText(caseDetail, "disabled={financeEditForm.commissionMode !== 'fixed'}", 'fixed input disabled outside fixed');

requireText(financeCss, 'STAGE220A32B_FINANCE_MODAL_LABEL_READABILITY_AND_DISABLED_CONTROLS', 'finance label readability CSS marker');
requireText(financeCss, 'color: #e2e8f0', 'readable finance label color');
requireText(financeCss, 'input:disabled', 'disabled input CSS');
requireText(financeCss, 'cursor: not-allowed', 'disabled cursor CSS');

requireText(visualCss, 'STAGE220A32B_CASE_DELETE_DANGER_ICON_ACTION', 'delete action visual CSS marker');
requireText(visualCss, '.cf-case-detail-delete-action-stage220a32::before', 'delete pseudo before removed');
requireText(visualCss, 'content: none !important;', 'delete decorative dot removed');
requireText(visualCss, 'stroke: #be123c', 'delete icon red stroke');

requireText(String(pkg.scripts?.prebuild || ''), 'node scripts/check-stage220a32-finance-controls-delete-labels.cjs', 'prebuild A32 guard wiring');
forbidText(caseDetail, 'cf-case-detail-delete-action-stage220a32 cf-case-detail-delete-action-stage220a32', 'duplicate A32 delete class');

console.log('STAGE220A32B_FINANCE_CONTROLS_DELETE_LABELS_GUARD: OK');
