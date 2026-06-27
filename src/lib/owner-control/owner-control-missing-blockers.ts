import { normalizeWorkItem } from '../work-items/normalize';
import { caseDetailPath, clientDetailPath, leadDetailPath } from '../routes';
import type { OwnerControlItem } from './owner-control-baseline';

const STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION = 'STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION';
void STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION;

type MissingSourceEntityType = 'lead' | 'case' | 'client';

const CLOSED_MISSING_ITEM_STATUSES = new Set([
  'resolved', 'deleted', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'archived',
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readBoolean(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes', 'tak'].includes(normalized)) return true;
      if (['false', '0', 'no', 'nie'].includes(normalized)) return false;
    }
  }
  return false;
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function normalizeSourceEntityType(value: unknown): MissingSourceEntityType | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'lead') return 'lead';
  if (normalized === 'case' || normalized === 'sprawa') return 'case';
  if (normalized === 'client' || normalized === 'klient') return 'client';
  return null;
}

function getSourceLabel(sourceEntityType: MissingSourceEntityType) {
  if (sourceEntityType === 'lead') return 'Lead' as const;
  if (sourceEntityType === 'case') return 'Sprawa' as const;
  return 'Klient' as const;
}

function getSourceHref(sourceEntityType: MissingSourceEntityType, sourceEntityId: string) {
  if (sourceEntityType === 'lead') return leadDetailPath(sourceEntityId);
  if (sourceEntityType === 'case') return caseDetailPath(sourceEntityId);
  return clientDetailPath(sourceEntityId);
}

export function isOwnerMissingControlItem(input: unknown) {
  const record = asRecord(input);
  const status = readString(record, ['status']).toLowerCase();
  const type = readString(record, ['type', 'kind', 'recordType', 'record_type']).toLowerCase();
  const missingKind = readString(record, ['missingKind', 'missing_kind']).toLowerCase();

  if (CLOSED_MISSING_ITEM_STATUSES.has(status)) return false;

  return status === 'missing_item'
    || status === 'blocking_missing_item'
    || type === 'missing_item'
    || type === 'blocking_missing_item'
    || Boolean(missingKind)
    || readBoolean(record, ['blocksProgress', 'blocks_progress']);
}

function isBlockingMissingItem(record: Record<string, unknown>) {
  const status = readString(record, ['status']).toLowerCase();
  return status === 'blocking_missing_item' || readBoolean(record, ['blocksProgress', 'blocks_progress']);
}

function resolveMissingSource(input: unknown) {
  const record = asRecord(input);
  const normalized = normalizeWorkItem(record);
  const declaredType = normalizeSourceEntityType(readString(record, [
    'sourceEntityType', 'source_entity_type', 'entityType', 'entity_type', 'recordType', 'record_type',
  ]));

  const sourceEntityType = declaredType
    || (normalized.caseId ? 'case' as const : null)
    || (normalized.leadId ? 'lead' as const : null)
    || (normalized.clientId ? 'client' as const : null);

  if (!sourceEntityType) return null;

  const declaredId = readString(record, ['sourceEntityId', 'source_entity_id', 'recordId', 'record_id']);
  const sourceEntityId = sourceEntityType === 'case'
    ? (normalized.caseId || declaredId)
    : sourceEntityType === 'lead'
      ? (normalized.leadId || declaredId)
      : (normalized.clientId || declaredId);

  if (!sourceEntityId || !normalized.id) return null;

  return { record, normalized, sourceEntityType, sourceEntityId };
}

export function buildMissingOwnerControlItems(input: { tasks?: unknown[]; now?: Date }): OwnerControlItem[] {
  const deduped = new Map<string, OwnerControlItem>();
  void input.now;

  for (const item of input.tasks || []) {
    if (!isOwnerMissingControlItem(item)) continue;
    const source = resolveMissingSource(item);
    if (!source) continue;

    const sourceLabel = getSourceLabel(source.sourceEntityType);
    const blocking = isBlockingMissingItem(source.record);
    const title = source.normalized.title || readString(source.record, ['title', 'name'], 'Brak do uzupelnienia');
    const createdAt = source.normalized.dateAt || readString(source.record, ['createdAt', 'created_at', 'updatedAt', 'updated_at']) || null;
    const sourceKey = `${source.sourceEntityType}:${source.sourceEntityId}:${source.normalized.id}`;

    const row: OwnerControlItem = {
      key: `missing:${sourceKey}`,
      entityType: 'task',
      entityId: source.normalized.id,
      title,
      href: getSourceHref(source.sourceEntityType, source.sourceEntityId),
      severity: blocking ? 'critical' : 'warning',
      priority: blocking ? 160 : 130,
      reason: blocking
        ? `${sourceLabel}: brak blokuje dalszy ruch i wymaga uzupelnienia w zrodle.`
        : `${sourceLabel}: aktywny brak wymaga uzupelnienia w zrodle.`,
      suggestedAction: blocking
        ? 'Otworz zrodlo albo oznacz brak jako uzupelniony, zeby zdjac blokade.'
        : 'Otworz zrodlo albo oznacz brak jako uzupelniony.',
      statusLabel: `[${sourceLabel}] ${blocking ? 'Blokada' : 'Brak'}`,
      silentDays: null,
      valuePln: readNumber(source.record, ['value', 'amount', 'budget', 'caseValue', 'case_value', 'dealValue', 'deal_value']),
      nextMoveAt: createdAt,
      signals: [
        'Braki/Blokady cross-entity',
        blocking ? 'Blokada' : 'Brak',
        `Zrodlo: ${sourceLabel}`,
      ],
      sourceEntityType: source.sourceEntityType,
      sourceEntityId: source.sourceEntityId,
      sourceItemId: source.normalized.id,
      sourceBadge: sourceLabel,
      isMissingItem: true,
      isBlockingMissingItem: blocking,
    };

    const current = deduped.get(sourceKey);
    if (!current || row.priority > current.priority) deduped.set(sourceKey, row);
  }

  return [...deduped.values()];
}
