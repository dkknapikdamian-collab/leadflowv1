export const STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL =
  'Stage227C2 is the shared Brak modal contract; FRT-017 adds the real calm-light blocker form without a parallel store';

export const STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT =
  'Active lead, client and case missing/blocker records use task/activity source of truth; case_items remain legacy/checklist compatibility';

export type MissingItemEntityType = 'lead' | 'client' | 'case';

export type MissingItemPersistenceTarget = 'task_activity_missing_item';

export type MissingItemKind = 'document' | 'decision' | 'contact' | 'payment' | 'data' | 'other';
export type MissingItemPriority = 'low' | 'medium' | 'high';

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
  priority: MissingItemPriority;
  dueDate: string;
  blocksProgress: boolean;
  blockScope: string;
}

export interface MissingItemModalField {
  name: 'title' | 'note' | 'missingKind' | 'priority' | 'dueDate' | 'blocksProgress' | 'blockScope';
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
  title: 'Dodaj brak / blokadę',
  subtitle: 'Zarejestruj brakujące elementy lub blokady, które mogą wpływać na realizację projektu.',
  submit: 'Dodaj brak',
  cancel: 'Anuluj',
  requiredTitleMessage: 'Wpisz tytuł braku.',
  requiredKindMessage: 'Wybierz kategorię braku.',
  requiredPriorityMessage: 'Wybierz poziom pilności.',
  requiredNoteMessage: 'Dodaj opis braku lub blokady.',
  requiredDueDateMessage: 'Wybierz oczekiwany termin.',
  titleHelp: 'Krótki, jednoznaczny tytuł pozwoli szybko zidentyfikować problem.',
  categoryHelp: 'Wybierz obszar, którego dotyczy brak lub blokada.',
  noteHelp: 'Podaj więcej szczegółów — co jest potrzebne i dlaczego to blokuje postęp.',
  priorityHelp: 'Określ, jak pilne jest rozwiązanie tego braku.',
  dueDateHelp: 'Data, do której brak powinien zostać usunięty.',
  blocksProgressLabel: 'Czy blokuje start realizacji?',
  blockScopeLabel: 'Co blokuje?',
  blocksProgressHelp: 'Włącz, jeśli brak uniemożliwia rozpoczęcie projektu.',
  priorityLabel: 'Poziom pilności',
  dueDateLabel: 'Termin oczekiwany',
  responsibleLabel: 'Odpowiedzialny',
  clientDecisionLabel: 'Czy wymaga decyzji klienta?',
  unsupportedResponsible: 'Brak przypisania w bieżącym kontrakcie.',
  unsupportedClientDecision: 'Brak pola w bieżącym kontrakcie.',
} as const;

export const MISSING_ITEM_MODAL_FIELDS: MissingItemModalField[] = [
  {
    name: 'title',
    label: 'Tytuł braku',
    required: true,
    placeholder: 'Np. Brak briefu, Brak akceptacji oferty, Brak materiałów produkcyjnych',
  },
  {
    name: 'missingKind',
    label: 'Kategoria',
    required: true,
    placeholder: 'Wybierz kategorię',
  },
  {
    name: 'priority',
    label: MISSING_ITEM_MODAL_COPY.priorityLabel,
    required: true,
    placeholder: 'Wybierz poziom pilności',
  },
  {
    name: 'dueDate',
    label: MISSING_ITEM_MODAL_COPY.dueDateLabel,
    required: true,
    placeholder: 'RRRR-MM-DD',
  },
  {
    name: 'blocksProgress',
    label: MISSING_ITEM_MODAL_COPY.blocksProgressLabel,
    required: false,
    placeholder: '',
  },
  {
    name: 'blockScope',
    label: MISSING_ITEM_MODAL_COPY.blockScopeLabel,
    required: false,
    placeholder: 'Np. wysłanie oferty, podpisanie umowy, start sprawy',
  },
  {
    name: 'note',
    label: 'Opis',
    required: true,
    placeholder: 'Opisz, na czym polega brak lub blokada i jaki ma wpływ na projekt.',
  },
];

