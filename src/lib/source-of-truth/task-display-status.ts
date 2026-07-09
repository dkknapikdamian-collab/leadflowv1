import { normalizeTaskStatus } from '../domain-statuses';

export type TaskDisplayStatusKind = 'done' | 'overdue' | 'today' | 'no_due' | 'upcoming';
export type TaskDisplayStatusTone = 'green' | 'red' | 'blue' | 'neutral';

export type TaskDisplayStatusInput = {
  status: unknown;
  momentRaw: unknown;
  todayKey: string;
};

export type TaskDisplayStatusResult = {
  kind: TaskDisplayStatusKind;
  label: string;
  tone: TaskDisplayStatusTone;
  isClosed: boolean;
  isOverdue: boolean;
  hasDueDate: boolean;
};

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

function normalizeRawTaskDisplayStatus(status: unknown) {
  return String(status || '').trim().toLowerCase();
}

export function getTaskDisplayDateKey(momentRaw: unknown): string {
  const text = String(momentRaw || '').trim();
  const dateKey = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : '';
}

export function isTaskDisplayClosed(status: unknown): boolean {
  const raw = normalizeRawTaskDisplayStatus(status);
  if (CLOSED_STATUS_VALUES.has(raw)) return true;
  return CLOSED_STATUS_VALUES.has(normalizeTaskStatus(status));
}

export function isTaskDisplayOverdue(momentRaw: unknown, status: unknown, todayKey: string): boolean {
  const dateKey = getTaskDisplayDateKey(momentRaw);
  return Boolean(dateKey) && dateKey < todayKey && !isTaskDisplayClosed(status);
}

export function getTaskDisplayStatus(input: TaskDisplayStatusInput): TaskDisplayStatusResult {
  const { status, momentRaw, todayKey } = input;
  const dateKey = getTaskDisplayDateKey(momentRaw);
  const isClosed = isTaskDisplayClosed(status);
  const hasDueDate = Boolean(dateKey);
  const isOverdue = Boolean(dateKey) && dateKey < todayKey && !isClosed;

  if (isClosed) {
    return { kind: 'done', label: 'Zrobione', tone: 'green', isClosed, isOverdue: false, hasDueDate };
  }

  if (isOverdue) {
    return { kind: 'overdue', label: 'Zalegle', tone: 'red', isClosed, isOverdue, hasDueDate };
  }

  if (dateKey === todayKey) {
    return { kind: 'today', label: 'Dzis', tone: 'blue', isClosed, isOverdue: false, hasDueDate };
  }

  if (!dateKey) {
    return { kind: 'no_due', label: 'Bez terminu', tone: 'neutral', isClosed, isOverdue: false, hasDueDate };
  }

  return { kind: 'upcoming', label: 'Nadchodzace', tone: 'neutral', isClosed, isOverdue: false, hasDueDate };
}

export type TaskStableGroupIdCompat = 'overdue' | 'today' | 'upcoming' | 'no_due' | 'done';

export type TaskStableGroupCompatInput = {
  status: unknown;
  momentRaw: unknown;
  todayKey: string;
};

const TASK_STABLE_GROUP_CLOSED_COMPAT_VALUES = new Set([
  'done',
  'completed',
  'closed',
  'cancelled',
  'canceled',
]);

export function getTaskStableGroupDateKeyCompat(momentRaw: unknown): string {
  return String(momentRaw || '').slice(0, 10);
}

export function isTaskStableGroupClosedCompat(status: unknown): boolean {
  return TASK_STABLE_GROUP_CLOSED_COMPAT_VALUES.has(normalizeRawTaskDisplayStatus(status));
}

export function isTaskStableGroupOverdueCompat(momentRaw: unknown, status: unknown, todayKey: string): boolean {
  const dateKey = getTaskStableGroupDateKeyCompat(momentRaw);
  return Boolean(dateKey) && dateKey < todayKey && !isTaskStableGroupClosedCompat(status);
}

export function getTaskStableGroupIdCompat(input: TaskStableGroupCompatInput): TaskStableGroupIdCompat {
  const { status, momentRaw, todayKey } = input;
  if (isTaskStableGroupClosedCompat(status)) return 'done';
  if (isTaskStableGroupOverdueCompat(momentRaw, status, todayKey)) return 'overdue';

  const dateKey = getTaskStableGroupDateKeyCompat(momentRaw);
  if (dateKey === todayKey) return 'today';

  const raw = String(momentRaw || '');
  if (!raw) return 'no_due';

  return 'upcoming';
}

export function getTaskDisplayStatusLabel(input: TaskDisplayStatusInput): string {
  return getTaskDisplayStatus(input).label;
}

export function getTaskDisplayStatusTone(input: TaskDisplayStatusInput): TaskDisplayStatusTone {
  return getTaskDisplayStatus(input).tone;
}
