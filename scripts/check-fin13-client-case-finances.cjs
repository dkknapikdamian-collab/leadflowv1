const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];
function read(p) { const full = path.join(root, p); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function assert(cond, msg) { if (!cond) errors.push(msg); }

const dialog = read('src/components/finance/CaseFinanceEditorDialog.tsx');
assert(dialog.includes('CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG'), 'brak wspólnego CaseFinanceEditorDialog');
assert(dialog.includes('type CaseFinanceEditorDialogProps'), 'CaseFinanceEditorDialog nie ma wymaganych propsów');
assert(dialog.includes('caseRecord: Record<string, unknown> | null'), 'CaseFinanceEditorDialog nie przyjmuje caseRecord');
assert(dialog.includes('payments: Record<string, unknown>[]'), 'CaseFinanceEditorDialog nie przyjmuje payments');
assert(dialog.includes('onSave: (patch: CaseFinancePatch) => Promise<void>'), 'CaseFinanceEditorDialog nie zapisuje przez CaseFinancePatch');
assert(dialog.includes('parseCaseFinanceNumber'), 'brak parsera liczb finansowych');
assert(dialog.includes("new Intl.NumberFormat('pl-PL'"), 'brak Intl.NumberFormat pl-PL');
assert(dialog.includes('Procent od wartości'), 'modal nie ma opcji prowizji procentowej od wartości');
assert(dialog.includes('Kwota stała'), 'modal nie ma opcji prowizji kwotowej');
assert(dialog.includes('Nie ustawiono'), 'modal nie obsługuje pustej wartości jako Nie ustawiono');
assert(dialog.includes('buildCaseFinancePatch'), 'modal nie używa buildCaseFinancePatch');

const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
assert(buttons.includes('Edytuj wartość/prowizję'), 'brak wspólnego przycisku edycji finansów');
assert(buttons.includes('Dodaj wpłatę'), 'brak wspólnego przycisku dodawania wpłaty');
assert(buttons.includes('Otwórz sprawę'), 'brak przycisku otwarcia sprawy');

const financeMini = read('src/components/finance/FinanceMiniSummary.tsx');
assert(financeMini.includes('FIN-13_CLIENT_FINANCES_ARE_CASE_FINANCES'), 'FinanceMiniSummary nie ma markeru FIN-13');
assert(financeMini.includes('Finanse klienta'), 'brak nagłówka Finanse klienta');
assert(financeMini.includes('Suma wartości spraw'), 'brak sumy wartości spraw');
assert(financeMini.includes('Suma wpłat klienta'), 'brak sumy wpłat klienta');
assert(financeMini.includes('Suma pozostała'), 'brak sumy pozostałej');
assert(financeMini.includes('Suma prowizji należnej'), 'brak sumy prowizji należnej');
assert(financeMini.includes('Suma prowizji zapłaconej'), 'brak sumy prowizji zapłaconej');
assert(financeMini.includes('Lista spraw z finansami'), 'brak listy spraw z finansami');
assert(financeMini.includes('getCaseFinanceSummary(caseRecord, casePayments)'), 'sprawy klienta nie są liczone przez getCaseFinanceSummary(case, paymentsForCase)');
assert(financeMini.includes('fetchCasesFromSupabase({ clientId: resolvedClientId })'), 'brak pobierania spraw klienta przez fetchCasesFromSupabase({ clientId })');
assert(financeMini.includes('fetchPaymentsFromSupabase({ clientId: resolvedClientId })'), 'brak pobierania płatności klienta przez fetchPaymentsFromSupabase({ clientId })');
assert(financeMini.includes('updateCaseInSupabase(updatePayload)'), 'edycja finansów klienta nie zapisuje konkretnej sprawy przez updateCaseInSupabase');
assert(financeMini.includes('createPaymentInSupabase({'), 'dodawanie wpłaty z klienta nie używa createPaymentInSupabase');
assert(financeMini.includes('caseId: row.caseId'), 'wpłata z klienta nie wymusza caseId');
assert(financeMini.includes('Nie można dodać płatności bez wskazania sprawy'), 'brak blokady płatności bez sprawy');
assert(financeMini.includes('CaseFinanceEditorDialog'), 'klient nie używa wspólnego modala finansów sprawy');
assert(financeMini.includes('CaseFinanceActionButtons'), 'lista spraw klienta nie używa wspólnych przycisków');
assert(!/clientFinance\s*[:=]\s*\{/.test(financeMini), 'nie wolno tworzyć osobnego modelu finansów klienta');

const caseSettlement = read('src/components/finance/CaseSettlementPanel.tsx');
assert(caseSettlement.includes('CaseFinanceEditorDialog'), 'CaseSettlementPanel nie używa wspólnego modala finansów');
assert(caseSettlement.includes('CaseFinanceActionButtons'), 'CaseSettlementPanel nie używa wspólnych przycisków finansów');

const clientDetail = read('src/pages/ClientDetail.tsx');
assert(clientDetail.includes('ClientFinanceRelationSummary'), 'ClientDetail nie renderuje/importuje finansów klienta');
assert(clientDetail.includes('FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE') || clientDetail.includes('<ClientFinanceRelationSummary'), 'ClientDetail nie ma markeru lub renderu FIN-13');
const firstCases = clientDetail.indexOf("'cases'");
const firstSummary = clientDetail.indexOf("'summary'");
assert(firstCases >= 0 && firstSummary >= 0 && firstCases < firstSummary, 'zakładka Sprawy musi być przed Podsumowanie w modelu ClientDetail');

const cssFinance = read('src/styles/finance/closeflow-finance.css');
assert(cssFinance.includes('FIN-13_CLIENT_CASE_FINANCES_STYLES'), 'brak stylów FIN-13 w closeflow-finance.css');
const pkg = read('package.json');
assert(pkg.includes('check:fin13'), 'package.json nie ma check:fin13');
assert(pkg.includes('test:fin13'), 'package.json nie ma test:fin13');

if (errors.length) {
  console.error('FIN-13 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-13 check passed: finanse klienta są finansami spraw i używają wspólnego modala.');
