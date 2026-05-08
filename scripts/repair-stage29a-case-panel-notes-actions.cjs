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

function ensureLucideIcon(text, iconName) {
  return text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*'lucide-react';/, (match, body) => {
    if (new RegExp(`\\b${iconName}\\b`).test(body)) return match;
    const lines = body.split("\n");
    const idx = lines.findIndex((line) => /\bPencil\b/.test(line));
    if (idx >= 0) lines.splice(idx, 0, `  ${iconName},`);
    else lines.splice(Math.max(0, lines.length - 1), 0, `  ${iconName},`);
    return `import {${lines.join("\n")}\n} from 'lucide-react';`;
  });
}

function ensureSupabaseImport(text, name) {
  if (new RegExp(`\\b${name}\\b`).test(text)) return text;
  return text.replace(
    "fetchActivitiesFromSupabase,\n",
    `fetchActivitiesFromSupabase,\n  ${name},\n`
  );
}

function patchClientDetail() {
  const file = path.join(root, "src/pages/ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  text = ensureLucideIcon(text, "Eye");
  text = ensureLucideIcon(text, "Pin");
  text = ensureSupabaseImport(text, "updateActivityInSupabase");
  text = ensureSupabaseImport(text, "deleteActivityFromSupabase");

  if (!text.includes("STAGE29A_CLIENT_NOTE_ACTIONS_GUARD")) {
    const anchor = text.includes("const STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD")
      ? "const STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD = 'client note listener id safe before finance';"
      : text.includes("const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD")
        ? "const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';"
        : "const STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';";
    text = text.replace(anchor, `${anchor}\nconst STAGE29A_CLIENT_NOTE_ACTIONS_GUARD = 'client notes edit delete preview pin actions';`);
  }

  if (!text.includes("const [clientPinnedNoteIds, setClientPinnedNoteIds]")) {
    const stateAnchor = /const\s*\[\s*activities\s*,\s*setActivities\s*\]\s*=\s*useState<any\[\]>\(\[\]\);/;
    const match = text.match(stateAnchor);
    if (!match) throw new Error("Nie znaleziono stanu activities/setActivities.");
    const stateBlock = `
  const [clientPinnedNoteIds, setClientPinnedNoteIds] = useState<string[]>([]);
`;
    text = text.slice(0, match.index + match[0].length) + stateBlock + text.slice(match.index + match[0].length);
  }

  if (!text.includes("const clientNotePinStorageKey = useMemo(")) {
    const listenerAnchor = "  useEffect(() => {\n    const handleContextNoteSaved";
    if (!text.includes(listenerAnchor)) throw new Error("Nie znaleziono listenera notatek do osadzenia akcji.");
    const actionsBlock = `
  const clientNotePinStorageKey = useMemo(
    () => \`closeflow:client-pinned-notes:\${String(client?.id || 'unknown')}\`,
    [client?.id],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(clientNotePinStorageKey);
      setClientPinnedNoteIds(raw ? JSON.parse(raw) : []);
    } catch {
      setClientPinnedNoteIds([]);
    }
  }, [clientNotePinStorageKey]);

  const persistClientPinnedNotes = useCallback(
    (nextPinnedIds: string[]) => {
      setClientPinnedNoteIds(nextPinnedIds);
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(clientNotePinStorageKey, JSON.stringify(nextPinnedIds));
      } catch {
        // localStorage is optional
      }
    },
    [clientNotePinStorageKey],
  );

  const handlePreviewClientNote = useCallback((note: any) => {
    const content = String(note?.content || '').trim();
    if (!content) {
      toast.info('Ta notatka jest pusta.');
      return;
    }
    toast.info(content, { duration: 12000 });
  }, []);

  const handleToggleClientNotePin = useCallback(
    (note: any) => {
      const noteId = String(note?.id || '').trim();
      if (!noteId) return;
      const nextPinnedIds = clientPinnedNoteIds.includes(noteId)
        ? clientPinnedNoteIds.filter((id) => id !== noteId)
        : [noteId, ...clientPinnedNoteIds];
      persistClientPinnedNotes(nextPinnedIds);
    },
    [clientPinnedNoteIds, persistClientPinnedNotes],
  );

  const handleEditClientNote = useCallback(
    async (note: any) => {
      const noteId = String(note?.id || '').trim();
      const previousContent = String(note?.content || '');
      const nextContent = typeof window !== 'undefined' ? window.prompt('Edytuj notatkę', previousContent) : previousContent;
      if (nextContent === null) return;
      const cleanContent = String(nextContent || '').trim();
      if (!cleanContent) {
        toast.error('Notatka nie może być pusta.');
        return;
      }
      try {
        await updateActivityInSupabase({
          id: noteId,
          payload: {
            recordType: 'client',
            clientId: client?.id || null,
            content: cleanContent,
            note: cleanContent,
            editedAt: new Date().toISOString(),
          },
        } as any);
        setActivities((previous) =>
          previous.map((activity) =>
            String(activity?.id || '') === noteId
              ? {
                  ...activity,
                  payload: {
                    ...(activity?.payload || {}),
                    content: cleanContent,
                    note: cleanContent,
                    editedAt: new Date().toISOString(),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : activity,
          ),
        );
        toast.success('Notatka zaktualizowana');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się edytować notatki.');
      }
    },
    [client?.id],
  );

  const handleDeleteClientNote = useCallback(
    async (note: any) => {
      const noteId = String(note?.id || '').trim();
      if (!noteId) return;
      if (typeof window !== 'undefined' && !window.confirm('Usunąć tę notatkę?')) return;
      try {
        await deleteActivityFromSupabase(noteId);
        setActivities((previous) => previous.filter((activity) => String(activity?.id || '') !== noteId));
        persistClientPinnedNotes(clientPinnedNoteIds.filter((id) => id !== noteId));
        toast.success('Notatka usunięta');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się usunąć notatki.');
      }
    },
    [clientPinnedNoteIds, persistClientPinnedNotes],
  );

`;
    text = text.replace(listenerAnchor, actionsBlock + listenerAnchor);
  }

  if (!text.includes("getClientNotesForRender(")) {
    text = text.replace(/\s*$/u, `

function getClientNotesForRender(notes: any[], pinnedIds: string[] = []) {
  return [...(notes || [])].sort((left, right) => {
    const leftPinned = pinnedIds.includes(String(left?.id || ''));
    const rightPinned = pinnedIds.includes(String(right?.id || ''));
    if (leftPinned !== rightPinned) return leftPinned ? -1 : 1;
    const leftTime = asDate(left?.createdAt)?.getTime() || 0;
    const rightTime = asDate(right?.createdAt)?.getTime() || 0;
    return rightTime - leftTime;
  });
}
`);
  }

  if (!text.includes("client-detail-note-item-toolbar")) {
    text = text.replace(/getClientVisibleNotes\(activities,\s*client\)/g, "getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds)");
    text = text.replace(
      '<article key={note.id} className="client-detail-note-item" data-client-note-item="true">',
      `<article
                        key={note.id}
                        className="client-detail-note-item"
                        data-client-note-item="true"
                        data-client-note-pinned={clientPinnedNoteIds.includes(note.id) ? 'true' : 'false'}
                      >
                        <div className="client-detail-note-item-toolbar" data-client-note-actions="true">
                          <button type="button" title="Przypnij notatkę" aria-label="Przypnij notatkę" onClick={() => handleToggleClientNotePin(note)}>
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title="Podgląd całej notatki" aria-label="Podgląd całej notatki" onClick={() => handlePreviewClientNote(note)}>
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title="Edytuj notatkę" aria-label="Edytuj notatkę" onClick={() => handleEditClientNote(note)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="client-detail-note-delete-button" title="Usuń notatkę" aria-label="Usuń notatkę" onClick={() => handleDeleteClientNote(note)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>`
    );
  }

  // If Stage29A was run after a previous partial replacement, ensure calls use render helper.
  if (text.includes("clientPinnedNoteIds") && text.includes("getClientVisibleNotes(activities, client).map")) {
    text = text.replace(/getClientVisibleNotes\(activities,\s*client\)/g, "getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds)");
  }

  const required = [
    "Eye",
    "Pin",
    "updateActivityInSupabase",
    "deleteActivityFromSupabase",
    "client-detail-note-item-toolbar",
    "handleEditClientNote",
    "handleDeleteClientNote",
    "handlePreviewClientNote",
    "handleToggleClientNotePin",
    "getClientNotesForRender",
  ];
  for (const needle of required) {
    if (!text.includes(needle)) throw new Error(`ClientDetail missing after Stage29A: ${needle}`);
  }

  if (text !== before) {
    writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
    console.log("Patched ClientDetail Stage29A.");
  } else {
    console.log("ClientDetail already Stage29A-ready.");
  }
}

function appendCss(file, marker, block) {
  ensureFile(file);
  let text = readUtf8NoBom(file);
  if (!text.includes(marker)) {
    text = text.replace(/\s*$/u, "\n\n" + block.trimEnd() + "\n");
  }
  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
}

function patchClientCss() {
  const file = path.join(root, "src/styles/visual-stage12-client-detail-vnext.css");
  const marker = "/* stage29a client note actions */";
  const block = `
${marker}
.client-detail-vnext-page [data-client-note-pinned="true"] {
  border-color: #f59e0b !important;
  background: #fffbeb !important;
}

.client-detail-vnext-page .client-detail-note-item-toolbar {
  display: flex !important;
  justify-content: flex-end !important;
  gap: 5px !important;
  margin: -2px -2px 6px 0 !important;
}

.client-detail-vnext-page .client-detail-note-item-toolbar button {
  width: 25px !important;
  height: 25px !important;
  min-width: 25px !important;
  padding: 0 !important;
  border-radius: 999px !important;
  border: 1px solid #cbd5e1 !important;
  background: #ffffff !important;
  color: #334155 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.client-detail-vnext-page .client-detail-note-item-toolbar button:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button {
  border-color: #fecaca !important;
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button svg {
  stroke: #dc2626 !important;
}
`;
  appendCss(file, marker, block);
  console.log("Patched ClientDetail CSS Stage29A.");
}

function patchCaseCss() {
  const file = path.join(root, "src/styles/visual-stage13-case-detail-vnext.css");
  const marker = "/* stage29a case right rail light panel */";
  const block = `
${marker}
.case-detail-vnext-page .case-detail-right-rail,
.case-detail-shell .case-detail-right-rail,
aside.case-detail-right-rail {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  color: #0f172a !important;
}

.case-detail-vnext-page .case-detail-right-rail::before,
.case-detail-vnext-page .case-detail-right-rail::after,
.case-detail-shell .case-detail-right-rail::before,
.case-detail-shell .case-detail-right-rail::after,
aside.case-detail-right-rail::before,
aside.case-detail-right-rail::after {
  display: none !important;
  background: transparent !important;
  content: none !important;
}

.case-detail-vnext-page .case-detail-right-card,
.case-detail-vnext-page [data-case-create-actions-panel="true"],
.case-detail-vnext-page .case-detail-create-action-card,
.case-detail-shell .case-detail-right-card,
.case-detail-shell [data-case-create-actions-panel="true"],
.case-detail-shell .case-detail-create-action-card {
  background: #ffffff !important;
  background-image: none !important;
  color: #0f172a !important;
  border-color: rgba(148, 163, 184, 0.42) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;
  -webkit-text-fill-color: #0f172a !important;
}

.case-detail-vnext-page .case-detail-right-card *,
.case-detail-vnext-page [data-case-create-actions-panel="true"] *,
.case-detail-vnext-page .case-detail-create-action-card * {
  color: inherit !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.case-detail-vnext-page .case-detail-right-card button,
.case-detail-vnext-page [data-case-create-actions-panel="true"] button,
.case-detail-vnext-page .case-detail-create-action-card button {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: #cbd5e1 !important;
}
`;
  appendCss(file, marker, block);
  console.log("Patched CaseDetail CSS Stage29A.");
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);
  const pkg = JSON.parse(readUtf8NoBom(file));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts["check:stage29a-case-panel-notes-actions"] = "node scripts/check-stage29a-case-panel-notes-actions.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage29A.");
}

patchClientDetail();
patchClientCss();
patchCaseCss();
patchPackageJson();
console.log("Stage29A repair complete.");
