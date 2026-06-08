export const STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1 = 'STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1';

export const CONTEXT_ACTION_KIND_VALUES = ['task', 'event', 'note', 'blocker'] as const;
export const CONTEXT_RECORD_TYPE_VALUES = ['lead', 'client', 'case'] as const;

export type ContextActionContractKind = (typeof CONTEXT_ACTION_KIND_VALUES)[number];
export type ContextActionContractRecordType = (typeof CONTEXT_RECORD_TYPE_VALUES)[number];

export type ContextActionContractEntry = {
  kind: ContextActionContractKind;
  label: string;
  dialogComponent: 'TaskCreateDialog' | 'EventCreateDialog' | 'ContextNoteDialog' | 'MissingItemQuickActionModal';
  persistenceTarget: 'tasks' | 'events' | 'activities' | 'task_activity_missing_item' | 'case_items';
  relationKeys: readonly ['leadId', 'caseId', 'clientId', 'workspaceId'];
  allowedRecordTypes: readonly ContextActionContractRecordType[];
};

export const CONTEXT_ACTION_CONTRACT: Record<ContextActionContractKind, ContextActionContractEntry> = {
  task: {
    kind: 'task',
    label: 'Zadanie',
    dialogComponent: 'TaskCreateDialog',
    persistenceTarget: 'tasks',
    relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId'],
    allowedRecordTypes: CONTEXT_RECORD_TYPE_VALUES,
  },
  event: {
    kind: 'event',
    label: 'Wydarzenie',
    dialogComponent: 'EventCreateDialog',
    persistenceTarget: 'events',
    relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId'],
    allowedRecordTypes: CONTEXT_RECORD_TYPE_VALUES,
  },
  note: {
    kind: 'note',
    label: 'Notatka',
    dialogComponent: 'ContextNoteDialog',
    persistenceTarget: 'activities',
    relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId'],
    allowedRecordTypes: CONTEXT_RECORD_TYPE_VALUES,
  },
  blocker: {
    kind: 'blocker',
    label: 'Brak',
    dialogComponent: 'MissingItemQuickActionModal',
    persistenceTarget: 'task_activity_missing_item',
    relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId'],
    allowedRecordTypes: CONTEXT_RECORD_TYPE_VALUES,
  },
} as const;

export function isContextActionContractKind(value: unknown): value is ContextActionContractKind {
  return CONTEXT_ACTION_KIND_VALUES.includes(String(value || '').trim().toLowerCase() as ContextActionContractKind);
}

export function normalizeContextActionContractKind(value: unknown): ContextActionContractKind | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'missing' || normalized === 'missing_item' || normalized === 'brak') return 'blocker';
  return isContextActionContractKind(normalized) ? normalized : null;
}

export function getContextActionContract(kind: unknown): ContextActionContractEntry | null {
  const normalized = normalizeContextActionContractKind(kind);
  return normalized ? CONTEXT_ACTION_CONTRACT[normalized] : null;
}
