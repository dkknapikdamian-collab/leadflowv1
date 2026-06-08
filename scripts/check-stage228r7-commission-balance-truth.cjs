const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R7_COMMISSION_BALANCE_TRUTH_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const actionButtons = read('src/components/finance/CaseFinanceActionButtons.tsx');
const settlementPanel = read('src/components/finance/CaseSettlementPanel.tsx');
const miniSummary = read('src/components/finance/FinanceMiniSummary.tsx');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE228R7_COMMISSION_BALANCE_TRUTH',
  'Dodaj wpłatę prowizji',
  "onClick={() => openCaseFinancePaymentModal('commission')}",
  'data-stage228r7-add-commission-payment="true"',
  'Koryguj wpłatę prowizji',
  'Historia wpłat prowizji',
  'Wartość transakcji',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
  'caseFinanceSourceStage220A26.commissionPaidAmount',
  'caseFinanceSourceStage220A26.commissionRemainingAmount',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail'));

[
  "onClick={() => openCaseFinancePaymentModal('partial')}",
  'Dodaj płatność prowizji',
].forEach((token) => forbidText(caseDetail, token, 'CaseDetail right rail commission action'));

[
  'STAGE228R7_COMMISSION_BALANCE_ACTION_LABELS',
  'Dodaj wpłatę klienta',
  'Dodaj wpłatę prowizji',
].forEach((token) => requireText(actionButtons, token, 'CaseFinanceActionButtons'));

[
  'STAGE228R7_CASE_SETTLEMENT_COMMISSION_BALANCE_TRUTH',
  'Ustaw wartość transakcji i prowizję',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
  'Wpłaty prowizji zmniejszają saldo prowizji do zapłaty.',
  "onAddCommissionPayment={() => setPaymentDialogType('commission')}",
].forEach((token) => requireText(settlementPanel, token, 'CaseSettlementPanel'));

[
  'Wpłacono od klienta',
  'Pozostało',
  "onAddPayment={() => setPaymentDialogType('partial')}",
  "onAddDepositPayment={() => setPaymentDialogType('deposit')}",
].forEach((token) => forbidText(settlementPanel, token, 'CaseSettlementPanel main commission view'));

[
  'STAGE228R7_CLIENT_FINANCE_COMMISSION_BALANCE_TRUTH',
  'Suma wartości transakcji',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
  'totals.commissionPaidAmount',
  'totals.commissionRemainingAmount',
  'row.summary.commissionPaidAmount',
  'row.summary.commissionRemainingAmount',
].forEach((token) => requireText(miniSummary, token, 'FinanceMiniSummary'));

[
  'Suma wpłat klienta',
  'Suma pozostała',
].forEach((token) => forbidText(miniSummary, token, 'FinanceMiniSummary client totals'));

[
  'STAGE228R7_CLIENT_DETAIL_COMMISSION_BALANCE_TRUTH',
  'data-stage228r7-case-card-commission-balance="true"',
  'const commissionPaid = formatMoneyWithCurrency(caseFinance.commissionPaidAmount, caseFinance.currency);',
  'const commissionRemaining = formatMoneyWithCurrency(caseFinance.commissionRemainingAmount, caseFinance.currency);',
  'Wpłacono prowizji: {commissionPaid}',
  'Do zapłaty prowizji: {commissionRemaining}',
  'Suma wartości transakcji',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail'));

[
  'Suma wpłat klienta',
].forEach((token) => forbidText(clientDetail, token, 'ClientDetail main commission view'));

if (pkg.scripts['check:stage228r7-commission-balance-truth'] !== 'node scripts/check-stage228r7-commission-balance-truth.cjs') {
  fail('package.json missing check:stage228r7-commission-balance-truth script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r7-commission-balance-truth.cjs')) {
  fail('package.json prebuild missing Stage228R7 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R7_COMMISSION_BALANCE_TRUTH',
  contract: 'finance surfaces show transaction value, commission due, commission paid and commission remaining'
}, null, 2));
