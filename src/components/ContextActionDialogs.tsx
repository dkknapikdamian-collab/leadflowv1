import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CONTEXT_ACTION_CONTRACT, STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1 } from '../lib/context-action-contract';
import TaskCreateDialog, { type TaskCreateDialogContext } from './TaskCreateDialog';
import EventCreateDialog from './EventCreateDialog';
import ContextNoteDialog from './ContextNoteDialog';

export type ContextActionKind = 'task' | 'event' | 'note';
export type ContextRecordType = 'lead' | 'client' | 'case';

export type ContextActionRequest = TaskCreateDialogContext & {
  kind: ContextActionKind;
};

const CONTEXT_ACTION_EVENT = 'closeflow:context-action-dialog';
const STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION = 'Context detail actions use one shared task, event and note dialog host';
const STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY = STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1;
const STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT = 'Explicit data-context-action-kind routes task, event and note through the same shared dialog host';
export const CONTEXT_ACTION_KIND_ATTR = 'data-context-action-kind';
export const CONTEXT_ACTION_RECORD_TYPE_ATTR = 'data-context-record-type';
export const CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id';

function normalizeText(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeContextActionKind(value: unknown): ContextActionKind | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'task' || normalized === 'event' || normalized === 'note') return normalized;
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
  return {
    recordType,
    recordId,
    recordLabel,
    leadId: recordType === 'lead' ? recordId : null,
    clientId: recordType === 'client' ? recordId : null,
    caseId: recordType === 'case' ? recordId : null,
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
  return null;
}

export function openContextQuickAction(request: ContextActionRequest) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ContextActionRequest>(CONTEXT_ACTION_EVENT, { detail: request }));
}

export default function ContextActionDialogsHost() {
  const location = useLocation();
  const [request, setRequest] = useState<ContextActionRequest | null>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<ContextActionRequest>).detail;
      if (!detail?.kind || !detail?.recordType || !detail?.recordId) return;
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
      setRequest({ ...context, kind });
    };

    document.addEventListener('click', capture, true);
    return () => document.removeEventListener('click', capture, true);
  }, [location.pathname]);

  const context = useMemo(() => request ? { ...request } : null, [request]);
  const close = () => setRequest(null);
  const openTask = request?.kind === 'task';
  const openEvent = request?.kind === 'event';
  const openNote = request?.kind === 'note';

  return (
    <div data-context-action-dialog-host="true" data-stage="stage85-context-action-dialog-unification" data-stage15="STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT" data-stage17={STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY} data-context-action-contract-kinds={Object.keys(CONTEXT_ACTION_CONTRACT).join(',')} style={{ display: 'contents' }}>
      <TaskCreateDialog open={openTask} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />
      <EventCreateDialog open={openEvent} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />
      <ContextNoteDialog open={openNote} onOpenChange={(open) => (open ? null : close())} onSaved={close} context={context || undefined} />
    </div>
  );
}
