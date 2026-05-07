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

function assertNotIncludes(file, needle, label) {
  const text = read(file);
  assert(!text.includes(needle), `Nadal znaleziono zakazany fragment: ${label || needle}`);
}

function assertIncludes(file, needle, label) {
  const text = read(file);
  assert(text.includes(needle), `Brakuje wymaganego fragmentu: ${label || needle}`);
}

const clientDetail = "src/pages/ClientDetail.tsx";
const css = "src/styles/visual-stage12-client-detail-vnext.css";

assertNotIncludes(clientDetail, "Klient ma przypięte sprawy i bieżący kontekst pracy.", "opis panelu klienta do usuniecia");
assertNotIncludes(clientDetail, "Klient ma przypiete sprawy i biezacy kontekst pracy.", "opis panelu klienta bez polskich znakow do usuniecia");

assertIncludes(css, "stage21c admin feedback client detail cleanup", "marker Stage21C CSS");
assertIncludes(css, '[data-client-finance-summary="true"]', "ukrycie prawego podsumowania finansow");
assertIncludes(css, '[data-client-left-finance-tile="true"]', "ukrycie lewego kafla finansow");
assertIncludes(css, '[data-client-operational-center="true"]', "ukrycie centrum operacyjnego klienta");
assertIncludes(css, '[data-client-nearest-planned-action="true"]', "ukrycie najblizszej akcji z lewego panelu");
assertIncludes(css, '[data-client-inline-contact-edit="true"]', "podniesienie danych klienta");
assertIncludes(css, '[data-client-recent-moves-panel="true"]', "podniesienie ostatnich ruchow");
assertIncludes(css, "display: none !important", "twarde ukrycie sekcji do skasowania");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nadal nie parsuje sie po strip BOM: ${err.message}`);
}
assert(
  pkg.scripts && pkg.scripts["check:stage21-client-detail-admin-feedback-layout"],
  "Brakuje npm script check:stage21-client-detail-admin-feedback-layout"
);

console.log("OK stage21 client detail admin feedback layout guard");
