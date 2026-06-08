const fs = require('fs');

function fail(message) {
  console.error('STAGE220A26B_FINANCE_REGRESSION_CONTRACT_GUARD: FAIL');
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

const clients = read('src/pages/Clients.tsx');
const casesApi = read('api/cases.ts');
const caseDetail = read('src/pages/CaseDetail.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const a13Guard = read('scripts/check-stage220a13-finance-scope-source-truth.cjs');
const a14Guard = read('scripts/check-stage220a14-finance-scope-guard-lock.cjs');
const a25Guard = read('scripts/check-stage220a25-case-finance-sync.cjs');
const a26Guard = read('scripts/check-stage220a26-case-finance-display-modal.cjs');
const pkg = JSON.parse(read('package.json'));

/* A25/R5: klient tworzy pustą sprawę i przechodzi do modala finansów sprawy. */
requireText(clients, 'STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE', 'Clients A25 marker');
requireText(clients, 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL', 'Clients R5 marker');
requireText(clients, 'createCaseInSupabase', 'client create case API');
requireText(clients, 'data-stage220a25-client-case-fields="true"', 'client start-case fields');
requireText(clients, 'let createdCaseId =', 'created case id capture');
requireText(clients, "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')", 'navigate to finance modal');
requireText(clients, 'contractValue: 0', 'starter case contract value empty');
requireText(clients, 'expectedRevenue: 0', 'starter case expected revenue empty');
requireText(clients, 'caseValue: 0', 'starter case value empty');
requireText(clients, 'remainingAmount: 0', 'starter case remaining empty');
requireText(clients, "commissionMode: 'not_set'", 'starter case commission mode empty');
requireText(clients, 'commissionAmount: 0', 'starter case commission empty');
requireText(clients, 'primaryForClient: true', 'primary case write');

[
  'caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
  'commissionAmount: caseCommission',
  '<Label>Wartość sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
].forEach((token) => forbidText(clients, token, 'old client-form finance intake'));

/* API: sprawa ma akceptować aliasy wartości, żeby front nie tracił kwoty w CaseDetail. */
requireText(casesApi, 'STAGE220A25_CASE_VALUE_ALIAS_CONTRACT', 'cases API value alias marker');
requireText(casesApi, 'body.caseValue', 'caseValue alias');
requireText(casesApi, 'body.totalValue', 'totalValue alias');
requireText(casesApi, 'payload.contract_value = nextValue', 'contract_value alias write');
requireText(casesApi, 'payload.expected_revenue = nextValue', 'expected_revenue alias write');

/* CaseDetail ma otwierać i zapisywać właściwy modal finansów. */
requireText(caseDetail, 'STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS', 'CaseDetail A25 marker');
requireText(caseDetail, 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL', 'CaseDetail R5 marker');
requireText(caseDetail, 'URLSearchParams(window.location.search)', 'CaseDetail URL finance params');
requireText(caseDetail, "params.get('finance') === '1'", 'finance query param');
requireText(caseDetail, "params.get('source') === 'client-create'", 'client create query source');
requireText(caseDetail, 'setIsFinanceEditOpen(true)', 'open finance editor');
requireText(caseDetail, 'buildFin11FinanceEditState(caseData, casePayments)', 'finance form source');
requireText(caseDetail, 'STAGE220A26_CASE_FINANCE_DISPLAY_SOURCE', 'CaseDetail A26 marker');
requireText(caseDetail, 'caseFinanceSourceStage220A26', 'finance display source');
requireText(caseDetail, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'finance display source helper');
requireText(caseDetail, 'const caseFinanceSummary = caseFinanceSourceStage220A26;', 'compat alias');
requireText(caseDetail, 'caseFinanceSourceStage220A26.contractValue', 'display contract value');
requireText(caseDetail, 'caseFinanceSourceStage220A26.clientPaidAmount', 'display paid amount');
requireText(caseDetail, 'caseFinanceSourceStage220A26.remainingAmount', 'display remaining amount');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionRemainingAmount', 'display commission remaining');

forbidText(caseDetail, 'getCaseFinanceSummary(caseData, effectiveCasePaymentsStage220A25)', 'undefined helper call');

requireText(caseDetail, 'data-stage220a26-case-finance-modal="true"', 'finance modal marker');
requireText(caseDetail, 'data-stage220a26-case-payment-dialog="true"', 'payment modal marker');
requireText(caseDetail, 'className="cf-vst-input case-finance-edit-select"', 'finance select VST input');
requireText(caseDetail, 'case-finance-modal-stage220a26-footer', 'finance modal footer');

requireText(caseCss, 'STAGE220A26_CASE_FINANCE_MODAL_VST', 'finance modal CSS marker');
requireText(caseCss, '.case-finance-modal-stage220a26', 'finance modal VST CSS');
requireText(caseCss, 'var(--cf-vst-surface-card-solid', 'VST surface token');
requireText(caseCss, 'var(--cf-vst-color-primary', 'VST primary token');

requireText(a13Guard, 'caseFinanceReadsA26Source', 'A13 accepts A26 source');
requireText(a14Guard, 'caseFinanceUsesA26Source', 'A14 accepts A26 source');
requireText(a25Guard, 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL', 'A25 guard accepts R5 flow');
requireText(a26Guard, 'STAGE220A26_CASE_FINANCE_DISPLAY_MODAL_GUARD', 'A26 guard exists');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a26b-finance-regression-contract.cjs', 'prebuild A26B guard');

console.log('STAGE220A26B_FINANCE_REGRESSION_CONTRACT_GUARD: OK');
