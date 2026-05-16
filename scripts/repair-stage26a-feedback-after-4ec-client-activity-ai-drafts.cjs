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

  if (!text.includes("Trash2,")) {
    text = text.replace("  Target,\n  UserRound,", "  Target,\n  Trash2,\n  UserRound,");
  }

  if (!text.includes("STAGE26A_FEEDBACK_AFTER_4EC_GUARD")) {
    const anchor =
      text.includes("const STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD")
        ? "const STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD = 'client detail JSX fragment build fix';"
        : "const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';";
    text = text.replace(
      anchor,
      `${anchor}\nconst STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';`
    );
  }

  // Kosz jako czerwona ikonka zamiast tekstu "Usu\u0144".
  text = text.replace(
    /<Button type="button" size="sm" variant="outline" onClick=\{\(\) => toast\.info\('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy\.'\)\}>\s*Usu\u0144\s*<\/Button>/g,
    `<Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="client-detail-case-smart-delete-icon-button"
                              aria-label="Usu\u0144 spraw\u0119"
                              title="Usu\u0144 spraw\u0119"
                              onClick={() => toast.info('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy.')}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>`
  );

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail Stage26A.");
  } else {
    console.log("ClientDetail already Stage26A-ready.");
  }
}

function patchClientCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  const marker = "/* stage26a feedback after 4ec client detail */";
  const block = `
${marker}
.client-detail-vnext-page [data-client-case-smart-card="true"] {
  grid-template-columns: minmax(0, 1.12fr) minmax(130px, 0.75fr) auto !important;
  align-items: start !important;
}

.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main {
  display: flex !important;
  flex-direction: column !important;
  gap: 7px !important;
}

.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-meta {
  order: 0 !important;
  margin-bottom: 2px !important;
}

.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-kicker {
  order: 1 !important;
}

.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main > strong {
  display: none !important;
}

.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,
.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button {
  width: 34px !important;
  min-width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  padding: 0 !important;
  border-radius: 999px !important;
  border: 1px solid #fecaca !important;
  background: #fef2f2 !important;
  color: #dc2626 !important;
  -webkit-text-fill-color: #dc2626 !important;
}

.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg,
.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button svg {
  width: 16px !important;
  height: 16px !important;
  color: #dc2626 !important;
  stroke: #dc2626 !important;
  opacity: 1 !important;
}

.client-detail-vnext-page .client-detail-case-smart-delete-icon-button:hover {
  background: #fee2e2 !important;
  border-color: #fca5a5 !important;
  color: #b91c1c !important;
  -webkit-text-fill-color: #b91c1c !important;
}

.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {
  display: none !important;
}

.client-detail-vnext-page .client-detail-tab-panel .client-detail-relations-list:not(.client-detail-relations-list-acquisition-only) {
  display: none !important;
}

@media (max-width: 900px) {
  .client-detail-vnext-page [data-client-case-smart-card="true"] {
    grid-template-columns: 1fr !important;
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
  console.log("Patched ClientDetail CSS Stage26A.");
}

function patchGlobalCss() {
  const candidates = [
    path.join(root, "src", "index.css"),
    path.join(root, "src", "styles", "index.css"),
    path.join(root, "src", "App.css"),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  if (!file) throw new Error("Nie znaleziono globalnego CSS: src/index.css / src/styles/index.css / src/App.css");

  let text = readUtf8NoBom(file);
  const marker = "/* stage26a right rail quick filters light cards */";
  const block = `
${marker}
.ai-drafts-right-rail,
.activity-right-rail {
  background: transparent !important;
}

.ai-drafts-right-card,
.activity-right-card,
.right-card.ai-drafts-right-card,
.right-card.activity-right-card {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1px solid rgba(148, 163, 184, 0.42) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;
  -webkit-text-fill-color: #0f172a !important;
}

.ai-drafts-right-card::before,
.ai-drafts-right-card::after,
.activity-right-card::before,
.activity-right-card::after {
  display: none !important;
  background: transparent !important;
}

.ai-drafts-right-card *,
.activity-right-card *,
.activity-rail-button,
.activity-rail-button *,
.ai-drafts-rail-button,
.ai-drafts-rail-button * {
  color: #0f172a !important;
  stroke: #0f172a !important;
  opacity: 1 !important;
  visibility: visible !important;
  -webkit-text-fill-color: #0f172a !important;
}

.activity-rail-button,
.ai-drafts-rail-button,
.activity-right-card button,
.ai-drafts-right-card button {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;
}

.activity-rail-button:hover,
.ai-drafts-rail-button:hover,
.activity-right-card button:hover,
.ai-drafts-right-card button:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  color: #020617 !important;
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
  console.log(`Patched global CSS Stage26A: ${path.relative(root, file)}`);
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
  pkg.scripts["check:stage26a-feedback-after-4ec-client-activity-ai-drafts"] =
    "node scripts/check-stage26a-feedback-after-4ec-client-activity-ai-drafts.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage26A.");
}

patchClientDetail();
patchClientCss();
patchGlobalCss();
patchPackageJson();
console.log("Stage26A repair complete.");
