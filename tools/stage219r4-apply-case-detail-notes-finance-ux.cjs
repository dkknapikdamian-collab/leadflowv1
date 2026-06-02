const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}
function ensureContains(file, text, description) {
  if (!text.includes(description)) {
    throw new Error(`${file}: missing marker ${description}`);
  }
}
function replaceOnce(text, pattern, replacement, label) {
  const next = text.replace(pattern, replacement);
  if (next === text) throw new Error(`Nie udało się wykonać replace: ${label}`);
  return next;
}

const repo = process.cwd();
const caseFile = path.join(repo, 'src/pages/CaseDetail.tsx');
const contextFile = path.join(repo, 'src/components/ContextActionDialogs.tsx');
const quickActionsFile = path.join(repo, 'src/components/CaseQuickActions.tsx');
const cssFile = path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css');
const mainFile = path.join(repo, 'src/main.tsx');

for (const file of [caseFile, contextFile, quickActionsFile, cssFile, mainFile]) {
  if (!fs.existsSync(file)) throw new Error(`Brak pliku: ${file}`);
}

// 1) CaseDetail: refresh after shared note save + real note buttons.
let caseText = read(caseFile);

if (!caseText.includes('STAGE219_R4_CONTEXT_NOTE_REFRESH')) {
  caseText = caseText.replace(
    "const STAGE217_CASE_NOTE_HISTORY_SUMMARY = \"Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.\";\nvoid STAGE217_CASE_NOTE_HISTORY_SUMMARY;",
    "const STAGE217_CASE_NOTE_HISTORY_SUMMARY = \"Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.\";\nvoid STAGE217_CASE_NOTE_HISTORY_SUMMARY;\nconst STAGE219_R4_CONTEXT_NOTE_REFRESH = 'case detail refreshes after shared note saved';\nvoid STAGE219_R4_CONTEXT_NOTE_REFRESH;"
  );
}

if (!caseText.includes('data-stage219-case-note-saved-refresh')) {
  const refreshEffect = `

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail || {};
      if (detail?.caseId && String(detail.caseId) !== String(caseId || '')) return;
      if (detail?.payload?.recordType && detail.payload.recordType !== 'case') return;
      void refreshCaseData();
    };
    window.addEventListener('closeflow:context-note-saved', listener as EventListener);
    return () => window.removeEventListener('closeflow:context-note-saved', listener as EventListener);
  }, [caseId, refreshCaseData]);
  const STAGE219_R4_CASE_NOTE_SAVED_REFRESH_MARKER = 'data-stage219-case-note-saved-refresh';
  void STAGE219_R4_CASE_NOTE_SAVED_REFRESH_MARKER;`;
  caseText = replaceOnce(
    caseText,
    /  useEffect\(\(\) => \{\s+let active = true;\s+const run = async \(\) => \{\s+if \(!active\) return;\s+await refreshCaseData\(\);\s+\};\s+run\(\);\s+return \(\) => \{\s+active = false;\s+\};\s+\}, \[refreshCaseData\]\);/,
    (match) => match + refreshEffect,
    'CaseDetail context note saved refresh effect'
  );
}

