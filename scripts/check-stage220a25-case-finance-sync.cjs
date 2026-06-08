const fs = require('fs');

function fail(message) {
  console.error('STAGE220A25_CASE_FINANCE_SYNC_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const supabase = read('src/lib/supabase-fallback.ts');
const clients = read('src/pages/Clients.tsx');
const casesApi = read('api/cases.ts');
const caseDetail = read('src/pages/CaseDetail.tsx');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

requireText(supabase, 'STAGE220A25_CASE_CREATE_FROM_CLIENT_FINANCE_SYNC', 'supabase marker');
requireText(supabase, 'export async function createCaseInSupabase', 'createCaseInSupabase export');
requireText(supabase, 'expectedRevenue?: number', 'CaseUpsert expectedRevenue');
requireText(supabase, 'caseValue?: number', 'CaseUpsert caseValue');
requireText(supabase, 'currency?: string', 'CaseUpsert currency');

requireText(clients, 'STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE', 'Clients marker');
requireText(clients, 'createCaseInSupabase', 'Clients createCase import/use');
requireText(clients, 'parseClientCreateMoneyStage220A25', 'money parser');
requireText(clients, 'data-stage220a25-client-case-fields="true"', 'client case form fields');
requireText(clients, 'STAGE228R4_CLIENT_CREATE_CASE_COMMISSION_INPUT', 'Clients commission input marker');
requireText(clients, 'const caseCommission = parseClientCreateMoneyStage220A25(preparedClient.caseCommission)', 'Clients commission parser');
requireText(clients, 'contractValue: transactionValue', 'contract value stays transaction value');
requireText(clients, 'expectedRevenue: transactionValue', 'expected revenue stays transaction value');
requireText(clients, 'caseValue: transactionValue', 'case value stays transaction value');
requireText(clients, 'remainingAmount: transactionValue', 'remaining amount stays transaction value');
requireText(clients, "commissionMode: caseCommission > 0 ? 'fixed' : 'not_set'", 'fixed commission mode write');
requireText(clients, 'commissionAmount: caseCommission', 'commission amount write');
requireText(clients, "commissionStatus: caseCommission > 0 ? 'expected' : 'not_set'", 'commission expected status write');
requireText(clients, 'primaryForClient: true', 'primary case set');
['contractValue: caseValue', 'expectedRevenue: caseValue', 'remainingAmount: caseValue', '<Label>Wartość sprawy</Label>'].forEach((token) => {
  if (clients.includes(token)) fail('Clients still contains old starter case transaction mapping: ' + token);
});

requireText(casesApi, 'STAGE220A25_CASE_VALUE_ALIAS_CONTRACT', 'cases API marker');
requireText(casesApi, 'body.caseValue', 'caseValue alias');
requireText(casesApi, 'body.totalValue', 'totalValue alias');
requireText(casesApi, 'payload.contract_value = nextValue', 'patch contract_value from alias');
requireText(casesApi, 'payload.expected_revenue = nextValue', 'patch expected_revenue from alias');

requireText(caseDetail, 'STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS', 'CaseDetail marker');
requireText(caseDetail, 'effectiveCasePaymentsStage220A25', 'effective payments source');
requireText(caseDetail, 'getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)', 'finance summary uses effective payments');
requireText(caseDetail, 'sortCasePayments(effectiveCasePaymentsStage220A25)', 'visible payments use effective payments');
requireText(caseDetail, 'setCasePayments(normalizedFreshPayments)', 'reload syncs casePayments');
requireText(caseDetail, 'setPayments(normalizedFreshPayments as any[])', 'reload syncs payments');
requireText(caseDetail, 'setCasePayments((previous) => [created || input, ...previous] as CasePaymentRecord[])', 'optimistic payment sync');

requireText(doc, 'STAGE220A25 - finanse sprawy, klienta i wpłat', 'doc A25 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a25-case-finance-sync.cjs', 'prebuild A25 guard');

console.log('STAGE220A25_CASE_FINANCE_SYNC_GUARD: OK');
