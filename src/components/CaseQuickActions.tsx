import { useState } from 'react';
import { CalendarClock, CircleDollarSign, FileWarning, ListChecks, StickyNote } from 'lucide-react';

import { openContextQuickAction } from './ContextActionDialogs';
import AddCaseMissingItemDialog from './AddCaseMissingItemDialog';

export type CaseQuickActionsProps = {
  caseId: string;
  caseTitle?: string;
  clientId?: string | null;
  leadId?: string | null;
  onAddPayment?: () => void;
  onAfterMutation?: () => void;
};

function actionButtonClassName(tone: string) {
  return ['case-quick-actions__button', 'case-quick-actions__button--' + tone].join(' ');
}

const CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13 = 'Quick actions header has title only, no helper subtitle';
void CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13;

export default function CaseQuickActions({
  caseId,
  caseTitle,
  clientId,
  leadId,
  onAddPayment,
  onAfterMutation,
}: CaseQuickActionsProps) {
  const [missingDialogOpen, setMissingDialogOpen] = useState(false);
  const recordLabel = caseTitle || 'Sprawa';

  function openSharedAction(kind: 'note' | 'task' | 'event') {
    if (!caseId) return;
    openContextQuickAction({
      kind,
      recordType: 'case',
      recordId: caseId,
      caseId,
      clientId: clientId || null,
      leadId: leadId || null,
      recordLabel,
    });
  }

  return (
    <section className="right-card case-quick-actions" data-case-quick-actions-panel="true" aria-label="Szybkie akcje sprawy">
      <header className="case-quick-actions__header">
        <span>
          <strong>Szybkie akcje</strong>
        </span>
      </header>

      <div className="case-quick-actions__grid">
        <button type="button" className={actionButtonClassName('note')} onClick={() => openSharedAction('note')} data-context-action-kind="note" data-context-record-type="case" data-context-record-id={caseId} data-context-record-label={recordLabel}>
          <StickyNote className="h-4 w-4" />
          <span>Dodaj notatkę</span>
        </button>
        <button type="button" className={actionButtonClassName('task')} onClick={() => openSharedAction('task')} data-context-action-kind="task" data-context-record-type="case" data-context-record-id={caseId} data-context-record-label={recordLabel}>
          <ListChecks className="h-4 w-4" />
          <span>Dodaj zadanie</span>
        </button>
        <button type="button" className={actionButtonClassName('event')} onClick={() => openSharedAction('event')} data-context-action-kind="event" data-context-record-type="case" data-context-record-id={caseId} data-context-record-label={recordLabel}>
          <CalendarClock className="h-4 w-4" />
          <span>Dodaj wydarzenie</span>
        </button>
        <button type="button" className={actionButtonClassName('missing')} onClick={() => setMissingDialogOpen(true)}>
          <FileWarning className="h-4 w-4" />
          <span>Dodaj brak</span>
        </button>
        <button type="button" className={actionButtonClassName('payment')} onClick={onAddPayment}>
          <CircleDollarSign className="h-4 w-4" />
          <span>Dodaj wpłatę</span>
        </button>
      </div>

      <AddCaseMissingItemDialog
        open={missingDialogOpen}
        onOpenChange={setMissingDialogOpen}
        caseId={caseId}
        caseTitle={caseTitle}
        clientId={clientId || null}
        leadId={leadId || null}
        onSaved={onAfterMutation}
      />
    </section>
  );
}
