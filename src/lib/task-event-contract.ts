import { normalizeEventV1, normalizeTaskV1 } from './work-items/normalize';

// STAGE14I_CALENDAR_SNAKE_CASE_TASK_DATES: keep camelCase and snake_case task/event date keys in one contract.
export type TaskEventDateSource = {
  scheduledAt?: string | Date | null;
  scheduled_at?: string | Date | null;
  scheduledDate?: string | Date | null;
  scheduled_date?: string | Date | null;
  scheduledTime?: string | null;
  scheduled_time?: string | null;
  dueAt?: string | Date | null;
  due_at?: string | Date | null;
  dueDate?: string | Date | null;
  due_date?: string | Date | null;
  dueTime?: string | null;
  due_time?: string | null;
  dateTime?: string | Date | null;
  date_time?: string | Date | null;
  startsAt?: string | Date | null;
  starts_at?: string | Date | null;
  startAt?: string | Date | null;
  start_at?: string | Date | null;
  startDate?: string | Date | null;
  start_date?: string | Date | null;
  startTime?: string | null;
  start_time?: string | null;
  endAt?: string | Date | null;
  end_at?: string | Date | null;
  endsAt?: string | Date | null;
  ends_at?: string | Date | null;
  endDate?: string | Date | null;
  end_date?: string | Date | null;
  endTime?: string | null;
  end_time?: string | null;
  date?: string | Date | null;
  time?: string | null;
  reminderAt?: string | Date | null;
  reminder_at?: string | Date | null;
};
export type TaskLike = TaskEventDateSource & {
  id?: string | number;
  title?: string;
  status?: string | null;
  type?: string | null;
  priority?: string | null;
  leadId?: string | null;
  caseId?: string | null;
  clientId?: string | null;
};

export type EventLike = TaskEventDateSource & {
  id?: string | number;
  title?: string;
  status?: string | null;
  type?: string | null;
  endAt?: string | Date | null;
  endsAt?: string | Date | null;
  leadId?: string | null;
  caseId?: string | null;
  clientId?: string | null;
};

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateOnly(date: Date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-');
}

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime());
}

export function toDateTimeLocalValueSafe(date: Date) {
  if (!isValidDate(date)) return '';
  return [
    formatDateOnly(date),
    'T',
    padDatePart(date.getHours()),
    ':',
    padDatePart(date.getMinutes()),
  ].join('');
}

export function normalizeScheduleDateTimeValue(value: unknown): string | null {
  if (value instanceof Date) {
    return isValidDate(value) ? value.toISOString() : null;
  }

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed + 'T09:00';
  }

  const parsed = new Date(trimmed);
  if (!isValidDate(parsed)) return null;

  return trimmed;
}

export function getTaskStartAt(task: TaskLike | null | undefined): string | null {
  const normalized = normalizeTaskV1(task);
  return normalizeScheduleDateTimeValue(normalized.scheduledAt ?? normalized.reminderAt);
}

export function getTaskMainDate(task: TaskLike | null | undefined): string | null {
  return getTaskStartAt(task);
}

export function getTaskDate(task: TaskLike | null | undefined, fallbackDate = new Date()): string {
  const startAt = getTaskStartAt(task);
  const parsed = startAt ? new Date(startAt) : null;
  if (parsed && isValidDate(parsed)) return formatDateOnly(parsed);
  return formatDateOnly(fallbackDate);
}

export function syncTaskDerivedFields<T extends TaskLike>(task: T): T & {
  scheduledAt: string;
  dueAt: string;
  date: string;
} {
  const startAt = getTaskStartAt(task) ?? toDateTimeLocalValueSafe(new Date());

  return {
    ...task,
    scheduledAt: startAt,
    dueAt: startAt,
    date: getTaskDate({ ...task, scheduledAt: startAt }),
  };
}

export function getEventStartAt(event: EventLike | null | undefined): string | null {
  const normalized = normalizeEventV1(event);
  return normalizeScheduleDateTimeValue(normalized.startAt ?? normalized.reminderAt);
}

export function getEventEndAt(event: EventLike | null | undefined): string | null {
  const normalized = normalizeEventV1(event);
  return normalizeScheduleDateTimeValue(normalized.endAt);
}

export function getEventMainDate(event: EventLike | null | undefined): string | null {
  return getEventStartAt(event);
}

export function normalizeTaskRecord<T extends TaskLike>(task: T): T & {
  scheduledAt: string;
  dueAt: string;
  date: string;
} {
  return syncTaskDerivedFields(task);
}

export function normalizeEventRecord<T extends EventLike>(event: T): T & {
  startAt: string;
  scheduledAt: string;
  endAt: string | null;
} {
  const startAt = getEventStartAt(event) ?? toDateTimeLocalValueSafe(new Date());
  const endAt = getEventEndAt(event);

  return {
    ...event,
    startAt,
    scheduledAt: startAt,
    endAt,
  };
}
