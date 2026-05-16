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

assertIncludes(clientDetail, "STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL", "guard Stage25C");
assertIncludes(clientDetail, "STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT", "compat dla starego Stage23A guarda");
assertIncludes(clientDetail, "Wejd\u017A w spraw\u0119", "tekst wymagany przez Stage23A i UI");
assertIncludes(clientDetail, "function getCaseValueLabel(caseRecord: any)", "helper wartosci sprawy");
assertIncludes(clientDetail, 'data-client-case-smart-list="true"', "nowa lista spraw");
assertIncludes(clientDetail, 'data-client-case-smart-card="true"', "nowa karta sprawy");
assertIncludes(clientDetail, "Warto\u015B\u0107 sprawy", "wartosc sprawy widoczna");
assertIncludes(clientDetail, "Usuwanie sprawy wymaga potwierdzenia w widoku sprawy.", "bezpieczne usuwanie bez destrukcyjnego delete");
assertNotIncludes(clientDetail, "<p>Lista spraw klienta. Wejd\u017A w spraw\u0119, \u017Ceby edytowa\u0107 nazw\u0119, warto\u015B\u0107, zadania i dalsz\u0105 obs\u0142ug\u0119.</p>", "opis panelu spraw usuniety");

assertIncludes(css, "stage25b client detail feedback complete repair", "CSS Stage25B");
assertIncludes(css, ".client-detail-top-cards-side", "ukrycie top-card kompletno\u015B\u0107/finanse");
assertIncludes(css, ".client-detail-relations-list-acquisition-only", "ukrycie starej historii pozyskania");
assertIncludes(css, "max-height: 340px", "roadmapa powiekszona");
assertIncludes(css, "order: 30 !important", "notatki na dole");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nie parsuje sie po strip BOM: ${err.message}`);
}
assert(pkg.scripts && pkg.scripts["check:stage25c-client-detail-guard-compat-final"], "Brakuje npm script Stage25C");
assert(pkg.scripts && pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"], "Brakuje npm script Stage25B");
assert(!pkg.scripts["check:stage25a-client-detail-feedback-complete-verify"], "Nie powinien zostac uszkodzony Stage25A script");

console.log("OK stage25c client detail guard compat final");
