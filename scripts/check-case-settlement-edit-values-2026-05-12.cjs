const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(file, 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function componentBlock(source, name) {
  const start = source.indexOf(`<${name}`);
  assert(start >= 0, `${name} not rendered`);
  const end = source.indexOf('/>', start);
  assert(end > start, `${name} render is not self-closing or cannot be checked`);
  return source.slice(start, end + 2);
}

const panel = read('src/components/finance/CaseSettlementPanel.tsx');
const section = read('src/components/finance/CaseSettlementSection.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const css = read('src/styles/finance/closeflow-finance.css');
const pkg = JSON.parse(read('package.json'));

assert(panel.includes('CLOSEFLOW_CASE_SETTLEMENT_EDIT_VALUES_V1'), 'Missing edit values guard in CaseSettlementPanel');
assert(panel.includes('hasCaseSettlementValue'), 'Missing hasCaseSettlementValue calculation');
assert(panel.includes('data-cf-case-settlement-value-cta="true"'), 'Missing visible value CTA');
assert(panel.includes('Ustaw wartość i prowizję'), 'Missing explicit value and commission action copy');
assert(panel.includes('Edytuj wartość/prowizję'), 'Missing edit value/commission action copy');
assert(panel.includes('Ustaw wartość transakcji i prowizję'), 'Missing commission dialog title focused on value and commission');
assert(panel.includes('Wartość transakcji / sprawy'), 'Missing explicit transaction/case value input label');
assert(panel.includes('Zapisz wartość i prowizję'), 'Missing explicit save button copy');
assert(panel.includes('data-cf-case-settlement-commission-note="true"'), 'Missing commission calculation explanation');

assert(section.includes('data-cf-case-finance-section="case-detail-only"'), 'CaseSettlementSection must keep case-detail-only wrapper');
assert(section.includes('expectedRouteId && expectedRouteId !== recordId'), 'CaseSettlementSection must block route mismatch ghosts');
assert(section.includes('isLoading || !record || !recordId'), 'CaseSettlementSection must block loading/empty records');

const settlementBlock = componentBlock(caseDetail, 'CaseSettlementSection');
assert(settlementBlock.includes('record={'), 'CaseSettlementSection must receive explicit record prop');
assert(settlementBlock.includes('routeCaseId={'), 'CaseSettlementSection must receive routeCaseId prop');
assert(settlementBlock.includes('isLoading={'), 'CaseSettlementSection must receive loading prop');
assert(settlementBlock.includes('payments={'), 'CaseSettlementSection must receive payments prop');
assert(settlementBlock.includes('onEditCommission='), 'CaseDetail must wire onEditCommission for value/commission save');
assert(settlementBlock.includes('onAddPayment='), 'CaseDetail must wire onAddPayment for payment save');
assert(caseDetail.includes('updateCaseInSupabase'), 'CaseDetail must use updateCaseInSupabase for settlement value save');
assert(caseDetail.includes('createPaymentInSupabase'), 'CaseDetail must use createPaymentInSupabase for settlement payments');

assert(!clientDetail.includes('CaseSettlementPanel'), 'ClientDetail must not render full CaseSettlementPanel');
assert(!clientDetail.includes('Dodaj płatność prowizji'), 'ClientDetail must not expose full commission payment action');
assert(!clientDetail.includes('Edytuj wartość/prowizję'), 'ClientDetail must not expose full value/commission editor');
assert(!leadDetail.includes('CaseSettlementPanel'), 'LeadDetail must not render full CaseSettlementPanel');
assert(!leadDetail.includes('Dodaj płatność prowizji'), 'LeadDetail must not expose commission payment action');
assert(!leadDetail.includes('Edytuj wartość/prowizję'), 'LeadDetail must not expose full value/commission editor');

assert(css.includes('cf-finance-settlement-empty-value'), 'Missing CSS for value CTA');
assert(pkg.scripts['check:case-settlement-edit-values'], 'Missing package script check:case-settlement-edit-values');
assert(pkg.scripts['diagnose:case-settlement-edit-values'], 'Missing package script diagnose:case-settlement-edit-values');

console.log('OK: case settlement edit values wiring is present and full editor remains case-only.');
