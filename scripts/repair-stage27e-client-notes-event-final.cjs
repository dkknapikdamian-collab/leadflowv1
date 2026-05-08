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

function ensureTrash2Import(text) {
  return text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*'lucide-react';/, (match, body) => {
    if (/\bTrash2\b/.test(body)) return match;
    const lines = body.split("\n");
    const idx = lines.findIndex((line) => /\bUserRound\b/.test(line));
    if (idx >= 0) lines.splice(idx, 0, "  Trash2,");
    else lines.splice(Math.max(0, lines.length - 1), 0, "  Trash2,");
    return `import {${lines.join("\n")}\n} from 'lucide-react';`;
  });
}

function findMatchingSectionEnd(text, startIndex) {
  const rx = /<\/?section\b[^>]*>/g;
  rx.lastIndex = startIndex;
  let depth = 0;
  let match;
  while ((match = rx.exec(text))) {
    const tag = match[0];
    if (tag.startsWith("</")) {
      depth -= 1;
      if (depth === 0) return match.index;
    } else if (!tag.endsWith("/>")) {
      depth += 1;
    }
  }
  return -1;
}

function patchClientDetail() {
  const file = path.join(root, "src/pages/ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  text = ensureTrash2Import(text);

  if (!text.includes("STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD")) {
    const anchor = text.includes("const STAGE26A_FEEDBACK_AFTER_4EC_GUARD")
      ? "const STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';"
      : "const STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD = 'client detail JSX fragment build fix';";
    text = text.replace(anchor, `${anchor}\nconst STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';`);
  }

  if (!text.includes("function getClientVisibleNotes(")) {
    const helper = `
function getClientVisibleNotes(activityRows: any[], clientRecord: any) {
  const clientId = String(clientRecord?.id || '').trim();
  return (activityRows || [])
    .filter((activity) => {
      const eventType = String(activity?.eventType || activity?.activityType || '').toLowerCase();
      if (!['client_note_added', 'note_added', 'operator_note'].includes(eventType)) return false;
      const activityClientId = String(activity?.clientId || activity?.client_id || activity?.payload?.clientId || '').trim();
      const recordType = String(activity?.payload?.recordType || '').toLowerCase();
      return Boolean(
        (activityClientId && clientId && activityClientId === clientId) ||
        recordType === 'client' ||
        eventType === 'client_note_added'
      );
    })
    .map((activity) => ({
      id: String(activity?.id || activity?.createdAt || activity?.updatedAt || activity?.payload?.content || 'note'),
      content:
        asText(activity?.payload?.content) ||
        asText(activity?.payload?.note) ||
        asText(activity?.note) ||
        asText(activity?.description) ||
        asText(activity?.title),
      createdAt: activity?.createdAt || activity?.updatedAt || activity?.happenedAt || null,
    }))
    .filter((note) => note.content)
    .sort((left, right) => {
      const leftTime = asDate(left.createdAt)?.getTime() || 0;
      const rightTime = asDate(right.createdAt)?.getTime() || 0;
      return rightTime - leftTime;
    })
    .slice(0, 8);
}

`;
    text = text.replace(/\s*$/u, "\n\n" + helper);
  }

  if (!text.includes("window.addEventListener('closeflow:context-note-saved'")) {
    const stateRegex = /const\s*\[\s*activities\s*,\s*setActivities\s*\]\s*=\s*useState<any\[\]>\(\[\]\);/;
    const match = text.match(stateRegex);
    if (!match) throw new Error("Nie znaleziono stanu activities/setActivities w ClientDetail.");
    const effect = `

  useEffect(() => {
    const handleContextNoteSaved = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (!detail) return;
      const detailClientId = String(detail?.clientId || detail?.payload?.clientId || '').trim();
      const currentClientId = String(id || '').trim();
      if (detailClientId && currentClientId && detailClientId !== currentClientId) return;
      setActivities((previous) => [detail, ...previous]);
    };
    window.addEventListener('closeflow:context-note-saved', handleContextNoteSaved as EventListener);
    return () => window.removeEventListener('closeflow:context-note-saved', handleContextNoteSaved as EventListener);
  }, [id]);
`;
    text = text.slice(0, match.index + match[0].length) + effect + text.slice(match.index + match[0].length);
  }

  if (!text.includes('data-client-notes-list="true"')) {
    const needle = '<section className="right-card client-detail-right-card client-detail-note-card">';
    const start = text.indexOf(needle);
    if (start === -1) throw new Error("Nie znaleziono sekcji client-detail-note-card.");
    const end = findMatchingSectionEnd(text, start);
    if (end === -1) throw new Error("Nie znaleziono konca sekcji client-detail-note-card.");
    const notesBlock = `
              <div className="client-detail-notes-list" data-client-notes-list="true">
                <div className="client-detail-notes-list-head">
                  <strong>Notatki</strong>
                  <span>{getClientVisibleNotes(activities, client).length}</span>
                </div>
                {getClientVisibleNotes(activities, client).length ? (
                  <div className="client-detail-notes-items">
                    {getClientVisibleNotes(activities, client).map((note) => (
                      <article key={note.id} className="client-detail-note-item" data-client-note-item="true">
                        <p>{note.content}</p>
                        <small>{note.createdAt ? formatDateTime(note.createdAt) : 'Dodano przed chwilą'}</small>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="client-detail-notes-empty">Brak zapisanych notatek dla klienta.</p>
                )}
              </div>
`;
    text = text.slice(0, end) + notesBlock + text.slice(end);
  }

  if (!text.includes('className="client-detail-case-smart-delete-icon-button"')) {
    text = text.replace(
      /<Button type="button" size="sm" variant="outline" onClick=\{\(\) => toast\.info\('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy\.'\)\}>\s*Usuń\s*<\/Button>/g,
      `<Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="client-detail-case-smart-delete-icon-button"
                              aria-label="Usuń sprawę"
                              title="Usuń sprawę"
                              onClick={() => toast.info('Usuwanie sprawy wymaga potwierdzenia w widoku sprawy.')}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>`
    );
  }

  const lucide = text.match(/import\s*\{([\s\S]*?)\}\s*from\s*'lucide-react';/);
  if (!lucide || !/\bTrash2\b/.test(lucide[1])) throw new Error("Trash2 nie jest w imporcie lucide-react.");
  if (!text.includes("function getClientVisibleNotes(")) throw new Error("Brakuje helpera notatek.");
  if (!text.includes('data-client-notes-list="true"')) throw new Error("Brakuje listy notatek.");
  if (!text.includes("window.addEventListener('closeflow:context-note-saved'")) throw new Error("Brakuje listenera eventu notatki.");

  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched ClientDetail Stage27E.");
}

function patchContextNoteDialog() {
  const file = path.join(root, "src/components/ContextNoteDialog.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);

  if (!text.includes("STAGE27E_CONTEXT_NOTE_SAVED_EVENT")) {
    text = text.replace(
      "const STAGE85_CONTEXT_NOTE_DIALOG_SHARED = 'Shared note dialog for lead, client and case detail context actions';",
      "const STAGE85_CONTEXT_NOTE_DIALOG_SHARED = 'Shared note dialog for lead, client and case detail context actions';\nconst STAGE27E_CONTEXT_NOTE_SAVED_EVENT = 'closeflow:context-note-saved';"
    );
  }

  const hasAnyDispatch = /window\.dispatchEvent\s*\(\s*new\s+CustomEvent\s*\([^)]*closeflow:context-note-saved|window\.dispatchEvent\s*\(\s*new\s+CustomEvent\s*\(\s*STAGE27[A-Z]_CONTEXT_NOTE_SAVED_EVENT/.test(text);
  if (!hasAnyDispatch) {
    const needle = "      await insertActivityToSupabase(input);";
    if (!text.includes(needle)) throw new Error("Nie znaleziono await insertActivityToSupabase(input) w ContextNoteDialog.");
    text = text.replace(
      needle,
      `${needle}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STAGE27E_CONTEXT_NOTE_SAVED_EVENT, { detail: input }));
      }`
    );
  }

  if (!text.includes("closeflow:context-note-saved")) throw new Error("ContextNoteDialog nie ma eventu closeflow:context-note-saved.");
  if (!text.includes("window.dispatchEvent(new CustomEvent(")) throw new Error("ContextNoteDialog nie emituje CustomEvent.");

  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched ContextNoteDialog Stage27E.");
}

function patchCss() {
  const file = path.join(root, "src/styles/visual-stage12-client-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const marker = "/* stage27e client notes event final */";
  const block = `
${marker}
.client-detail-vnext-page [data-client-notes-list="true"] {
  order: 40 !important;
  margin-top: 12px !important;
  display: grid !important;
  gap: 10px !important;
}

.client-detail-vnext-page .client-detail-notes-list-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding-top: 10px !important;
  border-top: 1px solid rgba(148, 163, 184, 0.35) !important;
}

.client-detail-vnext-page .client-detail-notes-list-head strong {
  color: #0f172a !important;
  font-size: 13px !important;
  font-weight: 900 !important;
}

.client-detail-vnext-page .client-detail-notes-list-head span {
  min-width: 24px !important;
  height: 24px !important;
  border-radius: 999px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #e2e8f0 !important;
  color: #0f172a !important;
  font-size: 11px !important;
  font-weight: 900 !important;
}

.client-detail-vnext-page .client-detail-notes-items {
  display: grid !important;
  gap: 8px !important;
  max-height: 280px !important;
  overflow: auto !important;
}

.client-detail-vnext-page [data-client-note-item="true"] {
  padding: 10px 11px !important;
  border-radius: 14px !important;
  background: #f8fafc !important;
  border: 1px solid rgba(148, 163, 184, 0.35) !important;
  color: #172033 !important;
}

.client-detail-vnext-page [data-client-note-item="true"] p {
  margin: 0 !important;
  color: #172033 !important;
  font-size: 12px !important;
  line-height: 1.45 !important;
  white-space: pre-wrap !important;
}

.client-detail-vnext-page [data-client-note-item="true"] small,
.client-detail-vnext-page .client-detail-notes-empty {
  margin: 0 !important;
  color: #64748b !important;
  font-size: 11px !important;
  line-height: 1.35 !important;
}

.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,
.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg {
  color: #dc2626 !important;
  stroke: #dc2626 !important;
  -webkit-text-fill-color: #dc2626 !important;
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
  console.log("Patched CSS Stage27E.");
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  const pkg = JSON.parse(readUtf8NoBom(file));
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts["check:stage27a-client-notes-trash2-finance-direction"];
  delete pkg.scripts["check:stage27b-trash2-import-and-client-notes-final"];
  delete pkg.scripts["check:stage27c-client-notes-full-repair"];
  delete pkg.scripts["check:stage27d-client-notes-runtime-final"];
  pkg.scripts["check:stage27e-client-notes-event-final"] = "node scripts/check-stage27e-client-notes-event-final.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage27E.");
}

patchClientDetail();
patchContextNoteDialog();
patchCss();
patchPackageJson();
console.log("Stage27E repair complete.");
