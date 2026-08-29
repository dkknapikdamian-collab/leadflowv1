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

function parseRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return {};
}

function recordViews(record: Record<string, unknown>) {
  return [
    record,
    parseRecord(record.payload),
    parseRecord(record.data),
    parseRecord(record.metadata),
    parseRecord(record.raw),
  ];
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

function readBooleanState(record: Record<string, unknown>, keys: string[]): boolean | null {
  for (const view of recordViews(record)) {
    for (const key of keys) {
      const value = view[key];
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number' && Number.isFinite(value)) return value !== 0;
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', '1', 'yes', 'tak'].includes(normalized)) return true;
        if (['false', '0', 'no', 'nie'].includes(normalized)) return false;
      }
    }
  }
  return null;
}

function readNestedString(record: Record<string, unknown>, keys: string[], fallback = '') {
  for (const view of recordViews(record)) {
    const value = readString(view, keys);
    if (value) return value;
  }
  return fallback;
}

function readNestedStrings(record: Record<string, unknown>, keys: string[]) {
  return recordViews(record)
    .map((view) => readString(view, keys))
    .filter(Boolean);
}

function hasClosedMissingStatus(record: Record<string, unknown>) {
  return readNestedStrings(record, ['status'])
    .some((status) => CLOSED_MISSING_ITEM_STATUSES.has(status.toLowerCase()));
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
  const statuses = readNestedStrings(record, ['status']).map((status) => status.toLowerCase());
  const types = readNestedStrings(record, ['type', 'kind', 'recordType', 'record_type']).map((type) => type.toLowerCase());
  const missingKinds = readNestedStrings(record, ['missingKind', 'missing_kind']).map((kind) => kind.toLowerCase());
  const payloadMarkers = readNestedStrings(record, ['businessKind', 'business_kind', 'displayKind', 'display_kind']).map((marker) => marker.toLowerCase());
  const directBlocksProgress = readBooleanState(record, ['isMissingItem', 'is_missing_item', 'isBlocker', 'is_blocker', 'blocksProgress', 'blocks_progress']);

  if (hasClosedMissingStatus(record)) return false;

  return statuses.some((candidate) => candidate === 'missing_item' || candidate.includes('block'))
    || types.some((candidate) => candidate.includes('missing') || candidate.includes('block'))
    || missingKinds.some(Boolean)
    || payloadMarkers.some((candidate) => candidate.includes('missing') || candidate.includes('block'))
    || directBlocksProgress === true
    || (readNestedStrings(record, ['priority']).some((priority) => ['high', 'urgent', 'critical'].includes(priority.toLowerCase())) && (types.some((candidate) => candidate.includes('missing') || candidate.includes('block')) || missingKinds.some(Boolean) || payloadMarkers.some((candidate) => candidate.includes('missing') || candidate.includes('block'))));
}

function isBlockingMissingItem(record: Record<string, unknown>) {
  const statuses = readNestedStrings(record, ['status']).map((status) => status.toLowerCase());
  const status = readNestedString(record, ['status']).toLowerCase();
  const directBlocksProgress = readBooleanState(record, ['isBlocker', 'is_blocker', 'blocksProgress', 'blocks_progress']);
  if (hasClosedMissingStatus(record)) return false;
  if (directBlocksProgress !== null) return directBlocksProgress;
  if (readBoolean(record, ['blocksProgress', 'blocks_progress'])) return true;
  if (status === 'blocking_missing_item') return true;
  if (statuses.some((candidate) => candidate.includes('block'))) return true;
  if (statuses.some((candidate) => candidate === 'missing_item')) return false;

  const types = readNestedStrings(record, ['type', 'kind', 'recordType', 'record_type']).map((type) => type.toLowerCase());
  const missingKinds = readNestedStrings(record, ['missingKind', 'missing_kind']).map((kind) => kind.toLowerCase());
  const payloadMarkers = readNestedStrings(record, ['businessKind', 'business_kind', 'displayKind', 'display_kind']).map((marker) => marker.toLowerCase());
  const isMissing = types.some((candidate) => candidate.includes('missing') || candidate.includes('block')) || missingKinds.some(Boolean) || payloadMarkers.some((candidate) => candidate.includes('missing') || candidate.includes('block'));
  if (!isMissing) return false;

  return readNestedStrings(record, ['priority']).some((priority) => ['high', 'urgent', 'critical'].includes(priority.toLowerCase()) || Number(priority) >= 160);
}

function resolveMissingSource(input: unknown) {
  const record = asRecord(input);
  const normalized = normalizeWorkItem(record);
  const declaredType = readNestedStrings(record, [
    'sourceEntityType', 'source_entity_type', 'entityType', 'entity_type', 'recordType', 'record_type',
  ]).map(normalizeSourceEntityType).find((value): value is MissingSourceEntityType => Boolean(value)) || null;

  const sourceEntityType = declaredType
    || (normalized.caseId ? 'case' as const : null)
    || (normalized.leadId ? 'lead' as const : null)
    || (normalized.clientId ? 'client' as const : null)
    || (readNestedString(record, ['caseId', 'case_id']) ? 'case' as const : null)
    || (readNestedString(record, ['leadId', 'lead_id']) ? 'lead' as const : null)
    || (readNestedString(record, ['clientId', 'client_id']) ? 'client' as const : null);

  if (!sourceEntityType) return null;

  const declaredId = readNestedString(record, ['sourceEntityId', 'source_entity_id', 'entityId', 'entity_id'])
    || readNestedString(record, ['recordId', 'record_id']);
  const sourceEntityId = sourceEntityType === 'case'
    ? (normalized.caseId || readNestedString(record, ['caseId', 'case_id']) || declaredId)
    : sourceEntityType === 'lead'
      ? (normalized.leadId || readNestedString(record, ['leadId', 'lead_id']) || declaredId)
      : (normalized.clientId || readNestedString(record, ['clientId', 'client_id']) || declaredId);

  const normalizedId = normalized.id || readNestedString(record, ['taskId', 'task_id', 'id']);
  if (!sourceEntityId || !normalizedId) return null;

  return { record, normalized: normalizedId === normalized.id ? normalized : { ...normalized, id: normalizedId }, sourceEntityType, sourceEntityId };
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
    const title = source.normalized.title || readNestedString(source.record, ['title', 'name'], 'Brak do uzupelnienia');
    const sourceCreatedAt = readNestedString(source.record, ['createdAt', 'created_at']) || null;
    const blockedSince = blocking
      ? readNestedString(source.record, ['blockedSince', 'blocked_since', 'blockedAt', 'blocked_at', 'statusChangedAt', 'status_changed_at']) || sourceCreatedAt
      : null;
    const nextMoveAt = source.normalized.dateAt || sourceCreatedAt;
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
      valuePln: readNumber(source.record, ['value', 'amount', 'budget', 'caseValue', 'case_value', 'dealValue', 'deal_value']) || Number(readNestedString(source.record, ['value', 'amount', 'budget', 'caseValue', 'case_value', 'dealValue', 'deal_value'])) || 0,
      nextMoveAt,
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
      blockedSince,
    };

    const current = deduped.get(sourceKey);
    if (!current || row.priority > current.priority) deduped.set(sourceKey, row);
  }

  return [...deduped.values()];
}
