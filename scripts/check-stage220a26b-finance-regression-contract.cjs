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

/* A25/R4: klient tworzony z kwotą startową zapisuje prowizję, nie wartość transakcji. */
requireText(clients, 'STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE', 'Clients A25 marker');
requireText(clients, 'STAGE228R4_CLIENT_CREATE_CASE_COMMISSION_INPUT', 'Clients R4 commission input marker');
requireText(clients, 'createCaseInSupabase', 'client create case API');
requireText(clients, 'data-stage220a25-client-case-fields="true"', 'client start-case fields');
requireText(clients, 'const caseCommission = parseClientCreateMoneyStage220A25(preparedClient.caseCommission)', 'case commission parser');
requireText(clients, 'contractValue: transactionValue', 'case contract value stays transaction value');
requireText(clients, 'expectedRevenue: transactionValue', 'case expected revenue stays transaction value');
requireText(clients, 'caseValue: transactionValue', 'case value stays transaction value');
requireText(clients, 'remainingAmount: transactionValue', 'case remaining amount stays transaction value');
requireText(clients, "commissionMode: caseCommission > 0 ? 'fixed' : 'not_set'", 'fixed commission mode write');
requireText(clients, "commissionBase: 'contract_value'", 'commission base write');
requireText(clients, 'commissionRate: 0', 'commission rate write');
requireText(clients, 'commissionAmount: caseCommission', 'commission amount write');
requireText(clients, "commissionStatus: caseCommission > 0 ? 'expected' : 'not_set'", 'commission expected status write');
requireText(clients, 'primaryForClient: true', 'primary case write');

[
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
  '<Label>Wartość sprawy</Label>',
].forEach((token) => forbidText(clients, token, 'old starter case transaction mapping'));

/* API: sprawa ma akceptować aliasy wartości, żeby front nie tracił kwoty. */
requireText(casesApi, 'STAGE220A25_CASE_VALUE_ALIAS_CONTRACT', 'cases API value alias marker');
requireText(casesApi, 'body.caseValue', 'caseValue alias');
requireText(casesApi, 'body.totalValue', 'totalValue alias');
requireText(casesApi, 'payload.contract_value = nextValue', 'contract_value alias write');
requireText(casesApi, 'payload.expected_revenue = nextValue', 'expected_revenue alias write');

/* A25/A26: CaseDetail ma jedno źródło płatności i jedno źródło wyświetlania finansów. */
requireText(caseDetail, 'STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS', 'CaseDetail A25 marker');
requireText(caseDetail, 'effectiveCasePaymentsStage220A25', 'effective payments source');
requireText(caseDetail, 'STAGE220A26_CASE_FINANCE_DISPLAY_SOURCE', 'CaseDetail A26 marker');
requireText(caseDetail, 'caseFinanceSourceStage220A26', 'finance display source');
requireText(caseDetail, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'finance display source helper');
requireText(caseDetail, 'const caseFinanceSummary = caseFinanceSourceStage220A26;', 'compat alias');
requireText(caseDetail, 'caseFinanceSourceStage220A26.contractValue', 'display contract value');
requireText(caseDetail, 'caseFinanceSourceStage220A26.clientPaidAmount', 'display paid amount');
requireText(caseDetail, 'caseFinanceSourceStage220A26.remainingAmount', 'display remaining amount');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionRemainingAmount', 'display commission remaining');

forbidText(caseDetail, 'getCaseFinanceSummary(caseData, effectiveCasePaymentsStage220A25)', 'undefined helper call');

/* Modal wpłaty i edycji finansów ma zostać w VST. */
requireText(caseDetail, 'data-stage220a26-case-finance-modal="true"', 'finance modal marker');
requireText(caseDetail, 'data-stage220a26-case-payment-dialog="true"', 'payment modal marker');
requireText(caseDetail, 'className="cf-vst-input case-finance-edit-select"', 'finance select VST input');
requireText(caseDetail, 'case-finance-modal-stage220a26-footer', 'finance modal footer');

requireText(caseCss, 'STAGE220A26_CASE_FINANCE_MODAL_VST', 'finance modal CSS marker');
requireText(caseCss, '.case-finance-modal-stage220a26', 'finance modal VST CSS');
requireText(caseCss, 'var(--cf-vst-surface-card-solid', 'VST surface token');
requireText(caseCss, 'var(--cf-vst-color-primary', 'VST primary token');

/* Starsze guardy muszą akceptować nowe źródło, inaczej prebuild wróci do legacy. */
requireText(a13Guard, 'caseFinanceReadsA26Source', 'A13 accepts A26 source');
requireText(a14Guard, 'caseFinanceUsesA26Source', 'A14 accepts A26 source');
requireText(a25Guard, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'A25 guard uses source alias');
requireText(a26Guard, 'STAGE220A26_CASE_FINANCE_DISPLAY_MODAL_GUARD', 'A26 guard exists');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a26b-finance-regression-contract.cjs', 'prebuild A26B guard');

console.log('STAGE220A26B_FINANCE_REGRESSION_CONTRACT_GUARD: OK');
