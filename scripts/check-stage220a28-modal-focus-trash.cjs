const fs = require('fs');

function fail(message) {
  console.error('STAGE220A28_MODAL_FOCUS_TRASH_GUARD: FAIL');
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
const cases = read('src/pages/Cases.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const listCss = read('src/styles/closeflow-record-list-source-truth.css');
const chunkGuard = read('src/pwa/chunk-asset-reload-guard.ts');
const pkg = JSON.parse(read('package.json'));

requireText(caseDetail, 'STAGE220A28_PAYMENT_HISTORY_MODAL_VST', 'CaseDetail A28 marker');
requireText(caseDetail, 'data-stage220a28-payment-history-modal-vst="true"', 'history modal VST marker');
requireText(caseDetail, 'data-stage220a28-payment-correction-modal-vst="true"', 'correction modal VST marker');
requireText(caseDetail, 'client-case-form-content case-payment-history-modal-stage220a27b', 'history modal uses form source');
requireText(caseDetail, 'client-case-form-header case-payment-history-modal-stage220a28-header', 'history modal header source');
requireText(caseDetail, 'client-case-form-section case-payment-history-modal-stage220a27b__context', 'history context section source');

forbidText(caseDetail, 'Wybierz wpłatę do korekty · oryginał zostaje · korekta tworzy osobny wpis w historii.', 'helper copy removed');
forbidText(caseDetail, 'Status: {billingStatusLabel(payment.status)}', 'redundant status removed');

requireText(caseCss, 'STAGE220A28_PAYMENT_HISTORY_MODAL_VST', 'CaseDetail CSS marker');
requireText(caseCss, '.case-payment-history-modal-stage220a28-vst', 'history modal CSS');
requireText(caseCss, '.case-payment-correction-modal-stage220a28-vst', 'correction modal CSS');
requireText(caseCss, 'var(--cf-modal-shell', 'modal source truth tokens');

requireText(cases, 'STAGE220A28_CASE_ROW_ACTIONS_SOURCE_TRUTH', 'Cases A28 marker');
requireText(cases, 'data-stage220a28-case-row-open-icon="true"', 'case open icon marker');
requireText(cases, 'data-stage220a28-case-row-delete-icon="true"', 'case delete icon marker');
requireText(cases, 'cf-case-row-actions-stage220a28', 'case row action cluster');
forbidText(cases, 'cf-case-row-delete-text-action', 'old text delete action removed');

requireText(listCss, 'STAGE220A28_CASE_ROW_ACTIONS_SOURCE_TRUTH', 'list CSS marker');
requireText(listCss, '.cf-case-row-delete-icon-action', 'case delete icon CSS');

requireText(chunkGuard, 'STAGE220A28_NO_TAB_RETURN_MODAL_RELOAD', 'chunk guard A28 marker');
requireText(chunkGuard, 'shouldDeferReloadForOpenCloseFlowModal', 'reload defer function');
requireText(chunkGuard, 'hasOpenCloseFlowDialog', 'open dialog detector');
requireText(chunkGuard, 'closeFlowLastHiddenAt', 'hidden timestamp');
requireText(chunkGuard, 'closeFlowLastVisibleAt', 'visible timestamp');
requireText(chunkGuard, 'if (shouldDeferReloadForOpenCloseFlowModal(source)) return true;', 'reload deferred before hard reload');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a28-modal-focus-trash.cjs', 'prebuild A28 guard');

console.log('STAGE220A28_MODAL_FOCUS_TRASH_GUARD: OK');
