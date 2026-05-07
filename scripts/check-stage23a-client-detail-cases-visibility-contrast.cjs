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

assertIncludes(clientDetail, "STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD", "guard Stage23A w ClientDetail");
assertIncludes(clientDetail, 'data-client-cases-list-panel="true"', "jawny panel listy spraw");
assertIncludes(clientDetail, "Wejdź w sprawę", "copy wejscia w sprawe");
assertNotIncludes(clientDetail, 'data-client-relations-acquisition-only="true"', "stary ukrywany panel acquisition-only w JSX");

assertIncludes(css, "stage23a client detail cases visibility contrast", "marker CSS Stage23A");
assertIncludes(css, ".client-detail-profile-card .client-detail-icon-button", "widoczne przyciski kopiowania");
assertIncludes(css, ".client-detail-note-card button", "kontrast przyciskow notatki");
assertIncludes(css, '[data-client-cases-list-panel="true"]', "widocznosc panelu spraw");
assertIncludes(css, "display: block !important", "wymuszenie widocznosci panelu spraw");
assertIncludes(css, "stroke: #0f172a", "widoczne ikony kopiowania");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nie parsuje sie po strip BOM: ${err.message}`);
}
assert(
  pkg.scripts && pkg.scripts["check:stage23a-client-detail-cases-visibility-contrast"],
  "Brakuje npm script check:stage23a-client-detail-cases-visibility-contrast"
);

console.log("OK stage23a client detail cases visibility contrast guard");
