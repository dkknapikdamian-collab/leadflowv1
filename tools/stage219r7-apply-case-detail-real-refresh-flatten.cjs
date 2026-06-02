const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
const write = (p, v) => fs.writeFileSync(path.join(repo, p), v, 'utf8');

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Nie znaleziono anchoru: ${label}`);
  return text.replace(from, to);
}

function insertAfterOnce(text, anchor, insert, label) {
  if (text.includes(insert.trim().split('\n')[0])) return text;
  if (!text.includes(anchor)) throw new Error(`Nie znaleziono anchoru: ${label}`);
  return text.replace(anchor, anchor + insert);
}

// 1) Shared context action saved event: one event after task/event/note save.
{
  const file = 'src/components/ContextActionDialogs.tsx';
  let text = read(file);

  if (!text.includes('STAGE219_R7_CONTEXT_ACTION_SAVED_EVENT')) {
    text = insertAfterOnce(
      text,
      "const CONTEXT_ACTION_EVENT = 'closeflow:context-action-dialog';\n",
      "const STAGE219_R7_CONTEXT_ACTION_SAVED_EVENT = 'Stage219-R7: shared quick action saved event refreshes detail views';\nexport const CONTEXT_ACTION_SAVED_EVENT = 'closeflow:context-action-saved';\n",
      'ContextActionDialogs saved event const',
    );
  }

  if (!text.includes('function notifySavedStage219R7')) {
    text = replaceOnce(
      text,
      '  const close = () => setRequest(null);\n',
      `  const close = () => setRequest(null);\n  function notifySavedStage219R7(kind: ContextActionKind) {\n    const savedRequest = request ? { ...request, kind } : { kind };\n    if (typeof window !== 'undefined') {\n      window.dispatchEvent(new CustomEvent(CONTEXT_ACTION_SAVED_EVENT, { detail: savedRequest }));\n    }\n    close();\n  }\n`,
      'notifySaved insertion',
    );
  }

  text = text.replace('onSaved={close} context={context || undefined} />', "onSaved={() => notifySavedStage219R7('task')} context={context || undefined} />");
  text = text.replace('onSaved={close} context={context || undefined} />', "onSaved={() => notifySavedStage219R7('event')} context={context || undefined} />");
  text = text.replace('onSaved={close} context={context || undefined} />', "onSaved={() => notifySavedStage219R7('note')} context={context || undefined} />");

  write(file, text);
}

// 2) CaseDetail listens to saved event and refreshes itself.
{
  const file = 'src/pages/CaseDetail.tsx';
  let text = read(file);

  text = text.replace(
    "import { openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';",
    "import { CONTEXT_ACTION_SAVED_EVENT, openContextQuickAction, type ContextActionKind } from '../components/ContextActionDialogs';",
  );

  if (!text.includes('STAGE219_R7_CASE_DETAIL_REFRESH_AFTER_SHARED_QUICK_ACTION')) {
    text = replaceOnce(
      text,
      "  }, [refreshCaseData]);\n\n  const completionPercent = useMemo(() => {",
      `  }, [refreshCaseData]);\n\n  const STAGE219_R7_CASE_DETAIL_REFRESH_AFTER_SHARED_QUICK_ACTION = 'CaseDetail refreshes after shared note, task or event save';\n  void STAGE219_R7_CASE_DETAIL_REFRESH_AFTER_SHARED_QUICK_ACTION;\n\n  useEffect(() => {\n    if (!caseId) return;\n    const handleSharedQuickActionSaved = (event: Event) => {\n      const detail = (event as CustomEvent<any>).detail || {};\n      const savedCaseId = String(detail.caseId || detail.recordId || '');\n      if (detail.recordType && detail.recordType !== 'case') return;\n      if (savedCaseId && savedCaseId !== String(caseId)) return;\n      void refreshCaseData();\n    };\n    window.addEventListener(CONTEXT_ACTION_SAVED_EVENT, handleSharedQuickActionSaved as EventListener);\n    return () => window.removeEventListener(CONTEXT_ACTION_SAVED_EVENT, handleSharedQuickActionSaved as EventListener);\n  }, [caseId, refreshCaseData]);\n\n  const completionPercent = useMemo(() => {`,
      'CaseDetail saved event listener',
    );
  }

  if (!text.includes('data-stage219-r7-recent-actions')) {
    const anchor = `              </div>\n            </section>\n\n\n            <section className="case-detail-section-card stage217-case-notes-panel"`;
    const insert = `              </div>\n\n              {openTasks.length + plannedEvents.length > 0 ? (\n                <div className="stage219-r7-case-recent-actions" data-stage219-r7-recent-actions="true">\n                  <div className="stage219-r7-case-recent-actions__head">\n                    <strong>Ostatnie działania w sprawie</strong>\n                    <span>{openTasks.length + plannedEvents.length}</span>\n                  </div>\n                  <div className="stage219-r7-case-recent-actions__list">\n                    {[\n                      ...plannedEvents.map((event: any) => ({\n                        key: 'event-' + String(event.id || event.title || event.startAt || Math.random()),\n                        kind: 'Wydarzenie',\n                        title: String(event.title || 'Wydarzenie'),\n                        meta: formatDateTime(event.startAt || event.scheduledAt || event.date, 'Bez terminu'),\n                      })),\n                      ...openTasks.map((task: any) => ({\n                        key: 'task-' + String(task.id || task.title || task.scheduledAt || Math.random()),\n                        kind: 'Zadanie',\n                        title: String(task.title || 'Zadanie'),\n                        meta: formatDateTime(task.scheduledAt || task.dueAt || task.date, 'Bez terminu'),\n                      })),\n                    ].slice(0, 3).map((item) => (\n                      <article key={item.key} className="stage219-r7-case-recent-action-row">\n                        <span>{item.kind}</span>\n                        <strong>{item.title}</strong>\n                        <small>{item.meta}</small>\n                      </article>\n                    ))}\n                  </div>\n                </div>\n              ) : null}\n            </section>\n\n\n            <section className="case-detail-section-card stage217-case-notes-panel"`;
    text = replaceOnce(text, anchor, insert, 'recent actions insertion');
  }

  write(file, text);
}

// 3) Flatten cards, hide thin descriptions, keep case title one-line.
{
  const file = 'src/styles/closeflow-detail-view-source-truth-stage219.css';
  let text = read(file);
  if (!text.includes('STAGE219_R7_CASE_DETAIL_REAL_REFRESH_FLATTEN')) {
    text += `\n\n/* STAGE219_R7_CASE_DETAIL_REAL_REFRESH_FLATTEN\n   Real patch: refresh detail after quick actions, flatter work cards, one-line title. */\n.case-detail-vnext-page.case-detail-vnext-page .case-detail-header {\n  min-height: 70px !important;\n  padding-block: 12px !important;\n}\n\n.case-detail-vnext-page.case-detail-vnext-page .case-detail-title-row {\n  min-width: 0 !important;\n  overflow: hidden !important;\n}\n\n.case-detail-vnext-page.case-detail-vnext-page .case-detail-title-row h1 {\n  display: block !important;\n  max-width: min(760px, calc(100vw - 620px)) !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n.case-detail-vnext-page .stage217-case-operation-workspace.stage217-case-operation-workspace {\n  padding: 14px !important;\n}\n\n.case-detail-vnext-page .stage217-case-service-grid.stage217-case-service-grid {\n  gap: 6px !important;\n}\n\n.case-detail-vnext-page .stage217-case-service-card.stage217-case-service-card {\n  grid-template-columns: 28px minmax(0, 1fr) !important;\n  min-height: 58px !important;\n  padding: 9px 12px !important;\n}\n\n.case-detail-vnext-page .stage217-case-service-card.stage217-case-service-card::before {\n  height: 22px !important;\n  width: 22px !important;\n}\n\n.case-detail-vnext-page .stage217-case-service-card p {\n  display: none !important;\n}\n\n.stage219-r7-case-recent-actions {\n  border-top: 1px solid rgba(148, 163, 184, 0.16);\n  margin-top: 10px;\n  padding-top: 10px;\n}\n\n.stage219-r7-case-recent-actions__head {\n  align-items: center;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 8px;\n}\n\n.stage219-r7-case-recent-actions__head strong {\n  color: #0f172a;\n  font-size: 12px;\n  font-weight: 850;\n}\n\n.stage219-r7-case-recent-actions__head span {\n  background: rgba(37, 99, 235, 0.08);\n  border-radius: 999px;\n  color: #2563eb;\n  font-size: 11px;\n  font-weight: 850;\n  padding: 3px 8px;\n}\n\n.stage219-r7-case-recent-actions__list {\n  display: grid;\n  gap: 6px;\n}\n\n.stage219-r7-case-recent-action-row {\n  align-items: center;\n  background: rgba(248, 250, 252, 0.85);\n  border: 1px solid rgba(148, 163, 184, 0.14);\n  border-radius: 12px;\n  display: grid;\n  gap: 8px;\n  grid-template-columns: 86px minmax(0, 1fr) auto;\n  padding: 8px 10px;\n}\n\n.stage219-r7-case-recent-action-row span,\n.stage219-r7-case-recent-action-row small {\n  color: #64748b;\n  font-size: 11px;\n  font-weight: 750;\n}\n\n.stage219-r7-case-recent-action-row strong {\n  color: #0f172a;\n  font-size: 12px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n`;
  }
  write(file, text);
}

console.log('OK Stage219-R7 applied');
