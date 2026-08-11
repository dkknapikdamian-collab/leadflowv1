import { isTaskOrEventStatusClosed } from '../domain-statuses';

export type TodayWorkItemKind = 'task' | 'event';
export type TodayWorkItemTone = 'neutral' | 'danger' | 'success';

function getTodayWorkItemDateKey(momentRaw: unknown) {
  const text = String(momentRaw || '').trim();
  const dateKey = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : '';
}

export function isTodayWorkItemClosed(status: unknown): boolean {
  return isTaskOrEventStatusClosed(status);
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
