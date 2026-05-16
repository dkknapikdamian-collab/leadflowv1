const fs = require('fs');
const checks = [];
function pass(label){ checks.push({ok:true,label}); console.log('PASS ' + label); }
function fail(label){ checks.push({ok:false,label}); console.error('FAIL ' + label); }
function read(rel){ if(!fs.existsSync(rel)){ fail(rel + ': exists'); return ''; } pass(rel + ': exists'); return fs.readFileSync(rel,'utf8'); }
function must(text, needle, label){ if(text.includes(needle)) pass(label); else fail(label + ' [needle=' + needle + ']'); }
function mustNot(text, needle, label){ if(!text.includes(needle)) pass(label); else fail(label + ' [forbidden=' + needle + ']'); }

const lib = read('src/lib/finance/finance-duplicate-safety.ts');
must(lib, 'CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_V1', 'finance duplicate safety marker');
must(lib, 'FINANCE_DUPLICATE_PAYMENT_WARNING_COPY', 'shared warning copy');
must(lib, 'Ten klient mo\u017Ce mie\u0107 duplikat. Upewnij si\u0119, \u017Ce dodajesz wp\u0142at\u0119 do w\u0142a\u015Bciwego rekordu.', 'required UX copy');
must(lib, "'lead' | 'client' | 'case'", 'duplicate entity type includes case');
must(lib, 'buildFinanceDuplicateCandidatesFromRecord', 'record duplicate extraction');
must(lib, 'buildFinanceDuplicateCandidatesFromRows', 'rows duplicate matching helper');

const conflict = read('src/components/EntityConflictDialog.tsx');
must(conflict, "'lead' | 'client' | 'case'", 'EntityConflictDialog supports case candidate');
must(conflict, "return 'sprawa'", 'EntityConflictDialog labels case as sprawa');
must(conflict, 'CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT', 'EntityConflictDialog FIN-9 marker');

const form = read('src/components/finance/PaymentFormDialog.tsx');
must(form, 'finance-duplicate-safety', 'PaymentFormDialog imports duplicate safety');
must(form, 'duplicateCandidates?: FinanceDuplicateCandidate[]', 'PaymentFormDialog duplicate candidates prop');
must(form, 'data-fin9-payment-duplicate-warning="true"', 'PaymentFormDialog warning rendered');
must(form, 'Mo\u017Cliwy duplikat klienta', 'PaymentFormDialog warning title');
must(form, 'duplicateWarningCopy', 'PaymentFormDialog warning copy prop');
mustNot(form, 'disabled={duplicateCandidates', 'PaymentFormDialog does not block submit by duplicate warning');

const panel = read('src/components/finance/CaseSettlementPanel.tsx');
must(panel, 'buildFinanceDuplicateCandidatesFromRecord', 'CaseSettlementPanel derives duplicate candidates');
must(panel, 'duplicateCandidates?: FinanceDuplicateCandidate[]', 'CaseSettlementPanel duplicate candidates prop');
must(panel, 'data-fin9-payment-duplicate-warning="true"', 'CaseSettlementPanel warning rendered before payment');
must(panel, 'duplicateCandidates={financeDuplicateCandidates}', 'CaseSettlementPanel passes warning candidates to payment dialogs');
must(panel, 'CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY', 'CaseSettlementPanel warning-only marker');
mustNot(panel, 'disabled={financeDuplicateCandidates', 'CaseSettlementPanel does not block payment button by duplicate warning');

const caseDetail = read('src/pages/CaseDetail.tsx');
must(caseDetail, 'CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER', 'CaseDetail FIN-9 marker');
const clientDetail = read('src/pages/ClientDetail.tsx');
must(clientDetail, 'CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER', 'ClientDetail FIN-9 marker');
const apiSystem = read('api/system.ts');
must(apiSystem, 'CLOSEFLOW_FIN9_API_SYSTEM_DUPLICATE_SAFETY_MARKER', 'api/system FIN-9 marker');

const css = read('src/styles/finance/closeflow-finance.css');
must(css, 'FIN-9_FINANCE_DUPLICATE_SAFETY_STYLE', 'FIN-9 CSS marker');
must(css, '.cf-finance-duplicate-warning', 'FIN-9 warning class');
must(css, 'var(--', 'FIN-9 CSS uses tokens');
if (/(#[0-9a-fA-F]{3,8}\b|rgba?\s*\()/g.test(css)) fail('finance CSS has no raw rgb/rgba/hex colors'); else pass('finance CSS has no raw rgb/rgba/hex colors');

const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
if (pkg.scripts && pkg.scripts['check:closeflow-fin9-finance-duplicate-safety']) pass('package FIN-9 script present'); else fail('package FIN-9 script present');
const doc = read('docs/finance/CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_2026-05-10.md');
must(doc, 'FIN-9', 'FIN-9 doc marker');
must(doc, 'Nie blokowa\u0107. Ostrzega\u0107.', 'FIN-9 doc warning-only rule');
must(doc, 'Ten klient mo\u017Ce mie\u0107 duplikat', 'FIN-9 doc UX copy');

const failed = checks.filter(x => !x.ok);
console.log(`\nSummary: ${checks.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) { console.error('FAIL CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_FAILED'); process.exit(1); }
console.log('CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_OK');
