const fs = require('node:fs');
const path = require('node:path');
const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage13-case-detail-vnext.css');
function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Brak pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error('Brak: ' + label + ' (' + needle + ')');
}
function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error('Zakazany fragment: ' + label + ' (' + needle + ')');
}
const source = read(casePath);
const css = read(cssPath);
assertIncludes(source, 'STAGE14D_REAL_CASE_HISTORY_REPAIR3', 'guard Stage14D Repair3 w CaseDetail');
assertIncludes(source, 'type CaseHistoryItem = {', 'typ CaseHistoryItem');
assertIncludes(source, "kind: 'note' | 'task' | 'event' | 'payment' | 'status' | 'case';", 'rodzaje historii');
assertIncludes(source, 'function buildCaseHistoryItemsStage14D', 'builder historii sprawy');
assertIncludes(source, 'getCaseActivityHistoryItemStage14D', 'mapowanie aktywności');
assertIncludes(source, 'getPaymentAmount(payment)', 'mapowanie wpłat');
assertIncludes(source, 'getTaskMainDate(task)', 'mapowanie tasków');
assertIncludes(source, 'getEventMainDate(event)', 'mapowanie wydarzeń');
assertIncludes(source, 'data-case-history-list="true"', 'sekcja historii');
assertIncludes(source, '<h2>Historia sprawy</h2>', 'nagłówek historii');
assertIncludes(source, 'caseHistoryItems.slice(0, 10).map', 'render 10 wpisów');
assertIncludes(source, 'title={item.body}', 'tooltip body');
assertIncludes(source, "formatDate(item.occurredAt, 'Brak daty')", 'data wpisu');
assertIncludes(source, 'Brak historii sprawy.', 'pusty stan');
assertNotIncludes(source, '>Zapis operacyjny sprawy<', 'generyczny opis nie może być renderowany');
assertNotIncludes(source, '>Najważniejsze działania<', 'stary nagłówek nie powinien zostać');
assertIncludes(css, 'STAGE14D_REAL_CASE_HISTORY_REPAIR3', 'guard CSS');
assertIncludes(css, '.case-history-row', 'CSS row');
assertIncludes(css, 'text-overflow: ellipsis;', 'ellipsis');
assertIncludes(css, 'white-space: nowrap;', 'jedna linia');
assertIncludes(css, '.case-history-row time', 'czas wpisu');
console.log('✔ Stage14D Repair3 real CaseDetail history guard passed');
