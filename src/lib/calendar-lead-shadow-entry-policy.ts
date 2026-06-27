// STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP
// Central policy for derived lead shadow entries in Calendar/Today operational flows.
// Pure helper: no React, no Supabase, no Google sync, no SQL.

export const STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP = 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP';

export type LeadShadowEntryDecisionReason =
  | 'not_lead_shadow'
  | 'duplicate_lead_shadow'
  | 'covered_by_task_or_event'
  | 'kept_lead_shadow';

export interface LeadShadowEntryDecision {
  keep: boolean;
  reason: LeadShadowEntryDecisionReason;
  key: string;
}

type AnyRecord = Record<string, unknown>;

const LEAD_ALLOWED_ACTIONS = new Set(['edit', 'shift', 'complete', 'delete', 'open-related']);

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : {};
}

function readNestedRecord(record: AnyRecord, key: string): AnyRecord {
  return asRecord(record[key]);
}

function readTextFrom(record: AnyRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  }
  return null;
}

function readText(entryInput: unknown, keys: string[]): string | null {
  const entry = asRecord(entryInput);
  const raw = readNestedRecord(entry, 'raw');
  return readTextFrom(entry, keys) ?? readTextFrom(raw, keys);
}

function normalizeKeyPart(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function normalizeMoment(value: string | null): string {
  if (!value) return '';
  const text = value.trim();
  const isoLike = /^(\d{4}-\d{2}-\d{2})(?:[tT ](\d{2}:\d{2}))?/.exec(text);
  if (isoLike) return isoLike[1] + 'T' + (isoLike[2] ?? '00:00');
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 16);
  return text;
}

export function isLeadShadowOperationalEntry(entryInput: unknown): boolean {
  const entry = asRecord(entryInput);
  const raw = readNestedRecord(entry, 'raw');
  const kind = normalizeKeyPart(entry.kind ?? entry.type ?? entry.sourceKind ?? entry.sourceType ?? raw.kind ?? raw.type);
  const sourceTable = normalizeKeyPart(entry.sourceTable ?? entry.table ?? raw.sourceTable ?? raw.table);
  return kind === 'lead' || sourceTable === 'leads' || sourceTable === 'lead';
}

export function isTaskOrEventOperationalEntry(entryInput: unknown): boolean {
  const entry = asRecord(entryInput);
  const raw = readNestedRecord(entry, 'raw');
  const kind = normalizeKeyPart(entry.kind ?? entry.type ?? entry.sourceKind ?? entry.sourceType ?? raw.kind ?? raw.type);
  const sourceTable = normalizeKeyPart(entry.sourceTable ?? entry.table ?? raw.sourceTable ?? raw.table);
  return kind === 'task' || kind === 'event' || sourceTable === 'tasks' || sourceTable === 'events';
}

export function getLeadShadowLeadId(entryInput: unknown): string | null {
  const entry = asRecord(entryInput);
  const raw = readNestedRecord(entry, 'raw');
  return readTextFrom(entry, ['leadId', 'lead_id'])
    ?? readTextFrom(raw, ['leadId', 'lead_id'])
    ?? (isLeadShadowOperationalEntry(entryInput) ? readTextFrom(entry, ['sourceId', 'id', 'recordId', 'record_id']) : null)
    ?? (isLeadShadowOperationalEntry(entryInput) ? readTextFrom(raw, ['sourceId', 'id', 'recordId', 'record_id']) : null);
}

export function getOperationalEntrySourceId(entryInput: unknown): string | null {
  return readText(entryInput, ['sourceId', 'id', 'recordId', 'record_id']);
}

export function getLeadShadowCoveredSourceId(entryInput: unknown): string | null {
  return readText(entryInput, [
    'nextActionItemId',
    'next_action_item_id',
    'taskId',
    'task_id',
    'eventId',
    'event_id',
    'relatedTaskId',
    'related_task_id',
    'relatedEventId',
    'related_event_id',
  ]);
}

