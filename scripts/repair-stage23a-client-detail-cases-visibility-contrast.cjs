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
  const file = path.join(root, "src", "pages", "ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  // Stage22A ukry\u0142 panel acquisition-only CSS-em. W zak\u0142adce Sprawy to ma by\u0107 normalny panel listy spraw.
  text = text.replace(/data-client-relations-acquisition-only="true"/g, 'data-client-cases-list-panel="true"');

  // Ujednolicenie copy dla panelu spraw.
  text = text
    .replace(/Aktywne sprawy klienta i przej\u015Bcie do prowadzenia tematu\./g, "Lista spraw klienta z szybkim wej\u015Bciem do prowadzenia.")
    .replace(/Aktywne sprawy klienta\. Wejd\u017A w spraw\u0119, \u017Ceby prowadzi\u0107 zadania, wydarzenia i notatki\./g, "Lista spraw klienta. Wejd\u017A w spraw\u0119, \u017Ceby edytowa\u0107 nazw\u0119, warto\u015B\u0107, zadania i dalsz\u0105 obs\u0142ug\u0119.");

  // Dodajemy lekkie hinty przy panelu, bez udawania destrukcyjnego delete z poziomu klienta.
  if (!text.includes("STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD")) {
    text = text.replace(
      "const CLIENT_DETAIL_TOP_TILES_REPAIR6_GUARD = 'client-detail-top-tiles repair6 compact unified safe';",
      "const CLIENT_DETAIL_TOP_TILES_REPAIR6_GUARD = 'client-detail-top-tiles repair6 compact unified safe';\nconst STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';"
    );
  }

  // Je\u017Celi w panelu istniej\u0105 przyciski przej\u015Bcia do sprawy, nie zmieniamy logiki. Copy zostaje jednoznaczne.
  text = text.replace(/>Przejd\u017A do sprawy</g, ">Wejd\u017A w spraw\u0119<");

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail for Stage23A.");
  } else {
    console.log("ClientDetail already Stage23A-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  const marker = "/* stage23a client detail cases visibility contrast */";
  const block = `
${marker}
.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button,
.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button,
.client-detail-vnext-page button.client-detail-icon-button {
  width: 34px !important;
  min-width: 34px !important;
  height: 32px !important;
  min-height: 32px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 1 !important;
  visibility: visible !important;
  color: #0f172a !important;
  background: #ffffff !important;
  border: 1px solid #94a3b8 !important;
  border-radius: 10px !important;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12) !important;
}

.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button svg,
.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button svg,
.client-detail-vnext-page button.client-detail-icon-button svg {
  width: 16px !important;
  height: 16px !important;
  opacity: 1 !important;
  color: #0f172a !important;
  stroke: #0f172a !important;
}

.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button:hover,
.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button:hover,
.client-detail-vnext-page button.client-detail-icon-button:hover {
  background: #e2e8f0 !important;
  border-color: #64748b !important;
  color: #020617 !important;
}

.client-detail-vnext-page .client-detail-note-card button,
.client-detail-vnext-page .client-detail-note-card .inline-flex,
.client-detail-vnext-page .client-detail-note-card [role="button"] {
  width: 100% !important;
  justify-content: center !important;
  color: #0f172a !important;
  background: #ffffff !important;
  border: 1px solid #94a3b8 !important;
  opacity: 1 !important;
  visibility: visible !important;
  text-shadow: none !important;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.10) !important;
}

.client-detail-vnext-page .client-detail-note-card button *,
.client-detail-vnext-page .client-detail-note-card button svg,
.client-detail-vnext-page .client-detail-note-card .inline-flex *,
.client-detail-vnext-page .client-detail-note-card .inline-flex svg {
  color: #0f172a !important;
  stroke: #0f172a !important;
  opacity: 1 !important;
}

.client-detail-vnext-page .client-detail-note-card button:hover,
.client-detail-vnext-page .client-detail-note-card .inline-flex:hover {
  background: #e2e8f0 !important;
  color: #020617 !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {
  display: block !important;
  border: 1px solid rgba(148, 163, 184, 0.45) !important;
  background: #ffffff !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head h2 {
  color: #0f172a !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {
  color: #475569 !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] button,
.client-detail-vnext-page [data-client-cases-list-panel="true"] a {
  color: #0f172a !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button,
.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a {
  min-height: 32px !important;
  border: 1px solid #94a3b8 !important;
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08) !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child,
.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child {
  background: #0f172a !important;
  color: #ffffff !important;
  border-color: #0f172a !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child *,
.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child * {
  color: #ffffff !important;
  stroke: #ffffff !important;
}
`.trimEnd() + "\n";

  if (text.includes(marker)) {
    const start = text.indexOf(marker);
    const before = text.slice(0, start).replace(/\s*$/u, "\n\n");
    text = before + block;
  } else {
    text = text.replace(/\s*$/u, "\n\n" + block);
  }

  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched Stage23A CSS.");
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
  pkg.scripts["check:stage23a-client-detail-cases-visibility-contrast"] = "node scripts/check-stage23a-client-detail-cases-visibility-contrast.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage23A.");
}

patchClientDetail();
patchCss();
patchPackageJson();
console.log("Stage23A repair complete.");
