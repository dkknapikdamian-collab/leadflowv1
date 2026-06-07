// STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT
// Minimal contract only. No SQL, no Supabase migration, no new table.
// Runtime implementation belongs to the next stage.

export type Stage227C1MissingItemEntityType = 'lead' | 'client' | 'case';

export type Stage227C1MissingItemPersistenceTarget =
  | 'task_or_activity_missing_item'
  | 'case_items_missing';

export type Stage227C1MissingItemStatus = 'open' | 'resolved';

export interface Stage227C1MissingItemInput {
  entityType: Stage227C1MissingItemEntityType;
  entityId: string;
  title: string;
  note?: string;
}

export interface Stage227C1MissingItemDraft extends Stage227C1MissingItemInput {
  status: Stage227C1MissingItemStatus;
  persistenceTarget: Stage227C1MissingItemPersistenceTarget;
}

export const STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT =
  'Brak is a lightweight quick action for Lead/Client/Case, backed by existing task/activity or case_items, without a new table';

export function getStage227C1PersistenceTarget(
  entityType: Stage227C1MissingItemEntityType,
): Stage227C1MissingItemPersistenceTarget {
  if (entityType === 'case') {
    return 'case_items_missing';
  }
  return 'task_or_activity_missing_item';
}

export function normalizeStage227C1MissingItemInput(
  input: Stage227C1MissingItemInput,
): Stage227C1MissingItemDraft {
  const title = String(input.title || '').trim();
  if (!title) {
    throw new Error('Missing item title is required');
  }

  return {
    entityType: input.entityType,
    entityId: String(input.entityId || '').trim(),
    title,
    note: input.note ? String(input.note).trim() : undefined,
    status: 'open',
    persistenceTarget: getStage227C1PersistenceTarget(input.entityType),
  };
}
