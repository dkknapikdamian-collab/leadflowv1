import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { CONTEXT_ACTION_CONTRACT, STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1 } from '../lib/context-action-contract';
import { requireWorkspaceId } from '../lib/workspace-context';
import { buildMissingItemModalDraft } from '../lib/missing-items/stage227c2-missing-item-modal-contract';
import { insertActivityToSupabase, insertCaseItemToSupabase, insertTaskToSupabase } from '../lib/supabase-fallback';
import { useWorkspace } from '../hooks/useWorkspace';
import TaskCreateDialog, { type TaskCreateDialogContext } from './TaskCreateDialog';
import EventCreateDialog from './EventCreateDialog';
import ContextNoteDialog from './ContextNoteDialog';
import { MissingItemQuickActionModal } from './detail/MissingItemQuickActionModal';
import { emitCloseflowWorkItemNoFlickerMutation } from '../lib/work-items/no-flicker-mutation';

export type ContextActionKind = 'task' | 'event' | 'note' | 'blocker';
export type ContextRecordType = 'lead' | 'client' | 'case';

export type ContextActionRequest = TaskCreateDialogContext & {
  kind: ContextActionKind;
};

const CONTEXT_ACTION_EVENT = 'closeflow:context-action-dialog';
const CONTEXT_ACTION_SAVED_EVENT = 'closeflow:context-action-saved';
const STAGE228R50_CONTEXT_ACTION_SAVED_RECORD_DETAIL = 'ContextActionDialogs includes savedRecord in closeflow:context-action-saved for local no-flicker detail page insert';
void STAGE228R50_CONTEXT_ACTION_SAVED_RECORD_DETAIL;
const STAGE228R48_CONTEXT_ACTION_NO_FLICKER_SAVED_RECORD = 'ContextActionDialogs emits savedRecord for no-flicker local work-item insert instead of full detail reload';
void STAGE228R48_CONTEXT_ACTION_NO_FLICKER_SAVED_RECORD;
const STAGE220A7_CONTEXT_ACTION_SAVED_EVENT = 'Task/event/note/blocker save emits refresh event for detail pages';
void STAGE220A7_CONTEXT_ACTION_SAVED_EVENT;
const STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION = 'Context detail actions use one shared task, event, note and blocker dialog host';
const STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST = 'ContextActionDialogs owns Brak/blocker action and persists missing_item without SQL for lead, client and case';
void STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST;
const STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY = STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1;
const STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT = 'Explicit data-context-action-kind routes task, event, note and blocker through the same shared dialog host';
export const CONTEXT_ACTION_KIND_ATTR = 'data-context-action-kind';
export const CONTEXT_ACTION_RECORD_TYPE_ATTR = 'data-context-record-type';
export const CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id';
export const CONTEXT_ACTION_CLIENT_ID_ATTR = 'data-context-client-id';
export const CONTEXT_ACTION_LEAD_ID_ATTR = 'data-context-lead-id';
export const CONTEXT_ACTION_CASE_ID_ATTR = 'data-context-case-id';

function normalizeText(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeContextActionKind(value: unknown): ContextActionKind | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'task' || normalized === 'event' || normalized === 'note' || normalized === 'blocker') return normalized;
  if (normalized === 'missing' || normalized === 'missing_item' || normalized === 'brak') return 'blocker';
  return null;
}

function normalizeContextRecordType(value: unknown): ContextRecordType | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'lead' || normalized === 'client' || normalized === 'case') return normalized;
  return null;
}

function buildContextFromPath(pathname: string): TaskCreateDialogContext | null {
  const clean = String(pathname || '').split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const section = parts[0];
  const recordId = parts[1];
  if (!recordId) return null;

  if (section === 'leads') return { recordType: 'lead', recordId, leadId: recordId, recordLabel: readVisibleTitle('Lead') };
  if (section === 'clients') return { recordType: 'client', recordId, clientId: recordId, recordLabel: readVisibleTitle('Klient') };
  if (section === 'case' || section === 'cases') return { recordType: 'case', recordId, caseId: recordId, recordLabel: readVisibleTitle('Sprawa') };
  return null;
}

function buildContextFromExplicitClick(target: Element | null): TaskCreateDialogContext | null {
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
}

function readVisibleTitle(fallback: string) {
  if (typeof document === 'undefined') return fallback;
  const title = document.querySelector('[data-shell-content="true"] h1')?.textContent?.trim();
  if (title) return title.slice(0, 120);
  return fallback;
}

