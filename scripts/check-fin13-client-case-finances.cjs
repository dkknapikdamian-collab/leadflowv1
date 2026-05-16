const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];
function read(p) { const full = path.join(root, p); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function assert(cond, msg) { if (!cond) errors.push(msg); }

const dialog = read('src/components/finance/CaseFinanceEditorDialog.tsx');
assert(dialog.includes('CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG'), 'brak wsp\u00F3lnego CaseFinanceEditorDialog');
assert(dialog.includes('type CaseFinanceEditorDialogProps'), 'CaseFinanceEditorDialog nie ma wymaganych props\u00F3w');
assert(dialog.includes('caseRecord: Record<string, unknown> | null'), 'CaseFinanceEditorDialog nie przyjmuje caseRecord');
assert(dialog.includes('payments: Record<string, unknown>[]'), 'CaseFinanceEditorDialog nie przyjmuje payments');
assert(dialog.includes('onSave: (patch: CaseFinancePatch) => Promise<void>'), 'CaseFinanceEditorDialog nie zapisuje przez CaseFinancePatch');
assert(dialog.includes('parseCaseFinanceNumber'), 'brak parsera liczb finansowych');
assert(dialog.includes("new Intl.NumberFormat('pl-PL'"), 'brak Intl.NumberFormat pl-PL');
assert(dialog.includes('Procent od warto\u015Bci'), 'modal nie ma opcji prowizji procentowej od warto\u015Bci');
assert(dialog.includes('Kwota sta\u0142a'), 'modal nie ma opcji prowizji kwotowej');
assert(dialog.includes('Nie ustawiono'), 'modal nie obs\u0142uguje pustej warto\u015Bci jako Nie ustawiono');
assert(dialog.includes('buildCaseFinancePatch'), 'modal nie u\u017Cywa buildCaseFinancePatch');

const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
assert(buttons.includes('Edytuj warto\u015B\u0107/prowizj\u0119'), 'brak wsp\u00F3lnego przycisku edycji finans\u00F3w');
assert(buttons.includes('Dodaj wp\u0142at\u0119'), 'brak wsp\u00F3lnego przycisku dodawania wp\u0142aty');
assert(buttons.includes('Otw\u00F3rz spraw\u0119'), 'brak przycisku otwarcia sprawy');

const financeMini = read('src/components/finance/FinanceMiniSummary.tsx');
assert(financeMini.includes('FIN-13_CLIENT_FINANCES_ARE_CASE_FINANCES'), 'FinanceMiniSummary nie ma markeru FIN-13');
assert(financeMini.includes('Finanse klienta'), 'brak nag\u0142\u00F3wka Finanse klienta');
assert(financeMini.includes('Suma warto\u015Bci spraw'), 'brak sumy warto\u015Bci spraw');
assert(financeMini.includes('Suma wp\u0142at klienta'), 'brak sumy wp\u0142at klienta');
assert(financeMini.includes('Suma pozosta\u0142a'), 'brak sumy pozosta\u0142ej');
assert(financeMini.includes('Suma prowizji nale\u017Cnej'), 'brak sumy prowizji nale\u017Cnej');
assert(financeMini.includes('Suma prowizji zap\u0142aconej'), 'brak sumy prowizji zap\u0142aconej');
assert(financeMini.includes('Lista spraw z finansami'), 'brak listy spraw z finansami');
assert(financeMini.includes('getCaseFinanceSummary(caseRecord, casePayments)'), 'sprawy klienta nie s\u0105 liczone przez getCaseFinanceSummary(case, paymentsForCase)');
assert(financeMini.includes('fetchCasesFromSupabase({ clientId: resolvedClientId })'), 'brak pobierania spraw klienta przez fetchCasesFromSupabase({ clientId })');
assert(financeMini.includes('fetchPaymentsFromSupabase({ clientId: resolvedClientId })'), 'brak pobierania p\u0142atno\u015Bci klienta przez fetchPaymentsFromSupabase({ clientId })');
assert(financeMini.includes('updateCaseInSupabase(updatePayload)'), 'edycja finans\u00F3w klienta nie zapisuje konkretnej sprawy przez updateCaseInSupabase');
assert(financeMini.includes('createPaymentInSupabase({'), 'dodawanie wp\u0142aty z klienta nie u\u017Cywa createPaymentInSupabase');
assert(financeMini.includes('caseId: row.caseId'), 'wp\u0142ata z klienta nie wymusza caseId');
assert(financeMini.includes('Nie mo\u017Cna doda\u0107 p\u0142atno\u015Bci bez wskazania sprawy'), 'brak blokady p\u0142atno\u015Bci bez sprawy');
assert(financeMini.includes('CaseFinanceEditorDialog'), 'klient nie u\u017Cywa wsp\u00F3lnego modala finans\u00F3w sprawy');
assert(financeMini.includes('CaseFinanceActionButtons'), 'lista spraw klienta nie u\u017Cywa wsp\u00F3lnych przycisk\u00F3w');
assert(!/clientFinance\s*[:=]\s*\{/.test(financeMini), 'nie wolno tworzy\u0107 osobnego modelu finans\u00F3w klienta');

const caseSettlement = read('src/components/finance/CaseSettlementPanel.tsx');
assert(caseSettlement.includes('CaseFinanceEditorDialog'), 'CaseSettlementPanel nie u\u017Cywa wsp\u00F3lnego modala finans\u00F3w');
assert(caseSettlement.includes('CaseFinanceActionButtons'), 'CaseSettlementPanel nie u\u017Cywa wsp\u00F3lnych przycisk\u00F3w finans\u00F3w');

const clientDetail = read('src/pages/ClientDetail.tsx');
assert(clientDetail.includes('ClientFinanceRelationSummary'), 'ClientDetail nie renderuje/importuje finans\u00F3w klienta');
assert(clientDetail.includes('FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE') || clientDetail.includes('<ClientFinanceRelationSummary'), 'ClientDetail nie ma markeru lub renderu FIN-13');
const firstCases = clientDetail.indexOf("'cases'");
const firstSummary = clientDetail.indexOf("'summary'");
assert(firstCases >= 0 && firstSummary >= 0 && firstCases < firstSummary, 'zak\u0142adka Sprawy musi by\u0107 przed Podsumowanie w modelu ClientDetail');

const cssFinance = read('src/styles/finance/closeflow-finance.css');
assert(cssFinance.includes('FIN-13_CLIENT_CASE_FINANCES_STYLES'), 'brak styl\u00F3w FIN-13 w closeflow-finance.css');
const pkg = read('package.json');
assert(pkg.includes('check:fin13'), 'package.json nie ma check:fin13');
assert(pkg.includes('test:fin13'), 'package.json nie ma test:fin13');

if (errors.length) {
  console.error('FIN-13 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-13 check passed: finanse klienta s\u0105 finansami spraw i u\u017Cywaj\u0105 wsp\u00F3lnego modala.');