export function getOperationalEntryMoment(entryInput: unknown): string {
  const moment = readText(entryInput, [
    'startsAt',
    'startAt',
    'scheduledAt',
    'scheduled_at',
    'dueAt',
    'due_at',
    'nextActionAt',
    'next_action_at',
    'followUpAt',
    'follow_up_at',
    'dateTime',
    'date_time',
    'date',
  ]);
  return normalizeMoment(moment);
}

export function getOperationalEntryTitle(entryInput: unknown): string {
  return normalizeKeyPart(readText(entryInput, [
    'title',
    'nextActionTitle',
    'next_action_title',
    'name',
    'company',
  ]));
}

export function buildLeadShadowDedupeKey(entryInput: unknown): string {
  const leadId = normalizeKeyPart(getLeadShadowLeadId(entryInput));
  const moment = normalizeKeyPart(getOperationalEntryMoment(entryInput));
  const title = getOperationalEntryTitle(entryInput);
  return [leadId || 'no-lead', moment || 'no-moment', title || 'no-title'].join('|');
}

export function buildTaskEventCoverKeys(entryInput: unknown): string[] {
  if (!isTaskOrEventOperationalEntry(entryInput)) return [];
  const leadId = normalizeKeyPart(getLeadShadowLeadId(entryInput));
  const sourceId = normalizeKeyPart(getOperationalEntrySourceId(entryInput));
  const moment = normalizeKeyPart(getOperationalEntryMoment(entryInput));
  const title = getOperationalEntryTitle(entryInput);
  const keys = new Set<string>();
  if (leadId && moment) keys.add([leadId, moment, title || 'no-title'].join('|'));
  if (sourceId) keys.add(`source:${sourceId}`);
  return [...keys];
}

export function sanitizeLeadShadowEntryActions<T>(entryInput: T): T {
  if (!isLeadShadowOperationalEntry(entryInput)) return entryInput;
  const entry = asRecord(entryInput);
  const actions = entry.actions;
  if (!Array.isArray(actions)) return entryInput;
  const sanitized = actions.filter((action) => LEAD_ALLOWED_ACTIONS.has(String(action)));
  return { ...(entry as AnyRecord), actions: sanitized } as T;
}

export function decideLeadShadowEntry(entryInput: unknown, seenLeadKeys: ReadonlySet<string>, coveredKeys: ReadonlySet<string>): LeadShadowEntryDecision {
  if (!isLeadShadowOperationalEntry(entryInput)) {
    return { keep: true, reason: 'not_lead_shadow', key: '' };
  }
  const leadShadowKey = buildLeadShadowDedupeKey(entryInput);
  const coveredSourceId = normalizeKeyPart(getLeadShadowCoveredSourceId(entryInput));
  if ((coveredSourceId && coveredKeys.has(`source:${coveredSourceId}`)) || coveredKeys.has(leadShadowKey)) {
    return { keep: false, reason: 'covered_by_task_or_event', key: leadShadowKey };
  }
  if (seenLeadKeys.has(leadShadowKey)) {
    return { keep: false, reason: 'duplicate_lead_shadow', key: leadShadowKey };
  }
  return { keep: true, reason: 'kept_lead_shadow', key: leadShadowKey };
}

export function applyLeadShadowEntryPolicy<T>(entries: readonly T[]): T[] {
  const coveredKeys = new Set<string>();
  for (const entry of entries) {
    for (const key of buildTaskEventCoverKeys(entry)) coveredKeys.add(key);
  }

  const seenLeadKeys = new Set<string>();
  const result: T[] = [];
  for (const entry of entries) {
    const decision = decideLeadShadowEntry(entry, seenLeadKeys, coveredKeys);
    if (!decision.keep) continue;
    if (isLeadShadowOperationalEntry(entry)) seenLeadKeys.add(decision.key);
    result.push(sanitizeLeadShadowEntryActions(entry));
  }
  return result;
}

export function getLeadShadowAllowedActions(): string[] {
  return [...LEAD_ALLOWED_ACTIONS];
}
