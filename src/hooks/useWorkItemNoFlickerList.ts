import { useEffect, useRef } from 'react';
import {
  CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT,
  type WorkItemNoFlickerMutationDetail,
} from '../lib/work-items/no-flicker-mutation';

type ListSetter = (updater: (previous: any[]) => any[]) => void;

type UseWorkItemNoFlickerListInput = {
  scope?: 'lead' | 'client' | 'case' | 'all' | 'tasks' | 'events';
  entityId?: string | null;
  setTasks?: ListSetter;
  setEvents?: ListSetter;
};

function readId(value: unknown) {
  return String(value || '').trim();
}

function readKind(row: any, fallback: 'task' | 'event'): 'task' | 'event' {
  const recordType = String(row?.record_type || row?.recordType || row?.kind || '').toLowerCase();
  if (recordType === 'event') return 'event';
  if (recordType === 'task') return 'task';
  return fallback;
}

function readRelation(row: any, key: 'lead' | 'client' | 'case') {
  if (key === 'lead') return readId(row?.lead_id || row?.leadId);
  if (key === 'client') return readId(row?.client_id || row?.clientId);
  return readId(row?.case_id || row?.caseId);
}

function belongsToScope(row: any, detail: WorkItemNoFlickerMutationDetail, scope: UseWorkItemNoFlickerListInput['scope'], entityId: string) {
  if (!scope || scope === 'all' || scope === 'tasks' || scope === 'events') return true;
  if (!entityId) return true;
  const fromDetail =
    scope === 'lead' ? readId(detail.leadId) :
    scope === 'client' ? readId(detail.clientId) :
    readId(detail.caseId);
  const fromRow = readRelation(row, scope);
  return fromDetail === entityId || fromRow === entityId || readId(detail.recordId) === entityId;
}

function upsertById(previous: any[], row: any) {
  const id = readId(row?.id);
  if (!id) return previous;
  const without = previous.filter((item) => readId(item?.id) !== id);
  return [row, ...without];
}

function removeById(previous: any[], id: string) {
  if (!id) return previous;
  return previous.filter((item) => readId(item?.id) !== id);
}

function coerceMutationDetailFromContextSaved(detail: any): WorkItemNoFlickerMutationDetail | null {
  const item = detail?.savedRecord || detail?.item || null;
  if (!item || typeof item !== 'object') return null;
  const kind = readKind(item, detail?.kind === 'event' ? 'event' : 'task');
  if (kind !== 'task' && kind !== 'event') return null;
  return {
    action: 'upsert',
    kind,
    item,
    id: readId(item?.id),
    recordType: detail?.recordType || null,
    recordId: detail?.recordId || null,
    leadId: detail?.leadId || item?.leadId || item?.lead_id || null,
    clientId: detail?.clientId || item?.clientId || item?.client_id || null,
    caseId: detail?.caseId || item?.caseId || item?.case_id || null,
    source: 'stage228r48_context_action_saved_capture',
  };
}

export function useWorkItemNoFlickerList(input: UseWorkItemNoFlickerListInput) {
  const lastLocalMutationAtRef = useRef(0);

  useEffect(() => {
    const scope = input.scope || 'all';
    const entityId = readId(input.entityId);

    const applyDetail = (detail: WorkItemNoFlickerMutationDetail | null) => {
      if (!detail) return false;
      const item = detail.item && typeof detail.item === 'object' ? detail.item as any : null;
      const id = readId(detail.id || item?.id);
      const kind = detail.kind || readKind(item, 'task');
      const row = item || { id, leadId: detail.leadId, clientId: detail.clientId, caseId: detail.caseId };

      if (!belongsToScope(row, detail, scope, entityId)) return false;

      if (kind === 'task' && input.setTasks) {
        if (detail.action === 'delete') input.setTasks((previous) => removeById(Array.isArray(previous) ? previous : [], id));
        else if (item) input.setTasks((previous) => upsertById(Array.isArray(previous) ? previous : [], item));
      }

      if (kind === 'event' && input.setEvents) {
        if (detail.action === 'delete') input.setEvents((previous) => removeById(Array.isArray(previous) ? previous : [], id));
        else if (item) input.setEvents((previous) => upsertById(Array.isArray(previous) ? previous : [], item));
      }

      lastLocalMutationAtRef.current = Date.now();
      return true;
    };

    const onOptimisticMutation = (event: Event) => {
      applyDetail((event as CustomEvent<WorkItemNoFlickerMutationDetail>).detail || null);
    };

    const onContextSavedCapture = (event: Event) => {
      const detail = coerceMutationDetailFromContextSaved((event as CustomEvent<any>).detail || null);
      if (!detail) return;
      if (applyDetail(detail)) {
        event.stopImmediatePropagation?.();
      }
    };

    const onDataMutatedCapture = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail || {};
      const entity = String(detail.entity || '').toLowerCase();
      const method = String(detail.method || '').toUpperCase();
      if ((entity === 'task' || entity === 'event') && method !== 'GET' && Date.now() - lastLocalMutationAtRef.current < 1800) {
        event.stopImmediatePropagation?.();
      }
    };

    window.addEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT, onOptimisticMutation as EventListener);
    window.addEventListener('closeflow:context-action-saved', onContextSavedCapture as EventListener, true);
    window.addEventListener('closeflow:data-mutated', onDataMutatedCapture as EventListener, true);
    return () => {
      window.removeEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT, onOptimisticMutation as EventListener);
      window.removeEventListener('closeflow:context-action-saved', onContextSavedCapture as EventListener, true);
      window.removeEventListener('closeflow:data-mutated', onDataMutatedCapture as EventListener, true);
    };
  }, [input.scope, input.entityId, input.setTasks, input.setEvents]);
}