function shouldIgnoreClick(target: Element | null) {
  if (!target) return true;
  if (target.closest('[data-shell-global-bar="true"]')) return true;
  if (target.closest('[role="dialog"]')) return true;
  if (target.closest('[data-context-action-dialog-host="true"]')) return true;
  if (target.closest('[data-shell-sidebar="true"], [data-shell-mobile-menu="true"], [data-shell-mobile-nav="true"]')) return true;
  return false;
}

function resolveActionKindFromClick(target: Element | null): ContextActionKind | null {
  if (!target) return null;
  const actionElement = target.closest('[data-context-action-kind], button, a, [role="button"]');
  if (!actionElement) return null;
  const explicitKind = normalizeContextActionKind(actionElement.getAttribute(CONTEXT_ACTION_KIND_ATTR));
  if (explicitKind) return explicitKind;
  const text = normalizeText(actionElement.textContent || '');
  const label = normalizeText(actionElement.getAttribute('aria-label') || '');
  const merged = text + ' ' + label;

  if (merged.includes('dodaj zadanie') || merged.includes('zaplanuj telefon') || merged.includes('follow-up')) return 'task';
  if (merged.includes('dodaj wydarzenie') || merged.includes('zaplanuj spotkanie')) return 'event';
  if (merged.includes('dodaj notat') || merged.includes('dopisz notat') || merged.includes('podyktuj notat')) return 'note';
  if (text === 'brak' || label === 'brak' || merged.includes('dodaj brak') || merged.includes('czego brakuje')) return 'blocker';
  return null;
}

export function openContextQuickAction(request: ContextActionRequest) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ContextActionRequest>(CONTEXT_ACTION_EVENT, { detail: request }));
}

