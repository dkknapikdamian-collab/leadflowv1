import { useState } from 'react';
import { CalendarClock, CircleDollarSign, FileWarning, ListChecks, StickyNote } from 'lucide-react';
import { openContextQuickAction } from './ContextActionDialogs';
import AddCaseMissingItemDialog from './AddCaseMissingItemDialog';
import QuickActionsBar from './detail/QuickActionsBar';

export type CaseQuickActionsProps = {
  caseId: string;
  caseTitle?: string;
  clientId?: string | null;
  leadId?: string | null;
  onAddPayment?: () => void;
  onAfterMutation?: () => void;
};

const STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR = 'CaseQuickActions renders shared QuickActionsBar instead of local action grid';
void STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR;

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
    <>
      <QuickActionsBar
        title="Szybkie akcje"
        ariaLabel="Szybkie akcje sprawy"
        recordType="case"
        variant="rail"
        dataStage="stage227e3-case-quick-actions-bar"
        actions={[
          {
            key: 'note',
            label: 'Notatka',
            tone: 'note',
            icon: <StickyNote className="h-4 w-4" />,
            onClick: () => openSharedAction('note'),
            data: {
              'data-context-action-kind': 'note',
              'data-context-record-type': 'case',
              'data-context-record-id': caseId,
              'data-context-client-id': clientId || '',
              'data-context-lead-id': leadId || '',
              'data-context-record-label': recordLabel,
            },
          },
          {
            key: 'task',
            label: 'Zadanie',
            tone: 'task',
            icon: <ListChecks className="h-4 w-4" />,
            onClick: () => openSharedAction('task'),
            data: {
              'data-context-action-kind': 'task',
              'data-context-record-type': 'case',
              'data-context-record-id': caseId,
              'data-context-client-id': clientId || '',
              'data-context-lead-id': leadId || '',
              'data-context-record-label': recordLabel,
            },
          },
          {
            key: 'event',
            label: 'Wydarzenie',
            tone: 'event',
            icon: <CalendarClock className="h-4 w-4" />,
            onClick: () => openSharedAction('event'),
            data: {
              'data-context-action-kind': 'event',
              'data-context-record-type': 'case',
              'data-context-record-id': caseId,
              'data-context-client-id': clientId || '',
              'data-context-lead-id': leadId || '',
              'data-context-record-label': recordLabel,
            },
          },
          {
            key: 'missing',
            label: 'Brak',
            tone: 'missing',
            icon: <FileWarning className="h-4 w-4" />,
            onClick: () => setMissingDialogOpen(true),
            data: { 'data-stage227e3-case-missing-action': 'true' },
          },
          {
            key: 'payment',
            label: 'Wpłata',
            tone: 'payment',
            icon: <CircleDollarSign className="h-4 w-4" />,
            onClick: onAddPayment,
            data: { 'data-stage227e3-case-payment-action': 'true' },
          },
        ]}
      />

      <AddCaseMissingItemDialog
        open={missingDialogOpen}
        onOpenChange={setMissingDialogOpen}
        caseId={caseId}
        caseTitle={caseTitle}
        clientId={clientId || null}
        leadId={leadId || null}
        onSaved={onAfterMutation}
      />
    </>
  );
}