const notesHeadPattern = /(<section className="case-detail-section-card stage217-case-notes-panel" data-stage217-case-notes-panel="true">\s*)<div className="case-detail-section-head">[\s\S]*?<\/div>\s*\{caseNoteItems\.length === 0/;
if (!caseText.includes('data-stage219-case-notes-actions="true"')) {
  const replacement = `$1<div className="case-detail-section-head stage219-case-notes-head" data-stage219-case-notes-head="true">
                <div>
                  <p className="case-detail-eyebrow">Notatki sprawy</p>
                  <h2>Notatki sprawy</h2>
                  <p>Ostatnie notatki są tutaj. Pełna historia zostaje w historii aktywności.</p>
                </div>
                <div className="stage219-case-notes-actions" data-stage219-case-notes-actions="true">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openCaseNoteDialog}
                    data-context-action-kind="note"
                    data-context-record-type="case"
                    data-context-record-id={caseData.id}
                    data-context-client-id={caseData.clientId || ''}
                    data-context-lead-id={caseData.leadId || ''}
                    data-context-record-label={getCaseTitle(caseData)}
                    data-stage219-dictate-note="true"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Dyktuj notatkę
                  </Button>
                  <Button
                    type="button"
                    onClick={openCaseNoteDialog}
                    data-context-action-kind="note"
                    data-context-record-type="case"
                    data-context-record-id={caseData.id}
                    data-context-client-id={caseData.clientId || ''}
                    data-context-lead-id={caseData.leadId || ''}
                    data-context-record-label={getCaseTitle(caseData)}
                    data-stage219-add-note="true"
                  >
                    <StickyNote className="h-4 w-4" />
                    Dodaj notatkę
                  </Button>
                </div>
              </div>
              {caseNoteItems.length === 0`;
  caseText = replaceOnce(caseText, notesHeadPattern, replacement, 'CaseDetail notes header actions');
}

write(caseFile, caseText);

// 2) ContextActionDialogs: explicit context should preserve clientId/leadId/caseId.
let contextText = read(contextFile);
if (!contextText.includes('data-context-client-id')) {
  contextText = contextText.replace(
    "export const CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id';",
    "export const CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id';\nexport const CONTEXT_ACTION_CLIENT_ID_ATTR = 'data-context-client-id';\nexport const CONTEXT_ACTION_LEAD_ID_ATTR = 'data-context-lead-id';\nexport const CONTEXT_ACTION_CASE_ID_ATTR = 'data-context-case-id';"
  );

  contextText = replaceOnce(
    contextText,
    /function buildContextFromExplicitClick\(target: Element \| null\): TaskCreateDialogContext \| null \{[\s\S]*?\n\}/,
    `function buildContextFromExplicitClick(target: Element | null): TaskCreateDialogContext | null {
  if (!target) return null;
  const explicitElement = target.closest('[data-context-action-kind]');
  if (!explicitElement) return null;
  const recordType = normalizeContextRecordType(explicitElement.getAttribute(CONTEXT_ACTION_RECORD_TYPE_ATTR));
  const recordId = String(explicitElement.getAttribute(CONTEXT_ACTION_RECORD_ID_ATTR) || '').trim();
  if (!recordType || !recordId) return null;
  const recordLabel = explicitElement.getAttribute('data-context-record-label')?.trim() || readVisibleTitle(recordType === 'lead' ? 'Lead' : recordType === 'client' ? 'Klient' : 'Sprawa');
  const explicitLeadId = explicitElement.getAttribute(CONTEXT_ACTION_LEAD_ID_ATTR)?.trim() || null;
  const explicitClientId = explicitElement.getAttribute(CONTEXT_ACTION_CLIENT_ID_ATTR)?.trim() || null;
  const explicitCaseId = explicitElement.getAttribute(CONTEXT_ACTION_CASE_ID_ATTR)?.trim() || null;
  return {
    recordType,
    recordId,
    recordLabel,
    leadId: explicitLeadId || (recordType === 'lead' ? recordId : null),
    clientId: explicitClientId || (recordType === 'client' ? recordId : null),
    caseId: explicitCaseId || (recordType === 'case' ? recordId : null),
  };
}`,
    'ContextActionDialogs explicit client/lead/case context'
  );
}
write(contextFile, contextText);

// 3) CaseQuickActions: add client/lead attributes so captured clicks keep relation context.
let quickText = read(quickActionsFile);
if (!quickText.includes('data-context-client-id={clientId || \'\'}')) {
  quickText = quickText.replaceAll(
    'data-context-record-id={caseId} data-context-record-label={recordLabel}',
    "data-context-record-id={caseId} data-context-client-id={clientId || ''} data-context-lead-id={leadId || ''} data-context-record-label={recordLabel}"
  );
}
write(quickActionsFile, quickText);

// 4) CSS: split true columns, finance higher, notes readable, remove pseudo duplicate buttons.
let cssText = read(cssFile);
const cssPatch = `

/* STAGE219_R4_CASE_DETAIL_SPLIT_COLUMNS_NOTES_FINANCE
   Finance goes up in the right rail, notes become a readable wide left panel.
   This overrides earlier display: contents experiments. */
.case-detail-vnext-page .case-detail-shell.case-detail-shell {
  align-items: start !important;
  display: grid !important;
  gap: 18px !important;
  grid-template-columns: minmax(0, 1fr) 292px !important;
}

.case-detail-vnext-page .case-detail-main-column {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  min-width: 0 !important;
}

.case-detail-vnext-page .case-detail-right-rail {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  min-width: 0 !important;
}

.case-detail-vnext-page .stage217-case-operation-workspace,
.case-detail-vnext-page .stage217-case-notes-panel,
.case-detail-vnext-page .case-detail-right-rail [data-case-quick-actions-anchor='case-detail'],
.case-detail-vnext-page .case-detail-right-rail [data-case-finance-panel='true'] {
  grid-column: auto !important;
  grid-row: auto !important;
}

.case-detail-vnext-page .case-detail-right-rail [data-case-finance-panel='true'] {
  order: 2 !important;
  padding: 14px !important;
}

.case-detail-vnext-page .case-detail-right-rail [data-case-quick-actions-anchor='case-detail'] {
  order: 1 !important;
}

.case-detail-vnext-page .stage217-case-notes-panel.stage217-case-notes-panel {
  max-height: 238px !important;
  padding: 14px !important;
}

.case-detail-vnext-page .stage219-case-notes-head {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  gap: 12px !important;
}

.case-detail-vnext-page .stage219-case-notes-actions {
  align-items: center !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  justify-content: flex-end !important;
}

.case-detail-vnext-page .stage219-case-notes-actions button {
  font-size: 12px !important;
  min-height: 34px !important;
  padding-inline: 12px !important;
}

.case-detail-vnext-page .stage217-case-notes-panel .case-detail-section-head button {
  font-size: 12px !important;
}

.case-detail-vnext-page .stage217-case-notes-panel .case-detail-section-head button::after,
.case-detail-vnext-page .stage217-case-notes-panel .case-detail-section-head > div::after {
  content: none !important;
  display: none !important;
}

.case-detail-vnext-page .stage217-case-notes-list {
  max-height: 132px !important;
  overflow: auto !important;
}

.case-detail-vnext-page .case-detail-right-rail [data-case-finance-panel='true'] .case-finance-panel-actions {
  display: grid !important;
  grid-template-columns: 1fr !important;
}

.case-detail-vnext-page .case-detail-right-rail [data-case-finance-panel='true'] .case-detail-card-title-row h2 {
  font-size: 14px !important;
}

@media (max-width: 1120px) {
  .case-detail-vnext-page .case-detail-shell.case-detail-shell {
    grid-template-columns: 1fr !important;
  }
}
`;
if (!cssText.includes('STAGE219_R4_CASE_DETAIL_SPLIT_COLUMNS_NOTES_FINANCE')) {
  cssText += cssPatch;
}
write(cssFile, cssText);

console.log('OK Stage219-R4 CaseDetail notes/finance UX applied');
