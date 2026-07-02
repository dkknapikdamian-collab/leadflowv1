// STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT
// Shared lightweight runtime contract for Calendar/Today operational entries.
// This file is intentionally pure: no React, no Supabase, no Google sync, no SQL.

import { calendarDateTimeBoundaryReadonlyRuntimeAdapterContract } from './source-of-truth/calendar-date-time-boundary-readonly-runtime'

export const STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT = 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT';
const calendarDateTimeBoundaryReadonlyRuntimeImportBoundary =
  calendarDateTimeBoundaryReadonlyRuntimeAdapterContract

void calendarDateTimeBoundaryReadonlyRuntimeImportBoundary

export type OperationalEntryKind = 'event' | 'task' | 'lead';
export type OperationalEntryAction = 'edit' | 'shift' | 'complete' | 'restore' | 'delete' | 'open-related';
export type OperationalEntryStatus = 'open' | 'done' | 'cancelled' | 'deleted' | 'unknown';

export interface OperationalEntryLinkTarget {
  leadId: string | null;
  caseId: string | null;
  clientId: string | null;
}

export interface CalendarTodayOperationalEntryContract {
  contract: typeof STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT;
  kind: OperationalEntryKind;
  sourceId: string;
  sourceTable: 'events' | 'tasks' | 'leads';
  title: string;
  startsAt: string | null;
  scheduledAt: string | null;
  dueAt: string | null;
  date: string | null;
  time: string | null;
  status: OperationalEntryStatus;
  dayKey: string | null;
  linkTarget: OperationalEntryLinkTarget;
  actions: OperationalEntryAction[];
}

type OperationalRawRecord = Record<string, unknown> & {
  id?: string | number | null;
  title?: string | null;
  name?: string | null;
  company?: string | null;
  status?: string | null;
  startAt?: string | Date | null;
  startsAt?: string | Date | null;
  scheduledAt?: string | Date | null;
  scheduled_at?: string | Date | null;
  dueAt?: string | Date | null;
  due_at?: string | Date | null;
  dateTime?: string | Date | null;
  date_time?: string | Date | null;
  date?: string | Date | null;
  time?: string | null;
  nextActionAt?: string | Date | null;
  next_action_at?: string | Date | null;
  followUpAt?: string | Date | null;
  follow_up_at?: string | Date | null;
  leadId?: string | null;
  lead_id?: string | null;
  caseId?: string | null;
  case_id?: string | null;
  clientId?: string | null;
  client_id?: string | null;
};

function asRecord(value: unknown): OperationalRawRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as OperationalRawRecord : {};
}

function readText(record: OperationalRawRecord, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  }
  return fallback;
}

function readNullableText(record: OperationalRawRecord, keys: string[]): string | null {
  const value = readText(record, keys, '');
  return value || null;
}

function normalizeDateTimeText(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value === 'string' && value.trim()) return value.trim();
  return null;
}

export function normalizeOperationalStatus(status: unknown): OperationalEntryStatus {
  const value = String(status ?? '').trim().toLowerCase();
  if (!value) return 'unknown';
  if (['done', 'completed', 'complete', 'closed', 'zrobione', 'finished'].includes(value)) return 'done';
  if (['cancelled', 'canceled', 'anulowane'].includes(value)) return 'cancelled';
  if (['deleted', 'removed', 'trash', 'archived_deleted'].includes(value)) return 'deleted';
  if (['open', 'active', 'pending', 'todo', 'planned', 'in_progress'].includes(value)) return 'open';
  return 'unknown';
}

export function isCompletedOperationalStatus(status: unknown): boolean {
  return normalizeOperationalStatus(status) === 'done';
}

export function getOperationalRecordMomentRaw(recordInput: unknown, kind: OperationalEntryKind): string | null {
  const record = asRecord(recordInput);
  if (kind === 'event') {
    return normalizeDateTimeText(record.startAt)
      ?? normalizeDateTimeText(record.startsAt)
      ?? normalizeDateTimeText(record.dateTime)
      ?? normalizeDateTimeText(record.date_time)
      ?? normalizeDateTimeText(record.date);
  }
  if (kind === 'task') {
    return normalizeDateTimeText(record.scheduledAt)
      ?? normalizeDateTimeText(record.scheduled_at)
      ?? normalizeDateTimeText(record.dueAt)
      ?? normalizeDateTimeText(record.due_at)
      ?? normalizeDateTimeText(record.dateTime)
      ?? normalizeDateTimeText(record.date_time)
      ?? normalizeDateTimeText(record.date);
  }
  return normalizeDateTimeText(record.nextActionAt)
    ?? normalizeDateTimeText(record.next_action_at)
    ?? normalizeDateTimeText(record.followUpAt)
    ?? normalizeDateTimeText(record.follow_up_at)
    ?? normalizeDateTimeText(record.dateTime)
    ?? normalizeDateTimeText(record.date_time)
    ?? normalizeDateTimeText(record.date);
}

export function toOperationalDayKey(value: unknown): string | null {
  if (typeof value === 'string') {
    const text = value.trim();
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
    if (match) return match[1];
  }
  const normalized = normalizeDateTimeText(value);
  if (!normalized) return null;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function getSupportedOperationalEntryActions(kind: OperationalEntryKind): OperationalEntryAction[] {
  if (kind === 'lead') {
    return ['edit', 'shift', 'complete', 'delete', 'open-related'];
  }
  return ['edit', 'shift', 'complete', 'restore', 'delete', 'open-related'];
}

export function buildOperationalEntryContract(kind: OperationalEntryKind, recordInput: unknown): CalendarTodayOperationalEntryContract {
  const record = asRecord(recordInput);
  const sourceId = readText(record, ['id'], 'UNKNOWN_SOURCE_ID');
  const startsAt = getOperationalRecordMomentRaw(record, kind);
  const titleFallback = kind === 'event' ? 'Wydarzenie' : kind === 'task' ? 'Zadanie' : 'Lead';
  return {
    contract: STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT,
    kind,
    sourceId,
    sourceTable: kind === 'event' ? 'events' : kind === 'task' ? 'tasks' : 'leads',
    title: readText(record, ['title', 'nextActionTitle', 'next_action_title', 'name', 'company'], titleFallback),
    startsAt,
    scheduledAt: readNullableText(record, ['scheduledAt', 'scheduled_at']),
    dueAt: readNullableText(record, ['dueAt', 'due_at']),
    date: readNullableText(record, ['date']),
    time: readNullableText(record, ['time']),
    status: normalizeOperationalStatus(record.status),
    dayKey: toOperationalDayKey(startsAt),
    linkTarget: {
      leadId: readNullableText(record, ['leadId', 'lead_id']),
      caseId: readNullableText(record, ['caseId', 'case_id']),
      clientId: readNullableText(record, ['clientId', 'client_id']),
    },
    actions: getSupportedOperationalEntryActions(kind),
  };
}

export function buildCalendarTodayParityFingerprint(entry: CalendarTodayOperationalEntryContract): string {
  return [
    entry.kind,
    entry.sourceId,
    entry.dayKey ?? 'NO_DAY',
    entry.startsAt ?? 'NO_START',
    entry.status,
    entry.linkTarget.leadId ?? 'NO_LEAD',
    entry.linkTarget.caseId ?? 'NO_CASE',
    entry.linkTarget.clientId ?? 'NO_CLIENT',
  ].join('|');
}
