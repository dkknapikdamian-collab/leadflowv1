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

assert(clientDetail.includes("STAGE27G_CLIENT_NOTE_LISTENER_ID_RUNTIME_FINAL_GUARD"), "Brakuje guard Stage27G");
assert(clientDetail.includes("window.addEventListener('closeflow:context-note-saved'"), "Brakuje listenera notatek");
assert(clientDetail.includes("setActivities((previous) => [detail, ...previous])"), "Listener musi dopisywac notatke");
assert(clientDetail.includes("const currentClientId = String(client?.id || '').trim();"), "Listener musi uzywac client?.id");

const listenerStart = clientDetail.indexOf("const handleContextNoteSaved");
const listenerEnd = clientDetail.indexOf("window.addEventListener('closeflow:context-note-saved'", listenerStart);
const listenerBlock = clientDetail.slice(Math.max(0, listenerStart), listenerEnd + 260);

assert(!listenerBlock.includes("client?.id || id"), "Listener nie moze zawierac client?.id || id");
assert(!listenerBlock.includes("String(id || '')"), "Listener nie moze zawierac String(id || '')");
assert(!listenerBlock.includes("[client?.id, id]"), "Listener nie moze zawierac dependency [client?.id, id]");
assert(!listenerBlock.includes("[id]"), "Listener nie moze zawierac dependency [id]");

const pkg = read("package.json");
assert(pkg.includes("check:stage27g-client-notes-id-runtime-final"), "Brakuje npm script Stage27G");
assert(!pkg.includes("check:stage27f-client-notes-id-runtime-hotfix"), "Stary failujacy Stage27F script nie powinien zostac");

console.log("OK stage27g client notes id runtime final");
