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

const clientDetail = read("src/pages/ClientDetail.tsx");
const lucideImport = clientDetail.match(/import\s*\{([\s\S]*?)\}\s*from\s*'lucide-react';/);
assert(lucideImport, "Nie znaleziono importu lucide-react");
assert(/\bTrash2\b/.test(lucideImport[1]), "Trash2 musi byc w importach lucide-react");
assert(clientDetail.includes("<Trash2"), "ClientDetail musi uzywac <Trash2 />");
assert(clientDetail.includes("STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD"), "Brakuje guard Stage27E");
assert(clientDetail.includes("function getClientVisibleNotes("), "Brakuje helpera widocznych notatek");
assert(clientDetail.includes('data-client-notes-list="true"'), "Brakuje listy notatek klienta");
assert(clientDetail.includes('data-client-note-item="true"'), "Brakuje elementu notatki klienta");
assert(clientDetail.includes("window.addEventListener('closeflow:context-note-saved'"), "ClientDetail musi sluchac eventu notatki");
assert(clientDetail.includes("setActivities((previous) => [detail, ...previous])"), "Nowa notatka musi wejsc do widoku bez reloadu");

const noteDialog = read("src/components/ContextNoteDialog.tsx");
assert(noteDialog.includes("closeflow:context-note-saved"), "ContextNoteDialog musi miec event closeflow:context-note-saved");
assert(noteDialog.includes("window.dispatchEvent(new CustomEvent("), "ContextNoteDialog musi emitowac CustomEvent po zapisie");
assert(noteDialog.includes("await insertActivityToSupabase(input);"), "ContextNoteDialog musi nadal zapisywac activity");

const css = read("src/styles/visual-stage12-client-detail-vnext.css");
assert(css.includes("stage27e client notes event final"), "Brakuje CSS Stage27E");
assert(css.includes("[data-client-notes-list=\"true\"]"), "Brakuje styli listy notatek");
assert(css.includes("[data-client-note-item=\"true\"]"), "Brakuje styli elementu notatki");

const pkg = read("package.json");
assert(pkg.includes("check:stage27e-client-notes-event-final"), "Brakuje npm script Stage27E");
assert(!pkg.includes("check:stage27a-client-notes-trash2-finance-direction"), "Stary Stage27A script nie powinien zostac");
assert(!pkg.includes("check:stage27b-trash2-import-and-client-notes-final"), "Stary Stage27B script nie powinien zostac");
assert(!pkg.includes("check:stage27c-client-notes-full-repair"), "Stary Stage27C script nie powinien zostac");
assert(!pkg.includes("check:stage27d-client-notes-runtime-final"), "Stary Stage27D script nie powinien zostac");

console.log("OK stage27e client notes event final");
