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

assertIncludes(clientDetail, "Roadmapa", "zmiana Ostatnie ruchy na Roadmapa");
assertIncludes(clientDetail, "Aktywne sprawy", "zmiana Historia pozyskania na Aktywne sprawy");
assertIncludes(clientDetail, "Przejdź do sprawy", "copy przycisku przejscia do sprawy");
assertNotIncludes(clientDetail, "Ostatnie ruchy", "stara nazwa panelu ostatnich ruchow");
assertNotIncludes(clientDetail, "Historia pozyskania", "stara sekcja historia pozyskania");
assertNotIncludes(clientDetail, "Brak osobnej notatki. Dodaj, jeśli jest coś ważnego.", "pusty opis notatki do skasowania");

assertIncludes(css, "stage22a client detail feedback ui cleanup", "marker CSS Stage22A");
assertIncludes(css, ".client-detail-note-card", "kontrast notatek");
assertIncludes(css, ".client-detail-note-text:empty", "ukrywanie pustej notatki");
assertIncludes(css, "[data-client-relations-acquisition-only=\"true\"]", "ukrycie acquisition-only panelu");
assertIncludes(css, "aside.sidebar[data-shell-sidebar=\"true\"]", "mobile sidebar labels");
assertIncludes(css, ".client-detail-top-tile.entity-overview-tile", "kompaktowe kafelki top tiles");
assertIncludes(css, ".client-detail-completeness-card", "styl przycisku przejdz do sprawy");

const packageText = read("package.json");
let pkg;
try {
  pkg = JSON.parse(packageText);
} catch (err) {
  throw new Error(`package.json nie parsuje sie po strip BOM: ${err.message}`);
}
assert(
  pkg.scripts && pkg.scripts["check:stage22a-client-detail-feedback-ui-cleanup"],
  "Brakuje npm script check:stage22a-client-detail-feedback-ui-cleanup"
);

console.log("OK stage22a client detail feedback ui cleanup guard");
