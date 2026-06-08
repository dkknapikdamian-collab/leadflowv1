const fs = require('fs');

function fail(message) {
  console.error('STAGE220A25_CASE_FINANCE_SYNC_GUARD: FAIL');
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

const supabase = read('src/lib/supabase-fallback.ts');
const clients = read('src/pages/Clients.tsx');
const casesApi = read('api/cases.ts');
const caseDetail = read('src/pages/CaseDetail.tsx');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

requireText(supabase, 'STAGE220A25_CASE_CREATE_FROM_CLIENT_FINANCE_SYNC', 'supabase marker');
requireText(supabase, 'export async function createCaseInSupabase', 'createCaseInSupabase export');
requireText(supabase, 'expectedRevenue?: number', 'CaseUpsert expectedRevenue');
requireText(supabase, 'caseValue?: number', 'CaseUpsert caseValue');
requireText(supabase, 'currency?: string', 'CaseUpsert currency');
requireText(supabase, 'commissionAmount?: number', 'CaseUpsert commissionAmount');

requireText(clients, 'STAGE220A25_CASE_FINANCE_SYNC_FROM_CLIENT_CREATE', 'Clients A25 marker');
requireText(clients, 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL', 'Clients R5 marker');
requireText(clients, 'createCaseInSupabase', 'Clients createCase import/use');
requireText(clients, 'data-stage220a25-client-case-fields="true"', 'client case form fields');
requireText(clients, 'let createdCaseId =', 'created case id capture');
requireText(clients, "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')", 'navigate to created case finance');
requireText(clients, 'contractValue: 0', 'starter case contract value empty');
requireText(clients, 'expectedRevenue: 0', 'starter case expected revenue empty');
requireText(clients, 'caseValue: 0', 'starter case value empty');
requireText(clients, 'remainingAmount: 0', 'starter case remaining empty');
requireText(clients, "commissionMode: 'not_set'", 'starter case commission unset');
requireText(clients, 'commissionAmount: 0', 'starter case commission empty');
requireText(clients, 'primaryForClient: true', 'primary case set');

[
  'caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
  'commissionAmount: caseCommission',
  '<Label>Wartość sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
].forEach((token) => forbidText(clients, token, 'old client-form finance intake'));

requireText(casesApi, 'STAGE220A25_CASE_VALUE_ALIAS_CONTRACT', 'cases API marker');
requireText(casesApi, 'body.caseValue', 'caseValue alias');
requireText(casesApi, 'body.totalValue', 'totalValue alias');
requireText(casesApi, 'payload.contract_value = nextValue', 'patch contract_value from alias');
requireText(casesApi, 'payload.expected_revenue = nextValue', 'patch expected_revenue from alias');

requireText(caseDetail, 'STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS', 'CaseDetail marker');
requireText(caseDetail, 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL', 'CaseDetail R5 marker');
requireText(caseDetail, 'URLSearchParams(window.location.search)', 'CaseDetail URL finance params');
requireText(caseDetail, 'setIsFinanceEditOpen(true)', 'CaseDetail opens finance modal');
requireText(caseDetail, 'buildFin11FinanceEditState(caseData, casePayments)', 'CaseDetail builds finance form from case');
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
