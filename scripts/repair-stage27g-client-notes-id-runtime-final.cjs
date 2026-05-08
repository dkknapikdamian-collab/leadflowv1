const fs = require("fs");
const path = require("path");

const root = process.cwd();

function readUtf8NoBom(file) {
  let text = fs.readFileSync(file, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeUtf8NoBom(file, text) {
  fs.writeFileSync(file, text, "utf8");
}

function ensureFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

function patchClientDetail() {
  const file = path.join(root, "src/pages/ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  if (!text.includes("STAGE27G_CLIENT_NOTE_LISTENER_ID_RUNTIME_FINAL_GUARD")) {
    const anchor = text.includes("const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD")
      ? "const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';"
      : text.includes("const STAGE26A_FEEDBACK_AFTER_4EC_GUARD")
        ? "const STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';"
        : "const STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD = 'client detail JSX fragment build fix';";
    text = text.replace(anchor, `${anchor}\nconst STAGE27G_CLIENT_NOTE_LISTENER_ID_RUNTIME_FINAL_GUARD = 'client note listener uses client id only';`);
  }

  text = text
    .replace(/const currentClientId = String\(client\?\.id\s*\|\|\s*id\s*\|\|\s*''\)\.trim\(\);/g, "const currentClientId = String(client?.id || '').trim();")
    .replace(/const currentClientId = String\(id\s*\|\|\s*''\)\.trim\(\);/g, "const currentClientId = String(client?.id || '').trim();")
    .replace(/\}, \[client\?\.id,\s*id\]\);/g, "}, [client?.id]);")
    .replace(/\}, \[id\]\);/g, "}, [client?.id]);");

  if (!text.includes("window.addEventListener('closeflow:context-note-saved'")) {
    throw new Error("Brakuje listenera closeflow:context-note-saved w ClientDetail.");
  }

  const listenerStart = text.indexOf("const handleContextNoteSaved");
  const listenerEnd = text.indexOf("window.addEventListener('closeflow:context-note-saved'", listenerStart);
  const listenerBlock = text.slice(Math.max(0, listenerStart), listenerEnd + 220);
  const forbiddenPatterns = [
    "client?.id || id",
    "String(id || '')",
    "[client?.id, id]",
    "[id]",
  ];
  for (const pattern of forbiddenPatterns) {
    if (listenerBlock.includes(pattern)) {
      throw new Error(`Listener notatek nadal zawiera zakazany wzorzec: ${pattern}`);
    }
  }

  if (!listenerBlock.includes("String(client?.id || '').trim()")) {
    throw new Error("Listener notatek nie uzywa String(client?.id || '').trim().");
  }

  if (text !== before) {
    writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
    console.log("Patched ClientDetail Stage27G.");
  } else {
    console.log("ClientDetail already Stage27G-ready.");
  }
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);
  const pkg = JSON.parse(readUtf8NoBom(file));
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts["check:stage27f-client-notes-id-runtime-hotfix"];
  pkg.scripts["check:stage27g-client-notes-id-runtime-final"] = "node scripts/check-stage27g-client-notes-id-runtime-final.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage27G.");
}

patchClientDetail();
patchPackageJson();
console.log("Stage27G repair complete.");
