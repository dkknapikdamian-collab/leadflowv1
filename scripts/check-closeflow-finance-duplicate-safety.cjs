const fs = require('fs');

const checks = [];
function pass(label) { checks.push({ ok: true, label }); console.log('PASS ' + label); }
function fail(label) { checks.push({ ok: false, label }); console.error('FAIL ' + label); }
function read(rel) {
  if (!fs.existsSync(rel)) { fail(rel + ': exists'); return ''; }
  pass(rel + ': exists');
  return fs.readFileSync(rel, 'utf8');
}
function must(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail(label + ' [needle=' + needle + ']');
}
function mustNot(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail(label + ' [forbidden=' + needle + ']');
}

const copy = 'Ten klient mo\u017Ce mie\u0107 duplikat. Upewnij si\u0119, \u017Ce dodajesz wp\u0142at\u0119 do w\u0142a\u015Bciwego rekordu.';

const lib = read('src/lib/finance/finance-duplicate-safety.ts');
must(lib, 'CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_V1', 'duplicate safety marker');
must(lib, 'FINANCE_DUPLICATE_PAYMENT_WARNING_COPY', 'duplicate warning copy exported');
must(lib, copy, 'duplicate warning exact UX copy');
must(lib, "'lead' | 'client' | 'case'", 'duplicate candidate type includes case');
must(lib, 'normalizeFinanceDuplicateCandidate', 'duplicate candidate normalizer');
must(lib, 'buildFinanceDuplicateCandidatesFromRecord', 'duplicate candidates from record');
must(lib, 'buildFinanceDuplicateCandidatesFromRows', 'duplicate candidates from rows');
must(lib, 'hasFinanceDuplicateWarning', 'duplicate warning boolean helper');

const conflict = read('src/components/EntityConflictDialog.tsx');
must(conflict, "'lead' | 'client' | 'case'", 'EntityConflictDialog accepts case');
must(conflict, "return 'sprawa'", 'EntityConflictDialog labels case');
must(conflict, 'CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT', 'EntityConflictDialog FIN-9 marker');

const paymentForm = read('src/components/finance/PaymentFormDialog.tsx');
must(paymentForm, 'FinanceDuplicateCandidate', 'PaymentFormDialog accepts duplicate candidates');
must(paymentForm, 'duplicateCandidates?: FinanceDuplicateCandidate[]', 'PaymentFormDialog prop duplicateCandidates');
must(paymentForm, 'duplicateWarningCopy?: string', 'PaymentFormDialog prop duplicateWarningCopy');
must(paymentForm, 'data-fin9-payment-duplicate-warning="true"', 'PaymentFormDialog renders warning data marker');
must(paymentForm, 'Mo\u017Cliwy duplikat klienta', 'PaymentFormDialog warning title');
must(paymentForm, 'duplicateWarningCopy', 'PaymentFormDialog renders shared warning copy');
mustNot(paymentForm, 'disabled={duplicateCandidates', 'PaymentFormDialog does not block submit by duplicate warning');

const settlement = read('src/components/finance/CaseSettlementPanel.tsx');
must(settlement, 'buildFinanceDuplicateCandidatesFromRecord', 'CaseSettlementPanel derives duplicate candidates');
must(settlement, 'duplicateCandidates?: FinanceDuplicateCandidate[]', 'CaseSettlementPanel accepts duplicate candidates');
must(settlement, 'duplicateCandidates={financeDuplicateCandidates}', 'CaseSettlementPanel forwards duplicate candidates');
must(settlement, 'data-fin9-finance-duplicate-safety', 'CaseSettlementPanel FIN-9 hidden marker');
must(settlement, 'CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY', 'CaseSettlementPanel warning-only marker');
mustNot(settlement, 'disabled={financeDuplicateCandidates', 'CaseSettlementPanel does not block by duplicate warning');

const caseDetail = read('src/pages/CaseDetail.tsx');
must(caseDetail, 'CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER', 'CaseDetail FIN-9 marker');
const clientDetail = read('src/pages/ClientDetail.tsx');
must(clientDetail, 'CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER', 'ClientDetail FIN-9 marker');
const apiSystem = read('api/system.ts');
must(apiSystem, 'CLOSEFLOW_FIN9_API_SYSTEM_DUPLICATE_SAFETY_MARKER', 'api/system FIN-9 marker');

const css = read('src/styles/finance/closeflow-finance.css');
must(css, 'FIN-9_FINANCE_DUPLICATE_SAFETY_STYLE', 'FIN-9 CSS marker');
must(css, '.cf-finance-duplicate-warning', 'duplicate warning CSS class');
must(css, 'var(--', 'duplicate warning CSS uses tokens');
if (/(#[0-9a-fA-F]{3,8}\b|rgba?\s*\()/g.test(css)) fail('finance CSS has no raw rgb/rgba/hex colors');
else pass('finance CSS has no raw rgb/rgba/hex colors');

const doc = read('docs/finance/CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_2026-05-10.md');
must(doc, 'Nie blokowa\u0107. Ostrzega\u0107.', 'FIN-9 doc states warning-only rule');
must(doc, copy, 'FIN-9 doc includes exact UX copy');

const failed = checks.filter((item) => !item.ok);
console.log('\nSummary: ' + (checks.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('FAIL CLOSEFLOW_FINANCE_DUPLICATE_SAFETY_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FINANCE_DUPLICATE_SAFETY_OK');
