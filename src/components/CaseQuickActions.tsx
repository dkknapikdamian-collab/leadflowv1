import { CalendarClock, FileWarning, ListChecks, StickyNote } from 'lucide-react';
import { openContextQuickAction } from './ContextActionDialogs';
import QuickActionsBar from './detail/QuickActionsBar';

const STAGE231H_R1D2_R12G_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE = 'CaseQuickActions sends explicit data-context-case-id for every case quick action after R12 partial repair';
void STAGE231H_R1D2_R12G_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE;
export type CaseQuickActionsProps = {
  caseId: string;
  caseTitle?: string;
  clientId?: string | null;
  leadId?: string | null;
  onAfterMutation?: () => void;
};

const STAGE228R12_CASE_MISSING_USES_CONTEXT_ACTION_HOST = 'CaseQuickActions Brak routes through ContextActionDialogs blocker host instead of a local dialog';
void STAGE228R12_CASE_MISSING_USES_CONTEXT_ACTION_HOST;
const STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR = 'CaseQuickActions renders shared QuickActionsBar instead of local action grid';
void STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR;
const STAGE228R7_R8_CASE_QUICK_ACTIONS_CARD_SOURCE_TRUTH = 'Case quick actions use the shared card-list quick action visual source of truth';
void STAGE228R7_R8_CASE_QUICK_ACTIONS_CARD_SOURCE_TRUTH;
const STAGE231D0D_R5_CASE_QUICK_ACTIONS_NO_PAYMENT = 'Case quick actions do not duplicate commission payment; payment stays in settlement rail';
void STAGE231D0D_R5_CASE_QUICK_ACTIONS_NO_PAYMENT;
const STAGE231H_R1D2_R12F_CASE_QUICK_ACTIONS_CASE_ID_SCOPE = 'Case quick actions explicitly carry caseId for note task event and blocker actions';
void STAGE231H_R1D2_R12F_CASE_QUICK_ACTIONS_CASE_ID_SCOPE;
const STAGE231H_R1D2_R12E_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE = 'Case quick actions always carry explicit data-context-case-id for note, task, event and blocker actions';
void STAGE231H_R1D2_R12E_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE;
const STAGE231H_R1D2_R12D_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE = 'CaseQuickActions sends explicit data-context-case-id for every case quick action';
void STAGE231H_R1D2_R12D_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE;
const STAGE231H_R1D2_R12C_CASE_QUICK_ACTIONS_CASE_ID_SCOPE = 'CaseQuickActions passes explicit data-context-case-id for note, task, event and missing actions';
void STAGE231H_R1D2_R12C_CASE_QUICK_ACTIONS_CASE_ID_SCOPE;


export default function CaseQuickActions({
  caseId,
  caseTitle,
  clientId,
  leadId,
  onAfterMutation,
}: CaseQuickActionsProps) {
  void onAfterMutation;
  const recordLabel = caseTitle || 'Sprawa';

  function openSharedAction(kind: 'note' | 'task' | 'event' | 'blocker') {
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
              'data-context-case-id': caseId || '',
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
              'data-context-case-id': caseId || '',
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
              'data-context-case-id': caseId || '',
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
            onClick: () => openSharedAction('blocker'),
            data: {
              'data-context-action-kind': 'blocker',
              'data-context-record-type': 'case',
              'data-context-record-id': caseId,
              'data-context-case-id': caseId || '',
              'data-context-client-id': clientId || '',
              'data-context-lead-id': leadId || '',
              'data-context-record-label': recordLabel,
              'data-stage227e3-case-missing-action': 'true',
              'data-stage228r12-case-context-blocker': 'true',
            },
          },
        ]}
      />
    </>
  );
}
