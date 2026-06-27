import {
  normalizeEventStatus,
  normalizeTaskStatus,
  type EventStatus,
  type TaskStatus,
} from '../domain-statuses';

const CLOSED_WORK_ITEM_STATUSES = ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted'] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus | 'open' | 'completed' | 'cancelled' | 'archived', string> = {
  todo: 'Do zrobienia',
  open: 'Otwarte',
  scheduled: 'Zaplanowane',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  completed: 'Zrobione',
  canceled: 'Anulowane',
  cancelled: 'Anulowane',
  deleted: 'Usuniete',
  archived: 'Archiwum',
};

export const CALENDAR_EVENT_STATUS_LABELS: Record<EventStatus | 'planned' | 'open' | 'completed' | 'cancelled', string> = {
  planned: 'Zaplanowane',
  open: 'Zaplanowane',
  scheduled: 'Zaplanowane',
  in_progress: 'W trakcie',
  done: 'Odbyte',
  completed: 'Odbyte',
  canceled: 'Anulowane',
  cancelled: 'Anulowane',
  deleted: 'Usuniete',
};

export function isDoneStatus(value: unknown) {
  return (CLOSED_WORK_ITEM_STATUSES as readonly string[]).includes(String(value || '').trim().toLowerCase());
}

export function getTaskStatusLabel(value: unknown) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw in TASK_STATUS_LABELS) return TASK_STATUS_LABELS[raw as keyof typeof TASK_STATUS_LABELS];
  return TASK_STATUS_LABELS[normalizeTaskStatus(value)];
}

export function getCalendarEventStatusLabel(value: unknown) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw in CALENDAR_EVENT_STATUS_LABELS) return CALENDAR_EVENT_STATUS_LABELS[raw as keyof typeof CALENDAR_EVENT_STATUS_LABELS];
  return CALENDAR_EVENT_STATUS_LABELS[normalizeEventStatus(value)];
}
