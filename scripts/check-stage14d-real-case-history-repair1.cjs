const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage13-case-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`Brak: ${label} (${needle})`);
}
function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error(`Zakazany fragment po 14D: ${label} (${needle})`);
}

const source = read(casePath);
const css = read(cssPath);

assertIncludes(source, 'STAGE14D_REAL_CASE_HISTORY_REPAIR1', 'guard Stage14D Repair1');
assertIncludes(source, 'type CaseHistoryItem = {', 'typ CaseHistoryItem');
assertIncludes(source, 'const caseHistoryItems = useMemo<CaseHistoryItem[]>', 'caseHistoryItems useMemo');
assertIncludes(source, 'getCaseActivityHistoryItemStage14D', 'mapowanie aktywnosci');
assertIncludes(source, 'for (const activity of activities)', 'aktywnosci w historii');
assertIncludes(source, 'for (const task of tasks)', 'taski w historii');
assertIncludes(source, 'for (const event of events)', 'wydarzenia w historii');
assertIncludes(source, 'for (const payment of visibleCasePayments)', 'wpłaty w historii');
assertIncludes(source, 'for (const item of items)', 'checklisty w historii');
assertIncludes(source, 'data-case-history-list="true"', 'render sekcji historii');
assertIncludes(source, '<h2>Historia sprawy</h2>', 'naglowek Historia sprawy');
assertIncludes(source, 'caseHistoryItems.slice(0, 10).map', 'limit renderu historii');
assertIncludes(source, 'title={item.body}', 'tooltip z realnym body');
assertIncludes(source, '<span className="case-history-kind">{item.title}</span>', 'tytul wpisu historii');
assertIncludes(source, '<time>{formatDate(item.occurredAt', 'data wpisu historii');
assertIncludes(source, "title: 'Notatka'", 'notatki mapowane jako Notatka');
assertIncludes(source, "title: 'Zadanie wykonane'", 'zadania wykonane mapowane');
assertIncludes(source, "title: 'Wydarzenie'", 'wydarzenia mapowane');
assertIncludes(source, "title: 'Wpłata'", 'wpłaty mapowane');
assertIncludes(source, "title: 'Zmiana statusu'", 'status mapowany');
assertNotIncludes(source, 'Zapis operacyjny sprawy', 'nie wolno pokazywać atrapy historii');
assertNotIncludes(source, '<h2>Najważniejsze działania</h2>', 'stary naglowek Najważniejsze działania usuniety');
assertNotIncludes(source, 'workItems.length === 0 ? (\n                    <p>Brak działań do pokazania', 'stara lista workItems nie powinna byc sekcja historii');

assertIncludes(css, 'STAGE14D_REAL_CASE_HISTORY_REPAIR1', 'guard CSS Stage14D');
assertIncludes(css, '.case-history-row', 'CSS case-history-row');
assertIncludes(css, 'text-overflow: ellipsis;', 'ellipsis dla body');
assertIncludes(css, 'white-space: nowrap;', 'jeden wiersz historii');
assertIncludes(css, '.case-history-row time', 'czas wpisu');

console.log('✔ Stage14D Repair1 real CaseDetail history guard passed');
