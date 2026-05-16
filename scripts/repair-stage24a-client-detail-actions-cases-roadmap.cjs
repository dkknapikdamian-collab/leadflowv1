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

  if (!text.includes("STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD")) {
    text = text.replace(
      "const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';",
      "const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';\nconst STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';"
    );
  }

  // Lepszy fallback tytu\u0142u sprawy: gdy tytu\u0142 jest tylko nazw\u0105 klienta/leada, poka\u017C robocz\u0105 nazw\u0119 sprawy.
  text = text.replace(
    /function getCaseTitle\(caseRecord: any\) \{\n\s*return String\(caseRecord\?\.title \|\| caseRecord\?\.clientName \|\| 'Sprawa klienta'\);\n\}/,
    `function getCaseTitle(caseRecord: any) {
  const rawTitle = asText(caseRecord?.title) || asText(caseRecord?.name);
  const clientName = asText(caseRecord?.clientName);
  if (rawTitle && clientName && rawTitle.toLowerCase() === clientName.toLowerCase()) {
    return \`\${clientName} - obs\u0142uga\`;
  }
  return String(rawTitle || clientName || 'Sprawa klienta');
}`
  );

  // Usu\u0144 opis w zak\u0142adce Sprawy.
  text = text.replace(
    /\s*<p>Lista spraw klienta\. Wejd\u017A w spraw\u0119, \u017Ceby edytowa\u0107 nazw\u0119, warto\u015B\u0107, zadania i dalsz\u0105 obs\u0142ug\u0119\.<\/p>/g,
    ""
  );

  // Panel w podsumowaniu z leadem \u017Ar\u00F3d\u0142owym kasujemy z widoku.
  text = text.replace(
    /<section className="client-detail-section-card">\s*\n\s*<div className="client-detail-section-head">\s*\n\s*<div>\s*\n\s*<h2>Aktywne sprawy<\/h2>\s*\n\s*<p>Lista spraw klienta z szybkim wej\u015Bciem do prowadzenia\.<\/p>/,
    `<section className="client-detail-section-card" data-client-summary-source-lead-panel="true">
                  <div className="client-detail-section-head">
                    <div>
                      <h2>Aktywne sprawy</h2>
                      <p>Lista spraw klienta z szybkim wej\u015Bciem do prowadzenia.</p>`
  );

  // Boczny kafel szybkich akcji nad notatk\u0105. Task/event/note id\u0105 przez to samo \u017Ar\u00F3d\u0142o prawdy.
  const noteNeedle = '<section className="right-card client-detail-right-card client-detail-note-card">';
  if (!text.includes('data-client-side-quick-actions="true"')) {
    const quickActionsCard = `
              <section className="right-card client-detail-right-card client-detail-side-quick-actions-card" data-client-side-quick-actions="true">
                <div className="client-detail-card-title-row">
                  <Sparkles className="h-4 w-4" />
                  <h2>Szybkie akcje</h2>
                </div>
                <div className="client-detail-side-quick-actions-grid">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-context-action-kind="task"
                    data-context-record-type="client"
                    data-context-record-id={String(client.id)}
                    data-context-record-label={getClientName(client)}
                    onClick={() =>
                      openContextQuickAction({
                        kind: 'task',
                        recordType: 'client',
                        recordId: String(client.id),
                        clientId: String(client.id),
                        leadId: firstSourceLead?.id ? String(firstSourceLead.id) : null,
                        caseId: mainCase?.id ? String(mainCase.id) : null,
                        recordLabel: getClientName(client),
                      })
                    }
                    disabled={!hasAccess}
                  >
                    Dodaj zadanie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-context-action-kind="event"
                    data-context-record-type="client"
                    data-context-record-id={String(client.id)}
                    data-context-record-label={getClientName(client)}
                    onClick={() =>
                      openContextQuickAction({
                        kind: 'event',
                        recordType: 'client',
                        recordId: String(client.id),
                        clientId: String(client.id),
                        leadId: firstSourceLead?.id ? String(firstSourceLead.id) : null,
                        caseId: mainCase?.id ? String(mainCase.id) : null,
                        recordLabel: getClientName(client),
                      })
                    }
                    disabled={!hasAccess}
                  >
                    Dodaj wydarzenie
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-context-action-kind="note"
                    data-context-record-type="client"
                    data-context-record-id={String(client.id)}
                    data-context-record-label={getClientName(client)}
                    onClick={() => openClientContextAction('note')}
                    disabled={!hasAccess}
                  >
                    Dodaj notatk\u0119
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => (mainCase?.id ? navigate(\`/cases/\${String(mainCase.id)}\`) : toast.info('Najpierw utw\u00F3rz spraw\u0119 klienta.'))}
                  >
                    Finanse w sprawie
                  </Button>
                </div>
              </section>

`;
    text = text.replace(noteNeedle, quickActionsCard + noteNeedle);
  }

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail for Stage24A.");
  } else {
    console.log("ClientDetail already Stage24A-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  const marker = "/* stage24a client detail actions cases roadmap */";
  const block = `
${marker}
.client-detail-vnext-page [data-client-summary-source-lead-panel="true"] {
  display: none !important;
}

.client-detail-vnext-page [data-client-side-quick-actions="true"] {
  display: block !important;
  background: #ffffff !important;
  border: 1px solid rgba(148, 163, 184, 0.45) !important;
  border-radius: 18px !important;
  padding: 14px !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;
}

.client-detail-vnext-page [data-client-side-quick-actions="true"] .client-detail-card-title-row {
  margin-bottom: 10px !important;
  color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-side-quick-actions-grid {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 8px !important;
}

.client-detail-vnext-page .client-detail-side-quick-actions-grid button,
.client-detail-vnext-page .client-detail-side-quick-actions-grid a {
  min-height: 34px !important;
  justify-content: center !important;
  color: #0f172a !important;
  background: #ffffff !important;
  border: 1px solid #94a3b8 !important;
  font-weight: 800 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.client-detail-vnext-page .client-detail-side-quick-actions-grid button:hover,
.client-detail-vnext-page .client-detail-side-quick-actions-grid a:hover {
  background: #e2e8f0 !important;
  color: #020617 !important;
}

.client-detail-vnext-page .client-detail-note-card button,
.client-detail-vnext-page .client-detail-note-card button.inline-flex,
.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center {
  color: #0f172a !important;
  background: #ffffff !important;
  border-color: #94a3b8 !important;
  opacity: 1 !important;
  visibility: visible !important;
  -webkit-text-fill-color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-note-card button *,
.client-detail-vnext-page .client-detail-note-card button svg,
.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center *,
.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center svg {
  color: #0f172a !important;
  stroke: #0f172a !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #0f172a !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {
  display: none !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] {
  background: transparent !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {
  border-radius: 22px !important;
  border: 1px solid rgba(148, 163, 184, 0.5) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-card,
.client-detail-vnext-page [data-client-cases-list-panel="true"] [class*="relation"] {
  border-radius: 16px !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card {
  max-height: 302px !important;
  overflow: hidden !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  max-height: 232px !important;
  overflow: auto !important;
  padding-left: 16px !important;
  padding-right: 2px !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list::before {
  content: "" !important;
  position: absolute !important;
  left: 5px !important;
  top: 7px !important;
  bottom: 7px !important;
  width: 2px !important;
  border-radius: 999px !important;
  background: linear-gradient(180deg, #2563eb, #22c55e) !important;
  opacity: 0.55 !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > * {
  position: relative !important;
  padding: 8px 8px 8px 12px !important;
  border: 1px solid rgba(148, 163, 184, 0.35) !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  color: #172033 !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *::before {
  content: "" !important;
  position: absolute !important;
  left: -15px !important;
  top: 14px !important;
  width: 9px !important;
  height: 9px !important;
  border-radius: 999px !important;
  background: #2563eb !important;
  border: 2px solid #ffffff !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18) !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *:first-child::before {
  background: #22c55e !important;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.18) !important;
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
  console.log("Patched Stage24A CSS.");
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
  pkg.scripts["check:stage24a-client-detail-actions-cases-roadmap"] = "node scripts/check-stage24a-client-detail-actions-cases-roadmap.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage24A.");
}

patchClientDetail();
patchCss();
patchPackageJson();
console.log("Stage24A repair complete.");
