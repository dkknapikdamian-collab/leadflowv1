const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(file) {
  let text = fs.readFileSync(path.join(root, file), "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function firstExisting(files) {
  return files.find((file) => fs.existsSync(path.join(root, file)));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(file, needle, label) {
  const text = read(file);
  assert(text.includes(needle), `Brakuje wymaganego fragmentu: ${label || needle}`);
}

const clientDetail = "src/pages/ClientDetail.tsx";
const clientCss = "src/styles/visual-stage12-client-detail-vnext.css";
const globalCss = firstExisting(["src/index.css", "src/styles/index.css", "src/App.css"]);
assert(globalCss, "Brakuje globalnego pliku CSS");

assertIncludes(clientDetail, "STAGE26A_FEEDBACK_AFTER_4EC_GUARD", "guard Stage26A");
assertIncludes(clientDetail, "Trash2", "import/usage ikony kosza");
assertIncludes(clientDetail, 'className="client-detail-case-smart-delete-icon-button"', "czerwony ikonowy kosz");
assertIncludes(clientDetail, 'aria-label="Usuń sprawę"', "dostępny opis kosza");
assertIncludes(clientDetail, "Wejdź w sprawę", "główna akcja sprawy");
assertIncludes(clientDetail, 'data-client-case-smart-card="true"', "karta sprawy dalej istnieje");

assertIncludes(clientCss, "stage26a feedback after 4ec client detail", "CSS Stage26A ClientDetail");
assertIncludes(clientCss, ".client-detail-case-smart-main > strong", "kasowanie tytułu obsługa");
assertIncludes(clientCss, "display: none !important", "ukrycie tytułu/relacji");
assertIncludes(clientCss, ".client-detail-case-smart-meta", "przeniesienie statusu/kompletności");
assertIncludes(clientCss, ".client-detail-case-smart-delete-icon-button", "style czerwonego kosza");
assertIncludes(clientCss, ".client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)", "ukrycie sekcji relacji lead");

assertIncludes(globalCss, "stage26a right rail quick filters light cards", "globalny fix right rail");
assertIncludes(globalCss, ".ai-drafts-right-card", "AI drafts right card");
assertIncludes(globalCss, ".activity-right-card", "Activity right card");
assertIncludes(globalCss, ".activity-rail-button", "Activity rail button contrast");
assertIncludes(globalCss, "background: #ffffff !important", "białe tło kart");

assertIncludes("package.json", "check:stage26a-feedback-after-4ec-client-activity-ai-drafts", "npm script Stage26A");

console.log("OK stage26a feedback after 4ec client activity ai drafts");
