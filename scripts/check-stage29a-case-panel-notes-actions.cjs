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
assert(clientDetail.includes("STAGE29A_CLIENT_NOTE_ACTIONS_GUARD"), "Brakuje guard Stage29A notes");
assert(clientDetail.includes("Eye"), "Brakuje ikony Eye");
assert(clientDetail.includes("Pin"), "Brakuje ikony Pin");
assert(clientDetail.includes("updateActivityInSupabase"), "Brakuje updateActivityInSupabase");
assert(clientDetail.includes("deleteActivityFromSupabase"), "Brakuje deleteActivityFromSupabase");
assert(clientDetail.includes("handlePreviewClientNote"), "Brakuje podgladu notatki");
assert(clientDetail.includes("handleEditClientNote"), "Brakuje edycji notatki");
assert(clientDetail.includes("handleDeleteClientNote"), "Brakuje usuwania notatki");
assert(clientDetail.includes("handleToggleClientNotePin"), "Brakuje pinowania notatki");
assert(clientDetail.includes("client-detail-note-item-toolbar"), "Brakuje toolbaru notatki");
assert(clientDetail.includes("data-client-note-pinned"), "Brakuje data-client-note-pinned");
assert(clientDetail.includes("getClientNotesForRender"), "Brakuje sortowania pinezek na gore");
assert(!clientDetail.includes("client?.id || id"), "Nie wolno przywrocic client?.id || id");

const clientCss = read("src/styles/visual-stage12-client-detail-vnext.css");
assert(clientCss.includes("stage29a client note actions"), "Brakuje CSS Stage29A notes");
assert(clientCss.includes(".client-detail-note-item-toolbar"), "Brakuje CSS toolbaru notatki");
assert(clientCss.includes("[data-client-note-pinned=\"true\"]"), "Brakuje CSS przypietej notatki");

const caseCss = read("src/styles/visual-stage13-case-detail-vnext.css");
assert(caseCss.includes("stage29a case right rail light panel"), "Brakuje CSS Stage29A case rail");
assert(caseCss.includes("aside.case-detail-right-rail"), "Brakuje selektora aside case right rail");
assert(caseCss.includes("[data-case-create-actions-panel=\"true\"]"), "Brakuje selektora panelu dodaj do sprawy");
assert(caseCss.includes("background: transparent !important"), "Brakuje transparentnego tla raila");
assert(caseCss.includes("background: #ffffff !important"), "Brakuje bialego tla kart");

const pkg = read("package.json");
assert(pkg.includes("check:stage29a-case-panel-notes-actions"), "Brakuje npm script Stage29A");

console.log("OK stage29a case panel notes actions");
