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

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function patchClientDetail() {
  const file = path.join(root, "src", "pages", "ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  const replacements = [
    ["Ostatnie ruchy", "Roadmapa"],
    ["Historia pozyskania", "Aktywne sprawy"],
    ["Pierwszy kontakt, \u017Ar\u00F3d\u0142o i po\u0142\u0105czenie z leadem \u017Ar\u00F3d\u0142owym.", "Aktywne sprawy klienta i przej\u015Bcie do prowadzenia tematu."],
    ["Jedno miejsce pokazuj\u0105ce, sk\u0105d przyszed\u0142 klient. Bez dublowania przej\u015B\u0107 do tego samego leada.", "Aktywne sprawy klienta. Wejd\u017A w spraw\u0119, \u017Ceby prowadzi\u0107 zadania, wydarzenia i notatki."],
    ["Brak osobnej notatki. Dodaj, je\u015Bli jest co\u015B wa\u017Cnego.", ""],
    ["Otw\u00F3rz spraw\u0119", "Przejd\u017A do sprawy"],
  ];

  for (const [from, to] of replacements) {
    text = replaceAll(text, from, to);
  }

  // Gdy wcze\u015Bniejsze paczki zostawi\u0142y pusty string w ternary, niech UI nie pokazuje pustego opisu.
  text = text.replace(/\?\s*''\s*:\s*'Brak spraw przypi\u0119tych do klienta\.'/g, "? 'Brak dodatkowego opisu.' : 'Brak spraw przypi\u0119tych do klienta.'");

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail copy for Stage22A.");
  } else {
    console.log("ClientDetail copy already Stage22A-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  const marker = "/* stage22a client detail feedback ui cleanup */";
  const block = `
${marker}
.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles {
  gap: 10px !important;
  min-height: 0 !important;
}

.client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {
  min-height: 118px !important;
  padding: 12px 14px !important;
  border-radius: 18px !important;
}

.client-detail-vnext-page .entity-overview-tile-head {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  min-height: 24px !important;
}

.client-detail-vnext-page .entity-overview-tile-icon {
  width: 26px !important;
  height: 26px !important;
  flex: 0 0 26px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.client-detail-vnext-page .entity-overview-tile strong {
  font-size: 17px !important;
  line-height: 1.15 !important;
}

.client-detail-vnext-page .entity-overview-tile p,
.client-detail-vnext-page .entity-overview-metric-row {
  font-size: 12px !important;
  line-height: 1.3 !important;
}

.client-detail-vnext-page .client-detail-note-card,
.client-detail-vnext-page .client-detail-note-card *:not(svg):not(path) {
  color: #172033 !important;
}

.client-detail-vnext-page .client-detail-note-card .client-detail-note-text:empty,
.client-detail-vnext-page .client-detail-note-card .client-detail-note-text[data-empty="true"] {
  display: none !important;
}

.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {
  color: #334155 !important;
  opacity: 1 !important;
}

.client-detail-vnext-page .client-detail-note-card button,
.client-detail-vnext-page .client-detail-note-card a {
  color: #0f172a !important;
}

.client-detail-vnext-page [data-client-relations-acquisition-only="true"] {
  display: none !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card {
  max-height: 360px !important;
  overflow: auto !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card h2,
.client-detail-vnext-page .client-detail-recent-moves-card h3,
.client-detail-vnext-page .client-detail-recent-moves-card [class*="title"] {
  color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-completeness-card a,
.client-detail-vnext-page .client-detail-completeness-card .client-detail-open-case-link,
.client-detail-vnext-page .client-detail-top-cards-side a[href*="/cases/"] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 34px !important;
  padding: 8px 12px !important;
  margin-top: 8px !important;
  border-radius: 999px !important;
  background: #0f172a !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  text-decoration: none !important;
}

@media (max-width: 760px) {
  aside.sidebar[data-shell-sidebar="true"],
  aside.sidebar {
    width: 176px !important;
    min-width: 176px !important;
  }

  aside.sidebar[data-shell-sidebar="true"] a,
  aside.sidebar[data-shell-sidebar="true"] button,
  aside.sidebar a,
  aside.sidebar button {
    gap: 7px !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    font-size: 11px !important;
    line-height: 1.15 !important;
  }

  aside.sidebar[data-shell-sidebar="true"] svg,
  aside.sidebar svg {
    width: 15px !important;
    height: 15px !important;
    flex: 0 0 15px !important;
  }

  aside.sidebar[data-shell-sidebar="true"] span,
  aside.sidebar[data-shell-sidebar="true"] small,
  aside.sidebar[data-shell-sidebar="true"] strong,
  aside.sidebar span,
  aside.sidebar small,
  aside.sidebar strong {
    display: inline !important;
    opacity: 1 !important;
    visibility: visible !important;
    max-width: 116px !important;
    white-space: normal !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {
    min-height: 104px !important;
    padding: 10px 12px !important;
  }

  .client-detail-vnext-page .entity-overview-tile strong {
    font-size: 15px !important;
  }
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
  console.log("Patched Stage22A CSS.");
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
  pkg.scripts["check:stage22a-client-detail-feedback-ui-cleanup"] = "node scripts/check-stage22a-client-detail-feedback-ui-cleanup.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage22A.");
}

patchClientDetail();
patchCss();
patchPackageJson();
console.log("Stage22A repair complete.");