export function normalizeMissingItemTitle(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeMissingItemKind(value: unknown): MissingItemKind {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'document' || normalized === 'decision' || normalized === 'contact' || normalized === 'payment' || normalized === 'data' || normalized === 'other') {
    return normalized;
  }
  return 'document';
}

export function validateMissingItemKind(value: unknown): { ok: true; missingKind: MissingItemKind } | { ok: false; error: string } {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized || !Object.prototype.hasOwnProperty.call(MISSING_ITEM_KIND_LABELS, normalized)) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredKindMessage };
  }
  return { ok: true, missingKind: normalized as MissingItemKind };
}

export function getMissingItemPersistenceTarget(_entityType: MissingItemEntityType): MissingItemPersistenceTarget {
  return 'task_activity_missing_item';
}

export function validateMissingItemTitle(value: string): { ok: true; title: string } | { ok: false; error: string } {
  const title = normalizeMissingItemTitle(value);
  if (!title) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredTitleMessage };
  }
  return { ok: true, title };
}

export function normalizeMissingItemPriority(value: unknown): MissingItemPriority {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized;
  return 'medium';
}

export function validateMissingItemPriority(value: unknown): { ok: true; priority: MissingItemPriority } | { ok: false; error: string } {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized !== 'low' && normalized !== 'medium' && normalized !== 'high') {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredPriorityMessage };
  }
  return { ok: true, priority: normalized };
}

export function validateMissingItemNote(value: string): { ok: true; note: string } | { ok: false; error: string } {
  const note = String(value || '').trim();
  if (!note) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredNoteMessage };
  }
  return { ok: true, note };
}

export function validateMissingItemDueDate(value: string): { ok: true; dueDate: string } | { ok: false; error: string } {
  const dueDate = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredDueDateMessage };
  }
  const [year, month, day] = dueDate.split('-').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isInteger(year)
    || !Number.isInteger(month)
    || !Number.isInteger(day)
    || year < 1
    || calendarDate.getUTCFullYear() !== year
    || calendarDate.getUTCMonth() !== month - 1
    || calendarDate.getUTCDate() !== day
  ) {
    return { ok: false, error: MISSING_ITEM_MODAL_COPY.requiredDueDateMessage };
  }
  return { ok: true, dueDate };
}

export function buildMissingItemModalDraft(
  context: MissingItemModalContext,
  input: {
    title: string;
    note?: string;
    missingKind?: unknown;
    priority?: unknown;
    dueDate?: string;
    blocksProgress?: boolean;
    blockScope?: string;
  },
): MissingItemModalDraft {
  const result = validateMissingItemTitle(input.title);
  if (result.ok === false) {
    throw new Error(result.error);
  }

  const kindResult = validateMissingItemKind(input.missingKind);
  if (kindResult.ok === false) {
    throw new Error(kindResult.error);
  }

  const priorityResult = validateMissingItemPriority(input.priority);
  if (priorityResult.ok === false) {
    throw new Error(priorityResult.error);
  }

  const noteResult = validateMissingItemNote(input.note || '');
  if (noteResult.ok === false) {
    throw new Error(noteResult.error);
  }

  const dueDateResult = validateMissingItemDueDate(input.dueDate || '');
  if (dueDateResult.ok === false) {
    throw new Error(dueDateResult.error);
  }

  return {
    title: result.title,
    note: noteResult.note,
    entityType: context.entityType,
    entityId: context.entityId,
    persistenceTarget: getMissingItemPersistenceTarget(context.entityType),
    missingKind: kindResult.missingKind,
    priority: priorityResult.priority,
    dueDate: dueDateResult.dueDate,
    blocksProgress: input.blocksProgress === true,
    blockScope: (input.blockScope || '').trim(),
  };
}

export function getMissingItemModalFields(): MissingItemModalField[] {
  return MISSING_ITEM_MODAL_FIELDS;
}

export function getMissingItemQuickActionLabel(): string {
  return MISSING_ITEM_QUICK_ACTION_LABEL;
}
