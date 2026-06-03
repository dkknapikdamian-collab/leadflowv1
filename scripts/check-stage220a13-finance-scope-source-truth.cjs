const fs = require('fs');

function fail(message) {
  console.error('STAGE220A13_FINANCE_SCOPE_SOURCE_TRUTH_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

const caseFinanceSource = fs.readFileSync('src/lib/finance/case-finance-source.ts', 'utf8');
const clientFinance = fs.readFileSync('src/lib/client-finance.ts', 'utf8');
const clientDetail = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/finance/closeflow-finance.css', 'utf8');

if (!caseFinanceSource.includes("'all_cases'")) fail('Finance source does not support all_cases mode.');
if (!caseFinanceSource.includes("mode === 'all_cases'")) fail('selectClientCases does not return all cases for all_cases mode.');
if (!clientFinance.includes("'all_cases'")) fail('Client finance type does not expose all_cases mode.');
if (!clientDetail.includes("mode: 'all_cases'")) fail('ClientDetail does not request all client cases for finance summary.');
if (!clientDetail.includes('data-stage220a13-client-finance-scope-card="true"')) fail('Client finance scope visual card marker missing.');
if (!caseDetail.includes('data-stage220a13-case-finance-scope-card="true"')) fail('Case finance scope visual card marker missing.');
if (!caseDetail.includes('Finanse sprawy')) fail('Case finance panel title missing.');
if (!caseDetail.includes('caseFinanceSummary.contractValue') || !caseDetail.includes('caseFinanceSummary.clientPaidAmount') || !caseDetail.includes('caseFinanceSummary.remainingAmount')) fail('Case finance panel does not read from caseFinanceSummary source.');
if (!css.includes('STAGE220A13_FINANCE_SCOPE_CARD_VISUAL_SOURCE') || !css.includes('.cf-finance-scope-card__metrics')) fail('Shared finance scope visual CSS missing.');

console.log('STAGE220A13_FINANCE_SCOPE_SOURCE_TRUTH_GUARD: OK');
