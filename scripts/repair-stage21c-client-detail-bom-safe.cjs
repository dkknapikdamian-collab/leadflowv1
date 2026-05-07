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
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeClientPanelDescription() {
  const file = path.join(root, "src", "pages", "ClientDetail.tsx");
  ensureFile(file);

  let text = readUtf8NoBom(file);
  const before = text;

  const phrases = [
    "Klient ma przypięte sprawy i bieżący kontekst pracy.",
    "Klient ma przypiete sprawy i biezacy kontekst pracy.",
    "Klient ma przypiete sprawy i bieżący kontekst pracy.",
    "Klient ma przypięte sprawy i biezacy kontekst pracy.",
    "Klient ma przypi\u0119te sprawy i bie\u017c\u0105cy kontekst pracy."
  ];

  for (const phrase of phrases) {
    const rxParagraph = new RegExp(String.raw`<p\b[^>]*>\s*${escapeRegExp(phrase)}\s*<\/p>`, "gu");
    text = text.replace(rxParagraph, "");
    text = text.split(phrase).join("");
  }

  // Usuwa puste paragrafy/opisy po wcześniejszych próbach czyszczenia.
  text = text.replace(/<p\s+className=["']client-detail-[^"']*(?:description|subtitle|copy)[^"']*["']\s*>\s*<\/p>/gu, "");
  text = text.replace(/<p\s*>\s*<\/p>/gu, "");

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail copy.");
  } else {
    console.log("ClientDetail copy already clean or phrase not present.");
  }
}

function patchCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);

  let text = readUtf8NoBom(file);
  const marker = "/* stage21c admin feedback client detail cleanup */";
  const block = `
${marker}
.client-detail-vnext-page [data-client-finance-summary="true"],
.client-detail-vnext-page [data-client-left-finance-tile="true"],
.client-detail-vnext-page [data-client-operational-center="true"],
.client-detail-vnext-page [data-client-nearest-planned-action="true"],
.client-detail-vnext-page .client-detail-today-info-tile-finance,
.client-detail-vnext-page .client-detail-operational-center-card {
  display: none !important;
}

.client-detail-vnext-page .client-detail-left-rail {
  display: flex;
  flex-direction: column;
}

.client-detail-vnext-page [data-client-today-info-tiles="true"] {
  order: 0;
}

.client-detail-vnext-page [data-client-inline-contact-edit="true"],
.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"] {
  order: 1;
  margin-top: 0 !important;
}

.client-detail-vnext-page [data-client-recent-moves-panel="true"],
.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {
  order: 2;
  margin-top: 0 !important;
}

.client-detail-vnext-page .client-detail-right-rail [data-client-finance-summary="true"] {
  display: none !important;
}
`.trimEnd() + "\n";

  if (text.includes(marker)) {
    text = text.replace(new RegExp(`${escapeRegExp(marker)}[\\s\\S]*?(?=\\n\\/\\* stage|\\n@media|\\n$)`, "u"), block.trimEnd());
  } else {
    text = text.replace(/\s*$/u, "\n\n" + block);
  }

  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched ClientDetail layout CSS.");
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);

  const raw = readUtf8NoBom(file);
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (err) {
    throw new Error(`package.json parse failed after BOM strip: ${err.message}`);
  }

  pkg.scripts = pkg.scripts || {};
  pkg.scripts["check:stage21-client-detail-admin-feedback-layout"] = "node scripts/check-stage21-client-detail-admin-feedback-layout.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json without BOM.");
}

removeClientPanelDescription();
patchCss();
patchPackageJson();
console.log("Stage21C repair complete.");
