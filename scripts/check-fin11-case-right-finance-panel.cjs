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
assert(caseDetail.includes('Edytuj wartość/prowizję'), 'brak przycisku Edytuj wartość/prowizję');
assert(caseDetail.includes('Dodaj wpłatę'), 'brak przycisku Dodaj wpłatę');
assert(caseDetail.includes('Dodaj płatność prowizji'), 'brak przycisku Dodaj płatność prowizji');
assert(caseDetail.includes('Wartość sprawy i prowizja'), 'brak modala Wartość sprawy i prowizja');
assert(caseDetail.includes('Wartość sprawy / transakcji'), 'brak pola wartości sprawy');
assert(caseDetail.includes('Model prowizji'), 'brak pola modelu prowizji');
assert(caseDetail.includes('Procent od wartości'), 'brak opcji prowizji procentowej');
assert(caseDetail.includes('Kwota stała'), 'brak opcji prowizji kwotowej');
assert(caseDetail.includes('Prowizja należna:'), 'brak podglądu prowizji należnej');
assert(caseDetail.includes('Po wpłatach klienta pozostaje:'), 'brak podglądu pozostało po wpłatach klienta');
assert(caseDetail.includes('Do zapłaty prowizji:'), 'brak podglądu prowizji do zapłaty');
assert(caseDetail.includes('buildCaseFinancePatch({'), 'zapis nie korzysta z buildCaseFinancePatch');
assert(caseDetail.includes('updateCaseInSupabase(updatePayload)'), 'zapis nie wywołuje updateCaseInSupabase');
assert(caseDetail.includes('createPaymentInSupabase({'), 'dodawanie wpłaty nie wywołuje createPaymentInSupabase');
assert(caseDetail.includes('setCaseData(nextCase)'), 'po zapisie nie aktualizuje setCaseData');
assert(caseDetail.includes('await reloadCaseFinanceData'), 'po zapisie nie przeładowuje danych finansów');
assert(caseDetail.includes("toast.success('Zapisano wartość i prowizję sprawy')"), 'brak toastu sukcesu dla zapisu wartości/prowizji');
assert(caseDetail.includes('formatCaseFinanceValueOrUnset'), 'brak zabezpieczenia Nie ustawiono dla pustej wartości');
assert(!caseDetail.includes('wartość sprawy w procentach'), 'nie wolno sugerować wartości sprawy w procentach');
const css = read('src/styles/visual-stage13-case-detail-vnext.css');
assert(css.includes('FIN-11_CASE_RIGHT_FINANCE_PANEL_STYLES'), 'brak stylów FIN-11');
const fin10 = read('scripts/check-fin10-case-finance-source-truth.cjs');
assert(fin10.includes('FIN-11 allows data-case-finance-panel'), 'FIN-10 guard nie został dostosowany do naprawionego panelu FIN-11');
if (errors.length) {
  console.error('FIN-11 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-11 check passed: prawy panel finansów sprawy ma edycję wartości/prowizji i akcje płatności.');
