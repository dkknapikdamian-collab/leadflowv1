export const STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL =
  'Stage227C2 keeps Brak as a small required-title modal before persistence wiring';

export type MissingItemEntityType = 'lead' | 'client' | 'case';

export type MissingItemPersistenceTarget = 'task_activity_missing_item' | 'case_items';

export interface MissingItemModalContext {
  entityType: MissingItemEntityType;
  entityId: string;
  entityLabel: string;
}

export interface MissingItemModalDraft {
  title: string;
  note: string;
  entityType: MissingItemEntityType;
  entityId: string;
  persistenceTarget: MissingItemPersistenceTarget;
}

export interface MissingItemModalField {
  name: 'title' | 'note';
  label: string;
  required: boolean;
  placeholder: string;
}

export const MISSING_ITEM_QUICK_ACTION_LABEL = 'Brak';

export const MISSING_ITEM_MODAL_COPY = {
  title: 'Dodaj brak',
  submit: 'Zapisz brak',
  cancel: 'Anuluj',
  requiredTitleMessage: 'Wpisz, czego brakuje.',
  noteHelp: 'Krótka notatka jest opcjonalna. Nie budujemy tu pełnej checklisty.'
} as const;

export const MISSING_ITEM_MODAL_FIELDS: MissingItemModalField[] = [
  {
    name: 'title',
    label: 'Czego brakuje?',
    required: true,
    placeholder: 'Np. Brak podpisanej umowy'
  },
  {
    name: 'note',
    label: 'Notatka',
    required: false,
    placeholder: 'Opcjonalnie: krótki kontekst'
  }
];

export function normalizeMissingItemTitle(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function getMissingItemPersistenceTarget(entityType: MissingItemEntityType): MissingItemPersistenceTarget {
  return entityType === 'case' ? 'case_items' : 'task_activity_missing_item';
}

export function validateMissingItemTitle(value: string): { ok: true; title: string } | { ok: false; error: string } {
  const title = normalizeMissingItemTitle(value);
  if (!title) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredTitleMessage };
  }
  return { ok: true, title };
}

export function buildMissingItemModalDraft(
  context: MissingItemModalContext,
  input: { title: string; note?: string }
): MissingItemModalDraft {
  const result = validateMissingItemTitle(input.title);
  if (!result.ok) {
    throw new Error(result.error);
  }

  return {
    title: result.title,
    note: (input.note || '').trim(),
    entityType: context.entityType,
    entityId: context.entityId,
    persistenceTarget: getMissingItemPersistenceTarget(context.entityType)
  };
}

export function getMissingItemModalFields(): MissingItemModalField[] {
  return MISSING_ITEM_MODAL_FIELDS;
}

export function getMissingItemQuickActionLabel(): string {
  return MISSING_ITEM_QUICK_ACTION_LABEL;
}
