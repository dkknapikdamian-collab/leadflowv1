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

assertIncludes(clientDetail, "STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD", "guard Stage25B");
assertIncludes(clientDetail, "function getCaseValueLabel(caseRecord: any)", "wartosc sprawy helper");
assertIncludes(clientDetail, "Sprawa obsługowa", "fallback bez nazwy klienta");
assertIncludes(clientDetail, 'data-client-case-smart-list="true"', "nowa lista spraw");
assertIncludes(clientDetail, 'data-client-case-smart-card="true"', "nowa karta sprawy");
assertIncludes(clientDetail, "Wartość sprawy", "wartosc sprawy w karcie");
assertIncludes(clientDetail, "Edytuj", "akcja edycji sprawy");
assertIncludes(clientDetail, "Usuń", "akcja usuniecia sprawy z komunikatem bezpiecznym");
assertNotIncludes(clientDetail, "<p>Lista spraw klienta. Wejdź w sprawę, żeby edytować nazwę, wartość, zadania i dalszą obsługę.</p>", "opis panelu spraw usuniety");

assertIncludes(css, "stage25b client detail feedback complete repair", "marker CSS Stage25B");
assertIncludes(css, ".client-detail-top-cards-side", "kasowanie panelu kompletności/finansów");
assertIncludes(css, ".client-detail-completeness-card", "kasowanie kompletności sprawy");
assertIncludes(css, ".client-detail-relations-list-acquisition-only", "ukrycie starego wiersza historii lead");
assertIncludes(css, "[data-client-case-smart-list=\"true\"]", "style nowej listy spraw");
assertIncludes(css, "[data-client-side-quick-actions=\"true\"] *", "kontrast szybkich akcji");
assertIncludes(css, ".client-detail-note-card .client-detail-note-text", "notatki na dole");
assertIncludes(css, "order: 30 !important", "notatka pod przyciskami");
assertIncludes(css, "max-height: 340px", "delikatnie powiekszona roadmapa");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nie parsuje sie po strip BOM: ${err.message}`);
}
assert(
  pkg.scripts && pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"],
  "Brakuje npm script check:stage25b-client-detail-feedback-complete-repair"
);
assert(
  !pkg.scripts["check:stage25a-client-detail-feedback-complete-verify"],
  "Nie powinno zostac stare check:stage25a z uszkodzonej paczki"
);

console.log("OK stage25b client detail feedback complete repair guard");
