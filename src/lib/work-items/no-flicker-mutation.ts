
export type CloseflowWorkItemNoFlickerKind = 'task' | 'event';
export type CloseflowWorkItemNoFlickerAction = 'create' | 'update' | 'delete' | 'upsert';

export type CloseflowWorkItemNoFlickerMutation = {
  action: CloseflowWorkItemNoFlickerAction;
  kind: CloseflowWorkItemNoFlickerKind;
  id?: string;
  item?: unknown;
  record?: unknown;
  recordType?: string | null;
  recordId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
  caseId?: string | null;
  displayKind?: string | null;
  businessKind?: string | null;
  source?: string;
  occurredAt?: string;
};

export type WorkItemNoFlickerMutationDetail = CloseflowWorkItemNoFlickerMutation;

export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION = 'closeflow:work-item-no-flicker-mutation';
export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT = CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION;

export function normalizeWorkItemMutationId(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const id = record.id;
    return typeof id === 'string' ? id.trim() : '';
  }
  return '';
}

export function emitCloseflowWorkItemNoFlickerMutation(input: CloseflowWorkItemNoFlickerMutation) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<CloseflowWorkItemNoFlickerMutation>(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, {
    detail: {
      ...input,
      id: normalizeWorkItemMutationId(input.id || input.record),
      occurredAt: input.occurredAt || new Date().toISOString(),
    },
  }));
}

export function subscribeCloseflowWorkItemNoFlickerMutations(handler: (detail: CloseflowWorkItemNoFlickerMutation) => void) {
  if (typeof window === 'undefined') return () => {};
  const listener = (event: Event) => {
    handler((event as CustomEvent<CloseflowWorkItemNoFlickerMutation>).detail);
  };
  window.addEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener);
  return () => window.removeEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener);
}
