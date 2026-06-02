const fs = require('fs');

const repo = process.cwd();

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function write(path, text) {
  fs.writeFileSync(path, text, 'utf8');
}

function requireFile(path) {
  if (!fs.existsSync(path)) throw new Error(`Brak pliku: ${path}`);
}

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Nie znaleziono anchoru: ${label}`);
  }
  return text.replace(from, to);
}

const contextPath = 'src/components/ContextActionDialogs.tsx';
const casePath = 'src/pages/CaseDetail.tsx';
const cssPath = 'src/styles/closeflow-detail-view-source-truth-stage219.css';

requireFile(contextPath);
requireFile(casePath);
requireFile(cssPath);

let context = read(contextPath);

if (!context.includes("STAGE219R6_CONTEXT_ACTION_SAVED_EVENT")) {
  context = replaceOnce(
    context,
    "const CONTEXT_ACTION_EVENT = 'closeflow:context-action-dialog';",
    "const CONTEXT_ACTION_EVENT = 'closeflow:context-action-dialog';\nconst CONTEXT_ACTION_SAVED_EVENT = 'closeflow:context-action-saved';\nconst STAGE219R6_CONTEXT_ACTION_SAVED_EVENT = 'context quick actions emit saved event for case detail refresh';",
    'context saved event const'
  );
}

if (!context.includes("const notifySaved = async (kind: ContextActionKind)")) {
  context = replaceOnce(
    context,
    "  const close = () => setRequest(null);\n  const openTask = request?.kind === 'task';",
    "  const close = () => setRequest(null);\n  const notifySaved = async (kind: ContextActionKind) => {\n    if (typeof window !== 'undefined' && request) {\n      window.dispatchEvent(new CustomEvent(CONTEXT_ACTION_SAVED_EVENT, { detail: { ...request, kind } }));\n    }\n    close();\n  };\n  const openTask = request?.kind === 'task';",
    'notifySaved insertion'
  );
}

context = context
  .replace(
    '<TaskCreateDialog open={openTask} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />',
    '<TaskCreateDialog open={openTask} onOpenChange={(open) => (open ? null : close())} onSaved={() => notifySaved(\'task\')} context={context || undefined} />'
  )
  .replace(
    '<EventCreateDialog open={openEvent} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />',
    '<EventCreateDialog open={openEvent} onOpenChange={(open) => (open ? null : close())} onSaved={() => notifySaved(\'event\')} context={context || undefined} />'
  )
  .replace(
    '<ContextNoteDialog open={openNote} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />',
    '<ContextNoteDialog open={openNote} onOpenChange={(open) => (open ? null : close())} onSaved={() => notifySaved(\'note\')} context={context || undefined} />'
  );

if (!context.includes("onSaved={() => notifySaved('event')}")) {
  throw new Error('Nie udało się przepiąć onSaved event dialogu.');
}

write(contextPath, context);

let caseDetail = read(casePath);

if (!caseDetail.includes("STAGE219R6_CASE_DETAIL_REFRESH_AFTER_CONTEXT_SAVE")) {
  const anchor = `  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await refreshCaseData();
    };
    run();
    return () => {
      active = false;
    };
  }, [refreshCaseData]);
`;
  const insert = `${anchor}
  useEffect(() => {
    const STAGE219R6_CASE_DETAIL_REFRESH_AFTER_CONTEXT_SAVE = 'case detail refreshes after shared note task or event save';
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ recordType?: string; recordId?: string; caseId?: string | null }>).detail;
      const savedCaseId = detail?.caseId || (detail?.recordType === 'case' ? detail.recordId : null);
      if (!savedCaseId || String(savedCaseId) !== String(caseId || '')) return;
      void refreshCaseData();
    };
    window.addEventListener('closeflow:context-action-saved', listener as EventListener);
    void STAGE219R6_CASE_DETAIL_REFRESH_AFTER_CONTEXT_SAVE;
    return () => window.removeEventListener('closeflow:context-action-saved', listener as EventListener);
  }, [caseId, refreshCaseData]);
`;
  caseDetail = replaceOnce(caseDetail, anchor, insert, 'case refresh effect after initial load effect');
}

// Repair mojibake in the visible empty state if it is still present.
caseDetail = caseDetail.replace(
  'Brak notatek przy tej sprawie. Dodaj pierwszÄ… notatkÄ™ z szybkich akcji.',
  'Brak notatek przy tej sprawie. Dodaj pierwszą notatkę z szybkich akcji.'
);

write(casePath, caseDetail);

let css = read(cssPath);

if (!css.includes('STAGE219_R6_CASE_DETAIL_REFRESH_AND_FLAT_CARDS')) {
  css += `

/* STAGE219_R6_CASE_DETAIL_REFRESH_AND_FLAT_CARDS
   Decyzja: po zapisie zadania/wydarzenia/notatki CaseDetail ma odswiezyc dane.
   Kolorowe karty maja byc niskie, bez cienkich opisow, z nazwa sprawy w jednej linii. */
.case-detail-vnext-page.case-detail-vnext-page .case-detail-header-copy {
  align-items: center !important;
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  gap: 12px !important;
  min-width: 0 !important;
}

.case-detail-vnext-page.case-detail-vnext-page .case-detail-title-row {
  min-width: 0 !important;
}

.case-detail-vnext-page.case-detail-vnext-page .case-detail-title-row h1 {
  display: block !important;
  max-width: min(760px, 58vw) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.case-detail-vnext-page .stage217-case-service-grid.stage217-case-service-grid {
  gap: 7px !important;
}

.case-detail-vnext-page .stage217-case-service-card.stage217-case-service-card {
  align-items: center !important;
  border-radius: 14px !important;
  gap: 4px 10px !important;
  grid-template-columns: 28px minmax(0, 1fr) !important;
  min-height: 56px !important;
  padding: 9px 12px !important;
}

.case-detail-vnext-page .stage217-case-service-card.stage217-case-service-card::before {
  height: 22px !important;
  width: 22px !important;
}

.case-detail-vnext-page .stage217-case-service-card__label {
  align-self: end !important;
  line-height: 1.05 !important;
}

.case-detail-vnext-page .stage217-case-service-card h3,
.case-detail-vnext-page .stage217-case-service-card__metric {
  align-self: start !important;
  font-size: 14px !important;
  line-height: 1.15 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.case-detail-vnext-page .stage217-case-service-card p,
.case-detail-vnext-page .stage217-case-service-card p::after {
  display: none !important;
  content: none !important;
}

.case-detail-vnext-page .stage217-case-notes-panel.stage217-case-notes-panel {
  max-height: 190px !important;
}

.case-detail-vnext-page .stage217-case-notes-list {
  max-height: 104px !important;
  overflow: auto !important;
}

.case-detail-vnext-page .stage217-case-note-row {
  min-height: 42px !important;
  padding: 8px 10px !important;
}

.case-detail-vnext-page .case-detail-right-rail [data-case-finance-panel='true'] {
  align-self: start !important;
}
`;
}

write(cssPath, css);

console.log('OK Stage219-R6 applied: context saved event, case refresh listener, flat cards CSS.');
