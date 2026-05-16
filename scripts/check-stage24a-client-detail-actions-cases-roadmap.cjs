const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(file) {
  let text = fs.readFileSync(path.join(root, file), "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(file, needle, label) {
  const text = read(file);
  assert(text.includes(needle), `Brakuje wymaganego fragmentu: ${label || needle}`);
}

function assertNotIncludes(file, needle, label) {
  const text = read(file);
  assert(!text.includes(needle), `Nadal znaleziono zakazany fragment: ${label || needle}`);
}

const clientDetail = "src/pages/ClientDetail.tsx";
const css = "src/styles/visual-stage12-client-detail-vnext.css";

assertIncludes(clientDetail, "STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD", "guard Stage24A w ClientDetail");
assertIncludes(clientDetail, 'data-client-side-quick-actions="true"', "boczny kafel szybkich akcji");
assertIncludes(clientDetail, "openContextQuickAction({", "uzycie tego samego hosta szybkich akcji");
assertIncludes(clientDetail, "kind: 'task'", "szybka akcja zadanie");
assertIncludes(clientDetail, "kind: 'event'", "szybka akcja wydarzenie");
assertIncludes(clientDetail, "leadId: firstSourceLead?.id", "prefill leadId przy task/event");
assertIncludes(clientDetail, "caseId: mainCase?.id", "prefill caseId przy task/event");
assertIncludes(clientDetail, 'data-client-summary-source-lead-panel="true"', "panel summary do ukrycia");
assertNotIncludes(clientDetail, "<p>Lista spraw klienta. Wejd\u017A w spraw\u0119, \u017Ceby edytowa\u0107 nazw\u0119, warto\u015B\u0107, zadania i dalsz\u0105 obs\u0142ug\u0119.</p>", "opis panelu spraw do skasowania");

assertIncludes(css, "stage24a client detail actions cases roadmap", "marker CSS Stage24A");
assertIncludes(css, '[data-client-summary-source-lead-panel="true"]', "ukrycie summary source lead panel");
assertIncludes(css, '[data-client-side-quick-actions="true"]', "style bocznego kafla szybkich akcji");
assertIncludes(css, ".client-detail-side-quick-actions-grid", "grid szybkich akcji");
assertIncludes(css, ".client-detail-recent-moves-list::before", "roadmapa jako timeline");
assertIncludes(css, "max-height: 302px", "roadmapa bez powiekszania kafelka");
assertIncludes(css, "-webkit-text-fill-color: #0f172a", "twardy kontrast przyciskow notatki");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nie parsuje sie po strip BOM: ${err.message}`);
}
assert(
  pkg.scripts && pkg.scripts["check:stage24a-client-detail-actions-cases-roadmap"],
  "Brakuje npm script check:stage24a-client-detail-actions-cases-roadmap"
);

console.log("OK stage24a client detail actions cases roadmap guard");
