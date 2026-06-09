
export type CloseflowWorkItemNoFlickerKind = 'task' | 'event';
export type CloseflowWorkItemNoFlickerAction = 'create' | 'update' | 'delete';

export type CloseflowWorkItemNoFlickerMutation = {
  action: CloseflowWorkItemNoFlickerAction;
  kind: CloseflowWorkItemNoFlickerKind;
  id?: string;
  record?: unknown;
  source?: string;
  occurredAt?: string;
};

export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION = 'closeflow:work-item-no-flicker-mutation';

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
