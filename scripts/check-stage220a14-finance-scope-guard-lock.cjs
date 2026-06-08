const fs = require('fs');

function fail(message) {
  console.error('STAGE220A14_FINANCE_SCOPE_GUARD_LOCK: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const financeSource = read('src/lib/finance/case-finance-source.ts');
const clientFinance = read('src/lib/client-finance.ts');
const clientDetail = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const financeCss = read('src/styles/finance/closeflow-finance.css');
const packageJson = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

/* Client finance data scope: all client cases. */
requireText(financeSource, "mode?: 'primary_case_first' | 'all_active_cases' | 'all_cases'", 'finance helper all_cases type');
requireText(financeSource, "if (mode === 'all_cases') return { cases: allCases, source: 'all_cases' }", 'finance helper all_cases early return');
requireText(clientFinance, "export type ClientFinanceSummaryMode = 'primary_case_first' | 'all_active_cases' | 'all_cases'", 'client finance wrapper all_cases type');
requireText(clientDetail, "mode: 'all_cases'", 'ClientDetail all cases finance mode');
requireText(clientDetail, 'data-stage220a13-client-finance-scope-card="true"', 'ClientDetail finance scope card marker');
requireText(clientDetail, 'Finanse klienta', 'ClientDetail finance card title');
const clientDetailUsesStage228R7CommissionTruth =
  clientDetail.includes('STAGE228R7_CLIENT_DETAIL_COMMISSION_BALANCE_TRUTH') ||
  clientDetail.includes('Suma wartości transakcji');

if (clientDetailUsesStage228R7CommissionTruth) {
  requireText(clientDetail, 'Suma wartości transakcji', 'ClientDetail R7 transaction value label');
  requireText(clientDetail, 'Prowizja należna', 'ClientDetail R7 commission due label');
  requireText(clientDetail, 'Wpłacono prowizji', 'ClientDetail R7 commission paid label');
  requireText(clientDetail, 'Do zapłaty prowizji', 'ClientDetail R7 commission remaining label');
} else {
  requireText(clientDetail, 'Suma wartości spraw', 'ClientDetail total cases value label');
  requireText(clientDetail, 'Suma wpłat', 'ClientDetail payments sum label');
}
requireText(clientDetail, 'Sprawy aktywne / rozliczone', 'ClientDetail active settled cases label');

/* Guard against old client finance tile returning. */
forbidText(clientDetail, 'const total = payments.reduce((sum, payment) => sum + amountOfPayment(payment), 0);', 'old client raw payments total tile');
forbidText(clientDetail, '<small>Podsumowanie finansów</small>', 'old client finance tile copy');

/* Case finance data scope: one case only. */
requireText(caseDetail, 'data-stage220a13-case-finance-scope-card="true"', 'CaseDetail finance scope card marker');
requireText(caseDetail, 'Finanse sprawy', 'CaseDetail finance card title');
const caseFinanceUsesA31CommissionBasis = caseDetail.includes('data-stage220a31-finance-billing-summary="true"');
if (caseFinanceUsesA31CommissionBasis) {
  requireText(caseDetail, 'Wartość transakcji', 'CaseDetail A31 transaction value label');
  requireText(caseDetail, 'Prowizja należna', 'CaseDetail A31 commission due label');
  requireText(caseDetail, 'Wpłacono prowizji', 'CaseDetail A31 commission paid label');
  requireText(caseDetail, 'Do zapłaty prowizji', 'CaseDetail A31 commission left label');
} else {
  requireText(caseDetail, 'Wartość sprawy', 'CaseDetail case value label');
  requireText(caseDetail, 'Wpłaty w sprawie', 'CaseDetail case payments label');
  requireText(caseDetail, 'Prowizja pozostała', 'CaseDetail remaining commission label');
}
const caseFinanceUsesLegacySummary =
  caseDetail.includes('caseFinanceSummary.contractValue') &&
  caseDetail.includes('caseFinanceSummary.clientPaidAmount') &&
  caseDetail.includes('caseFinanceSummary.remainingAmount') &&
  caseDetail.includes('}, [caseFinanceSummary]);');

const caseFinanceUsesA26Source =
  caseDetail.includes('caseFinanceSourceStage220A26.contractValue') &&
  caseDetail.includes('caseFinanceSourceStage220A26.clientPaidAmount') &&
  caseDetail.includes('caseFinanceSourceStage220A26.remainingAmount') &&
  caseDetail.includes('caseFinanceSourceStage220A26.commissionRemainingAmount') &&
  caseDetail.includes('getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)') &&
  caseDetail.includes('}, [caseFinanceSourceStage220A26]);');

if (!caseFinanceUsesLegacySummary && !caseFinanceUsesA26Source) {
  fail('CaseDetail finance card does not read from a guarded case finance source.');
}

/* Guard against old case finance card returning. */
forbidText(caseDetail, '<h2>Rozliczenie sprawy</h2>', 'old case right rail finance title');
forbidText(caseDetail, '<small>Wartość: {formatMoney(caseFinance.expected, caseFinance.currency)}</small>', 'old case expected small metric');
forbidText(caseDetail, '<small>Wpłacono: {formatMoney(caseFinance.paid, caseFinance.currency)}</small>', 'old case paid small metric');

/* Shared visual source. */
requireText(financeCss, 'STAGE220A13_FINANCE_SCOPE_CARD_VISUAL_SOURCE', 'shared finance visual marker');
requireText(financeCss, '.cf-finance-scope-card {', 'shared finance card class');
requireText(financeCss, '.cf-finance-scope-card__metrics', 'shared finance metrics class');
requireText(financeCss, '.cf-finance-scope-card__actions', 'shared finance actions class');

/* Make sure this lock is wired into build. */
const prebuild = String(packageJson.scripts && packageJson.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a13-finance-scope-source-truth.cjs', 'prebuild Stage220A13 guard wiring');
requireText(prebuild, 'node scripts/check-stage220a14-finance-scope-guard-lock.cjs', 'prebuild Stage220A14 guard wiring');

console.log('STAGE220A14_FINANCE_SCOPE_GUARD_LOCK: OK');
