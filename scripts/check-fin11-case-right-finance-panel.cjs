const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
const errors = [];
function assert(cond, msg) { if (!cond) errors.push(msg); }
const caseDetail = read('src/pages/CaseDetail.tsx');
assert(caseDetail.includes('FIN-11_CASE_RIGHT_FINANCE_PANEL_VISIBLE_EDIT_VALUE_COMMISSION'), 'brak markeru FIN-11 w CaseDetail');
assert(caseDetail.includes('data-case-finance-panel="true"'), 'prawy panel sprawy nie ma data-case-finance-panel=true');
assert(caseDetail.includes('data-fin11-case-right-finance-panel="true"'), 'prawy panel sprawy nie ma markeru FIN-11');
assert(caseDetail.includes('Edytuj warto\u015B\u0107/prowizj\u0119'), 'brak przycisku Edytuj warto\u015B\u0107/prowizj\u0119');
assert(caseDetail.includes('Dodaj wp\u0142at\u0119'), 'brak przycisku Dodaj wp\u0142at\u0119');
assert(caseDetail.includes('Dodaj p\u0142atno\u015B\u0107 prowizji'), 'brak przycisku Dodaj p\u0142atno\u015B\u0107 prowizji');
assert(caseDetail.includes('Warto\u015B\u0107 sprawy i prowizja'), 'brak modala Warto\u015B\u0107 sprawy i prowizja');
assert(caseDetail.includes('Warto\u015B\u0107 sprawy / transakcji'), 'brak pola warto\u015Bci sprawy');
assert(caseDetail.includes('Model prowizji'), 'brak pola modelu prowizji');
assert(caseDetail.includes('Procent od warto\u015Bci'), 'brak opcji prowizji procentowej');
assert(caseDetail.includes('Kwota sta\u0142a'), 'brak opcji prowizji kwotowej');
assert(caseDetail.includes('Prowizja nale\u017Cna:'), 'brak podgl\u0105du prowizji nale\u017Cnej');
assert(caseDetail.includes('Po wp\u0142atach klienta pozostaje:'), 'brak podgl\u0105du pozosta\u0142o po wp\u0142atach klienta');
assert(caseDetail.includes('Do zap\u0142aty prowizji:'), 'brak podgl\u0105du prowizji do zap\u0142aty');
assert(caseDetail.includes('buildCaseFinancePatch({'), 'zapis nie korzysta z buildCaseFinancePatch');
assert(caseDetail.includes('updateCaseInSupabase(updatePayload)'), 'zapis nie wywo\u0142uje updateCaseInSupabase');
assert(caseDetail.includes('createPaymentInSupabase({'), 'dodawanie wp\u0142aty nie wywo\u0142uje createPaymentInSupabase');
assert(caseDetail.includes('setCaseData(nextCase)'), 'po zapisie nie aktualizuje setCaseData');
assert(caseDetail.includes('await reloadCaseFinanceData'), 'po zapisie nie prze\u0142adowuje danych finans\u00F3w');
assert(caseDetail.includes("toast.success('Zapisano warto\u015B\u0107 i prowizj\u0119 sprawy')"), 'brak toastu sukcesu dla zapisu warto\u015Bci/prowizji');
assert(caseDetail.includes('formatCaseFinanceValueOrUnset'), 'brak zabezpieczenia Nie ustawiono dla pustej warto\u015Bci');
assert(!caseDetail.includes('warto\u015B\u0107 sprawy w procentach'), 'nie wolno sugerowa\u0107 warto\u015Bci sprawy w procentach');
const css = read('src/styles/visual-stage13-case-detail-vnext.css');
assert(css.includes('FIN-11_CASE_RIGHT_FINANCE_PANEL_STYLES'), 'brak styl\u00F3w FIN-11');
const fin10 = read('scripts/check-fin10-case-finance-source-truth.cjs');
assert(fin10.includes('FIN-11 allows data-case-finance-panel'), 'FIN-10 guard nie zosta\u0142 dostosowany do naprawionego panelu FIN-11');
if (errors.length) {
  console.error('FIN-11 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-11 check passed: prawy panel finans\u00F3w sprawy ma edycj\u0119 warto\u015Bci/prowizji i akcje p\u0142atno\u015Bci.');
