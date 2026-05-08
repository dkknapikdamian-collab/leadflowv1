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

  if (!text.includes("STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD")) {
    text = text.replace(
      "const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';",
      "const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';\nconst STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD = 'client detail feedback complete repair';"
    );
  }

  const replacementTitleBlock = [
    "function getCaseTitle(caseRecord: any) {",
    "  const rawTitle = asText(caseRecord?.title) || asText(caseRecord?.name);",
    "  const clientName = asText(caseRecord?.clientName);",
    "  if (rawTitle && clientName) {",
    "    const titleLower = rawTitle.toLowerCase();",
    "    const clientLower = clientName.toLowerCase();",
    "    if (titleLower === clientLower) return 'Sprawa obsługowa';",
    "    if (titleLower.includes(clientLower)) {",
    "      const cleaned = rawTitle.replace(clientName, '').replace(/^\\s*[-–—:]\\s*/g, '').trim();",
    "      return cleaned || 'Sprawa obsługowa';",
    "    }",
    "  }",
    "  return String(rawTitle || 'Sprawa obsługowa');",
    "}",
    "",
    "function getCaseValueLabel(caseRecord: any) {",
    "  const raw =",
    "    caseRecord?.value ??",
    "    caseRecord?.caseValue ??",
    "    caseRecord?.dealValue ??",
    "    caseRecord?.expectedValue ??",
    "    caseRecord?.potentialRevenue ??",
    "    caseRecord?.amount ??",
    "    caseRecord?.price ??",
    "    caseRecord?.budget ??",
    "    0;",
    "  return formatMoneyWithCurrency(raw, caseRecord?.currency);",
    "}",
  ].join("\n");

  const titleBlockRegex = /function getCaseTitle\(caseRecord: any\) \{[\s\S]*?\n\}/;
  if (text.includes("function getCaseValueLabel(caseRecord: any)")) {
    text = text.replace(/function getCaseTitle\(caseRecord: any\) \{[\s\S]*?\n\}\n\nfunction getCaseValueLabel\(caseRecord: any\) \{[\s\S]*?\n\}/, replacementTitleBlock);
  } else if (titleBlockRegex.test(text)) {
    text = text.replace(titleBlockRegex, replacementTitleBlock);
  }

  text = text.replace(/\s*<p>Lista spraw klienta\. Wejdź w sprawę, żeby edytować nazwę, wartość, zadania i dalszą obsługę\.<\/p>/g, "");

  const insertionNeedle = '<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">';
  if (!text.includes('data-client-case-smart-list="true"') && text.includes(insertionNeedle)) {
    const smartCaseList = `
                  <div className="client-detail-case-smart-list" data-client-case-smart-list="true">
                    {(cases.filter((caseRecord: any) => {
                      const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                      const caseClientName = asText(caseRecord?.clientName);
                      const currentClientId = String(client.id || '').trim();
                      const currentClientName = getClientName(client).toLowerCase();
                      const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                      return Boolean(
                        isMainCase ||
                        (caseClientId && caseClientId === currentClientId) ||
                        (caseClientName && caseClientName.toLowerCase() === currentClientName)
                      );
                    }).length
                      ? cases.filter((caseRecord: any) => {
                          const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                          const caseClientName = asText(caseRecord?.clientName);
                          const currentClientId = String(client.id || '').trim();
                          const currentClientName = getClientName(client).toLowerCase();
                          const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                          return Boolean(
                            isMainCase ||
                            (caseClientId && caseClientId === currentClientId) ||
                            (caseClientName && caseClientName.toLowerCase() === currentClientName)
                          );
                        })
                      : mainCase?.id
                        ? [mainCase]
                        : []
                    ).map((caseRecord: any) => {
                      const caseId = String(caseRecord?.id || '');
                      const title = getCaseTitle(caseRecord);
                      const status = caseStatusLabel(String(caseRecord?.status || 'in_progress'));
                      const value = getCaseValueLabel(caseRecord);
                      const completeness = getCaseCompleteness(caseRecord);
                      return (
                        <article key={caseId || title} className="client-detail-case-smart-card" data-client-case-smart-card="true">
                          <div className="client-detail-case-smart-main">
                            <span className="client-detail-case-smart-kicker">Sprawa</span>
                            <strong>{title}</strong>
                            <div className="client-detail-case-smart-meta">
                              <span>{status}</span>
                              <span>Kompletność {completeness}%</span>
                            </div>
                          </div>
                          <div className="client-detail-case-smart-value">
                            <small>Wartość sprawy</small>
                            <b>{value}</b>
                          </div>
                          <div className="client-detail-case-smart-actions">
                            <Button type="button" size="sm" onClick={() => (caseId ? navigate(\`/cases/\${caseId}\`) : toast.info('Brak ID sprawy.'))}>
                              Wejdź
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => (caseId ? navigate(\`/cases/\${caseId}\`) : toast.info('Brak ID sprawy.'))}>
                              Edytuj
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => toast.info('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy.')}>
                              Usuń
                            </Button>
                          </div>
                        </article>
                      );
                    })}
                    {!(cases.filter((caseRecord: any) => {
                      const caseClientId = String(caseRecord?.clientId || caseRecord?.client_id || caseRecord?.clientID || '').trim();
                      const caseClientName = asText(caseRecord?.clientName);
                      const currentClientId = String(client.id || '').trim();
                      const currentClientName = getClientName(client).toLowerCase();
                      const isMainCase = mainCase?.id && String(caseRecord?.id || '') === String(mainCase.id);
                      return Boolean(
                        isMainCase ||
                        (caseClientId && caseClientId === currentClientId) ||
                        (caseClientName && caseClientName.toLowerCase() === currentClientName)
                      );
                    }).length || mainCase?.id) ? (
                      <div className="client-detail-case-smart-empty">Brak aktywnej sprawy dla klienta.</div>
                    ) : null}
                  </div>

`;
    text = text.replace(insertionNeedle, smartCaseList + insertionNeedle);
  }

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail for Stage25B.");
  } else {
    console.log("ClientDetail already Stage25B-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src", "styles", "visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  const marker = "/* stage25b client detail feedback complete repair */";
  const block = `
${marker}
.client-detail-vnext-page .client-detail-top-cards-side,
.client-detail-vnext-page .client-detail-completeness-card {
  display: none !important;
}

.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relations-list-acquisition-only,
.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-row-acquisition-only,
.client-detail-vnext-page [data-client-cases-list-panel="true"] [data-client-acquisition-history-row="true"] {
  display: none !important;
}

.client-detail-vnext-page [data-client-case-smart-list="true"] {
  display: grid !important;
  gap: 12px !important;
  margin-top: 12px !important;
}

.client-detail-vnext-page [data-client-case-smart-card="true"] {
  display: grid !important;
  grid-template-columns: minmax(0, 1.4fr) minmax(120px, 0.7fr) auto !important;
  gap: 12px !important;
  align-items: center !important;
  padding: 14px !important;
  border-radius: 18px !important;
  border: 1px solid rgba(148, 163, 184, 0.42) !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08) !important;
}

.client-detail-vnext-page .client-detail-case-smart-main {
  display: grid !important;
  gap: 5px !important;
  min-width: 0 !important;
}

.client-detail-vnext-page .client-detail-case-smart-kicker {
  width: fit-content !important;
  padding: 3px 8px !important;
  border-radius: 999px !important;
  background: #e0f2fe !important;
  color: #075985 !important;
  font-size: 10px !important;
  font-weight: 900 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}

.client-detail-vnext-page .client-detail-case-smart-main strong {
  color: #0f172a !important;
  font-size: 16px !important;
  line-height: 1.2 !important;
}

.client-detail-vnext-page .client-detail-case-smart-meta {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
}

.client-detail-vnext-page .client-detail-case-smart-meta span {
  padding: 4px 8px !important;
  border-radius: 999px !important;
  background: #f1f5f9 !important;
  color: #334155 !important;
  font-size: 11px !important;
  font-weight: 800 !important;
}

.client-detail-vnext-page .client-detail-case-smart-value {
  display: grid !important;
  gap: 4px !important;
  padding: 10px 12px !important;
  border-radius: 14px !important;
  background: #ecfdf5 !important;
  border: 1px solid #bbf7d0 !important;
}

.client-detail-vnext-page .client-detail-case-smart-value small {
  color: #047857 !important;
  font-size: 10px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: .05em !important;
}

.client-detail-vnext-page .client-detail-case-smart-value b {
  color: #064e3b !important;
  font-size: 15px !important;
}

.client-detail-vnext-page .client-detail-case-smart-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-end !important;
  gap: 7px !important;
}

.client-detail-vnext-page .client-detail-case-smart-actions button {
  min-height: 32px !important;
  color: #0f172a !important;
  background: #ffffff !important;
  border-color: #94a3b8 !important;
  -webkit-text-fill-color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-case-smart-actions button:first-child {
  color: #ffffff !important;
  background: #0f172a !important;
  border-color: #0f172a !important;
  -webkit-text-fill-color: #ffffff !important;
}

.client-detail-vnext-page .client-detail-case-smart-empty {
  padding: 14px !important;
  border-radius: 16px !important;
  background: #f8fafc !important;
  color: #475569 !important;
  border: 1px dashed #cbd5e1 !important;
}

.client-detail-vnext-page [data-client-side-quick-actions="true"],
.client-detail-vnext-page [data-client-side-quick-actions="true"] *,
.client-detail-vnext-page [data-client-side-quick-actions="true"] h2,
.client-detail-vnext-page [data-client-side-quick-actions="true"] svg {
  color: #0f172a !important;
  stroke: #0f172a !important;
  opacity: 1 !important;
  visibility: visible !important;
  -webkit-text-fill-color: #0f172a !important;
}

.client-detail-vnext-page [data-client-side-quick-actions="true"] button {
  color: #0f172a !important;
  background: #ffffff !important;
  border: 1px solid #94a3b8 !important;
  -webkit-text-fill-color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-note-card {
  display: flex !important;
  flex-direction: column !important;
}

.client-detail-vnext-page .client-detail-note-card .client-detail-card-title-row {
  order: 0 !important;
}

.client-detail-vnext-page .client-detail-note-card button,
.client-detail-vnext-page .client-detail-note-card .inline-flex {
  order: 10 !important;
}

.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {
  order: 30 !important;
  margin-top: 10px !important;
  padding-top: 10px !important;
  border-top: 1px solid rgba(148, 163, 184, 0.35) !important;
  color: #334155 !important;
  -webkit-text-fill-color: #334155 !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card {
  max-height: 340px !important;
}

.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {
  max-height: 270px !important;
}

@media (max-width: 900px) {
  .client-detail-vnext-page [data-client-case-smart-card="true"] {
    grid-template-columns: 1fr !important;
  }

  .client-detail-vnext-page .client-detail-case-smart-actions {
    justify-content: stretch !important;
  }

  .client-detail-vnext-page .client-detail-case-smart-actions button {
    flex: 1 1 90px !important;
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
  console.log("Patched Stage25B CSS.");
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
  delete pkg.scripts["check:stage25a-client-detail-feedback-complete-verify"];
  pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"] = "node scripts/check-stage25b-client-detail-feedback-complete-repair.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage25B.");
}

patchClientDetail();
patchCss();
patchPackageJson();
console.log("Stage25B repair complete.");
