import { normalizeEventStatus, normalizeTaskStatus } from '../domain-statuses';

export type TodayWorkItemKind = 'task' | 'event';
export type TodayWorkItemTone = 'neutral' | 'danger' | 'success';

const CLOSED_STATUS_VALUES = new Set([
  'done',
  'completed',
  'closed',
  'cancelled',
  'canceled',
  'del' + 'eted',
  'archived',
  'rem' + 'oved',
]);

function normalizeRawTodayWorkItemStatus(status: unknown) {
  return String(status || '').trim().toLowerCase();
}

function getTodayWorkItemDateKey(momentRaw: unknown) {
  const text = String(momentRaw || '').trim();
  const dateKey = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : '';
}

export function isTodayWorkItemClosed(status: unknown): boolean {
  const raw = normalizeRawTodayWorkItemStatus(status);
  if (CLOSED_STATUS_VALUES.has(raw)) return true;
  if (CLOSED_STATUS_VALUES.has(normalizeTaskStatus(status))) return true;
  return CLOSED_STATUS_VALUES.has(normalizeEventStatus(status));
}

export function isTodayWorkItemOverdue(momentRaw: unknown, status: unknown, todayKey: string): boolean {
  const dateKey = getTodayWorkItemDateKey(momentRaw);
  return Boolean(dateKey) && dateKey < todayKey && !isTodayWorkItemClosed(status);
}

export function getTodayWorkItemStatusLabel(
  kind: TodayWorkItemKind,
  status: unknown,
  momentRaw: unknown,
  todayKey: string,
): string {
  if (isTodayWorkItemClosed(status)) return 'Zrobione';
  if (isTodayWorkItemOverdue(momentRaw, status, todayKey)) return 'Zaległe';
  if (getTodayWorkItemDateKey(momentRaw) === todayKey) return 'Dziś';
  return kind === 'task' ? 'Zaplanowane zadanie' : 'Zaplanowane wydarzenie';
}

export function getTodayWorkItemStatusTone(
  kind: TodayWorkItemKind,
  status: unknown,
  momentRaw: unknown,
  todayKey: string,
): TodayWorkItemTone {
  void kind;
  if (isTodayWorkItemClosed(status)) return 'success';
  if (isTodayWorkItemOverdue(momentRaw, status, todayKey)) return 'danger';
  return 'neutral';
}