export default function ContextActionDialogsHost() {
  const location = useLocation();
  const { workspace } = useWorkspace();
  const [request, setRequest] = useState<ContextActionRequest | null>(null);
  const [missingTitle, setMissingTitle] = useState('');
  const [missingNote, setMissingNote] = useState('');
  const [missingError, setMissingError] = useState('');
  const [missingSaving, setMissingSaving] = useState(false);

  const resetMissingState = () => {
    setMissingTitle('');
    setMissingNote('');
    setMissingError('');
  };

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<ContextActionRequest>).detail;
      if (!detail?.kind || !detail?.recordType || !detail?.recordId) return;
      resetMissingState();
      setRequest(detail);
    };
    window.addEventListener(CONTEXT_ACTION_EVENT, listener as EventListener);
    return () => window.removeEventListener(CONTEXT_ACTION_EVENT, listener as EventListener);
  }, []);

  useEffect(() => {
    const capture = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (shouldIgnoreClick(target)) return;
      const explicitContext = buildContextFromExplicitClick(target);
      const context = explicitContext || buildContextFromPath(location.pathname);
      if (!context) return;
      const kind = resolveActionKindFromClick(target);
      if (!kind) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      resetMissingState();
      setRequest({ ...context, kind });
    };

    document.addEventListener('click', capture, true);
    return () => document.removeEventListener('click', capture, true);
  }, [location.pathname]);

  const context = useMemo(() => request ? { ...request } : null, [request]);
  const close = () => {
    setRequest(null);
    resetMissingState();
  };

  const handleSaved = async (savedRecord?: unknown) => {
    const savedRequest = request ? { ...request } : null;
    close();
    if (typeof window !== 'undefined' && savedRequest) {
      window.dispatchEvent(new CustomEvent(CONTEXT_ACTION_SAVED_EVENT, {
        detail: {
          ...savedRequest,
          source: 'ContextActionDialogsHost',
          savedRecord: savedRecord || null,
          savedAt: new Date().toISOString(),
          savedRecord: savedRecord ?? null,
        },
      }));
    }
  };

  const handleSaveBlocker = async () => {
    if (!request || request.kind !== 'blocker') return;
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      setMissingError('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }

    let draft;
    try {
      draft = buildMissingItemModalDraft(
        {
          entityType: request.recordType,
          entityId: request.recordId,
          entityLabel: request.recordLabel || (request.recordType === 'lead' ? 'Lead' : request.recordType === 'client' ? 'Klient' : 'Sprawa'),
        },
        { title: missingTitle, note: missingNote },
      );
    } catch (error: any) {
      setMissingError(error?.message || 'Wpisz, czego brakuje.');
      return;
    }

    const now = new Date().toISOString();
    const leadId = request.leadId || (request.recordType === 'lead' ? request.recordId : null);
    const clientId = request.clientId || (request.recordType === 'client' ? request.recordId : null);
    const caseId = request.caseId || (request.recordType === 'case' ? request.recordId : null);

    try {
      setMissingSaving(true);
      setMissingError('');

      if (request.recordType === 'case') {
        if (!caseId) {
          throw new Error('Brak ID sprawy. Nie można dodać braku.');
        }

        await insertCaseItemToSupabase({
          caseId,
          title: draft.title,
          description: draft.note || '',
          type: 'text',
          status: 'missing',
          isRequired: true,
          dueDate: null,
        });

        await insertActivityToSupabase({
          caseId,
          clientId: clientId || null,
          leadId: leadId || null,
          actorType: 'operator',
          eventType: 'item_added',
          payload: {
            source: 'context_action_dialogs_blocker',
            marker: 'stage228r12_context_action_blocker_case',
            type: 'missing_item',
            kind: 'missing_item',
            title: draft.title,
            itemTitle: draft.title,
            description: draft.note || null,
            note: draft.note || null,
            dueDate: null,
            caseTitle: request.recordLabel || null,
            entityType: draft.entityType,
            entityId: draft.entityId,
            persistenceTarget: draft.persistenceTarget,
          },
          workspaceId,
        } as any);
      } else {
        const createdMissingTask = await insertTaskToSupabase({
          title: draft.title,
          type: 'missing_item',
          status: 'missing_item',
          priority: 'high',
          leadId: leadId || null,
          clientId: clientId || null,
          caseId: caseId || null,
          scheduledAt: now,
          dueAt: now,
          workspaceId,
        } as any);

        await insertActivityToSupabase({
          leadId: leadId || null,
          clientId: clientId || null,
          caseId: caseId || null,
          actorType: 'operator',
          eventType: 'missing_item_created',
          payload: {
            source: 'context_action_dialogs_blocker',
            marker: request.recordType === 'lead' ? 'stage228r12_context_action_blocker_lead' : 'stage228r12_context_action_blocker_client',
            recordType: request.recordType,
            kind: 'missing_item',
            type: 'missing_item',
            status: 'missing_item',
            title: draft.title,
            note: draft.note,
            content: draft.note,
            createdAt: now,
            entityType: draft.entityType,
            entityId: draft.entityId,
            persistenceTarget: draft.persistenceTarget,
          },
          workspaceId,
        } as any);
      }

      if (request.recordType !== 'case') {
        emitCloseflowWorkItemNoFlickerMutation({
          action: 'create',
          kind: 'task',
          item: typeof createdMissingTask !== 'undefined' ? createdMissingTask : null,
          id: (typeof createdMissingTask !== 'undefined' && (createdMissingTask as any)?.id) || null,
          recordType: request.recordType,
          recordId: request.recordId,
          leadId: leadId || null,
          clientId: clientId || null,
          caseId: caseId || null,
          source: 'stage228r48_context_blocker_create_no_flicker',
        });
      }

      toast.success('Brak dodany');
      await handleSaved(typeof createdMissingTask !== 'undefined' ? createdMissingTask : undefined);
    } catch (error: any) {
      const message = error?.message || 'REQUEST_FAILED';
      setMissingError('Nie udało się zapisać braku: ' + message);
      toast.error('Nie udało się zapisać braku: ' + message);
    } finally {
      setMissingSaving(false);
    }
  };

  const openTask = request?.kind === 'task';
  const openEvent = request?.kind === 'event';
  const openNote = request?.kind === 'note';
  const openBlocker = request?.kind === 'blocker';
  const missingContext = context ? {
    entityType: context.recordType,
    entityId: context.recordId,
    entityLabel: context.recordLabel || (context.recordType === 'lead' ? 'Lead' : context.recordType === 'client' ? 'Klient' : 'Sprawa'),
  } : { entityType: 'lead' as const, entityId: '', entityLabel: 'Brak' };

  return (
    <div data-context-action-dialog-host="true" data-stage="stage85-context-action-dialog-unification" data-stage15="STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT" data-stage17={STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY} data-stage228r12-context-action-blocker-host="true" data-context-action-contract-kinds={Object.keys(CONTEXT_ACTION_CONTRACT).join(',')} style={{ display: 'contents' }}>
      <TaskCreateDialog open={openTask} onOpenChange={(open) => (open ? null : close())} onSaved={handleSaved} context={context || undefined} />
      <EventCreateDialog open={openEvent} onOpenChange={(open) => (open ? null : close())} onSaved={handleSaved} context={context || undefined} />
      <ContextNoteDialog open={openNote} onOpenChange={(open) => (open ? null : close())} onSaved={handleSaved} context={context || undefined} />
      <MissingItemQuickActionModal
        open={openBlocker}
        context={missingContext}
        titleValue={missingTitle}
        noteValue={missingNote}
        error={missingError}
        isSaving={missingSaving}
        onTitleChange={(value) => { setMissingTitle(value); if (missingError) setMissingError(''); }}
        onNoteChange={setMissingNote}
        onCancel={close}
        onSubmit={handleSaveBlocker}
      />
    </div>
  );
}
