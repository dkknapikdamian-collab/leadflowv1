export const STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL =
  'Stage227C2 keeps Brak as a small required-title modal before persistence wiring';

export const STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT =
  'Brak modal stores explicit missingKind, blocksProgress and blockScope for lead missing/blocker source of truth';

export type MissingItemEntityType = 'lead' | 'client' | 'case';

export type MissingItemPersistenceTarget = 'task_activity_missing_item' | 'case_items';

export type MissingItemKind = 'document' | 'decision' | 'contact' | 'payment' | 'data' | 'other';

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
  missingKind: MissingItemKind;
  blocksProgress: boolean;
  blockScope: string;
}

export interface MissingItemModalField {
  name: 'title' | 'note' | 'missingKind' | 'blocksProgress' | 'blockScope';
  label: string;
  required: boolean;
  placeholder: string;
}

export const MISSING_ITEM_QUICK_ACTION_LABEL = 'Brak';

export const MISSING_ITEM_KIND_LABELS: Record<MissingItemKind, string> = {
  document: 'Dokument',
  decision: 'Decyzja',
  contact: 'Kontakt',
  payment: 'Płatność',
  data: 'Dane',
  other: 'Inne',
};

export const MISSING_ITEM_MODAL_COPY = {
  title: 'Dodaj brak',
  submit: 'Zapisz brak',
  cancel: 'Anuluj',
  requiredTitleMessage: 'Wpisz, czego brakuje.',
  noteHelp: 'Krótka notatka jest opcjonalna.',
  blocksProgressLabel: 'Blokuje dalszy ruch',
} as const;

export const MISSING_ITEM_MODAL_FIELDS: MissingItemModalField[] = [
  {
    name: 'title',
    label: 'Czego brakuje?',
    required: true,
    placeholder: 'Np. podpisanej umowy albo decyzji klienta',
  },
  {
    name: 'missingKind',
    label: 'Typ braku',
    required: true,
    placeholder: 'Wybierz typ',
  },
  {
    name: 'blocksProgress',
    label: MISSING_ITEM_MODAL_COPY.blocksProgressLabel,
    required: false,
    placeholder: '',
  },
  {
    name: 'blockScope',
    label: 'Co blokuje?',
    required: false,
    placeholder: 'Np. wysłanie oferty, podpisanie umowy, start sprawy',
  },
  {
    name: 'note',
    label: 'Notatka',
    required: false,
    placeholder: 'Opcjonalnie: krótki kontekst',
  },
];

export function normalizeMissingItemTitle(value: string): string {
  return value.trim().replace(/s+/g, ' ');
}

export function normalizeMissingItemKind(value: unknown): MissingItemKind {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'document' || normalized === 'decision' || normalized === 'contact' || normalized === 'payment' || normalized === 'data' || normalized === 'other') {
    return normalized;
  }
  return 'document';
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
  input: { title: string; note?: string; missingKind?: unknown; blocksProgress?: boolean; blockScope?: string },
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
    persistenceTarget: getMissingItemPersistenceTarget(context.entityType),
    missingKind: normalizeMissingItemKind(input.missingKind),
    blocksProgress: input.blocksProgress !== false,
    blockScope: (input.blockScope || '').trim(),
  };
}

export function getMissingItemModalFields(): MissingItemModalField[] {
  return MISSING_ITEM_MODAL_FIELDS;
}

export function getMissingItemQuickActionLabel(): string {
  return MISSING_ITEM_QUICK_ACTION_LABEL;
}
