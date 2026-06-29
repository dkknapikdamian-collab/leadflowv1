import { resolveEntityIcon } from '../../components/ui-system/icon-registry';

import {
  normalizeEventStatus,
  normalizeTaskStatus,
  type EventStatus,
  type TaskStatus,
} from '../domain-statuses';

type ScheduleIcon = ReturnType<typeof resolveEntityIcon>;

const TASK_SCHEDULE_ICON = resolveEntityIcon('task');
const EVENT_SCHEDULE_ICON = resolveEntityIcon('event');
const LEAD_SCHEDULE_ICON = resolveEntityIcon('lead');

export type ScheduleOption<T extends string | number> = {
  value: T;
  label: string;
};

export type ScheduleIconOption<T extends string> = ScheduleOption<T> & {
  icon: ScheduleIcon;
};

export const TASK_TYPE_OPTIONS = [
  { value: 'follow_up', label: 'Follow-up', icon: TASK_SCHEDULE_ICON },
  { value: 'phone', label: 'Telefon', icon: TASK_SCHEDULE_ICON },
  { value: 'reply', label: 'Odpisać', icon: TASK_SCHEDULE_ICON },
  { value: 'send_offer', label: 'Wyślij ofertę', icon: TASK_SCHEDULE_ICON },
  { value: 'meeting', label: 'Spotkanie', icon: TASK_SCHEDULE_ICON },
  { value: 'other', label: 'Inne', icon: TASK_SCHEDULE_ICON },
] as const satisfies readonly ScheduleIconOption<string>[];

export const EVENT_TYPE_OPTIONS = [
  { value: 'meeting', label: 'Spotkanie', icon: EVENT_SCHEDULE_ICON },
  { value: 'phone_call', label: 'Rozmowa', icon: EVENT_SCHEDULE_ICON },
  { value: 'follow_up', label: 'Follow-up', icon: EVENT_SCHEDULE_ICON },
  { value: 'deadline', label: 'Deadline', icon: EVENT_SCHEDULE_ICON },
  { value: 'custom', label: 'Własne wydarzenie', icon: EVENT_SCHEDULE_ICON },
] as const satisfies readonly ScheduleIconOption<string>[];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
] as const satisfies readonly ScheduleOption<string>[];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
] as const satisfies readonly ScheduleOption<string>[];

export const REMINDER_MODE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'once', label: 'Jednorazowe' },
  { value: 'recurring', label: 'Przypominaj cyklicznie' },
] as const satisfies readonly ScheduleOption<string>[];

export const REMINDER_OFFSET_OPTIONS = [
  { value: 540, label: 'Tego samego dnia o 09:00' },
  { value: 1440, label: 'Dzień wcześniej o 09:00' },
  { value: 2880, label: '2 dni wcześniej o 09:00' },
  { value: 10080, label: '1 tydzień wcześniej o 09:00' },
] as const satisfies readonly ScheduleOption<number>[];

export const GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS = [
  { value: 'default', label: 'Domyślne z Google Calendar' },
  { value: 'popup', label: 'Powiadomienie w Google Calendar' },
  { value: 'email', label: 'E-mail z Google Calendar' },
  { value: 'popup_email', label: 'Powiadomienie + e-mail' },
] as const satisfies readonly ScheduleOption<string>[];

export type TaskTypeValue = (typeof TASK_TYPE_OPTIONS)[number]['value'];
export type EventTypeValue = (typeof EVENT_TYPE_OPTIONS)[number]['value'];
export type PriorityValue = (typeof PRIORITY_OPTIONS)[number]['value'];
export type RecurrenceValue = (typeof RECURRENCE_OPTIONS)[number]['value'];
export type ReminderModeValue = (typeof REMINDER_MODE_OPTIONS)[number]['value'];
export type ReminderOffsetValue = (typeof REMINDER_OFFSET_OPTIONS)[number]['value'];
export type GoogleCalendarReminderMethodValue = (typeof GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS)[number]['value'];

export type TaskStatusMeta = {
  value: TaskStatus | 'open' | 'completed' | 'cancelled' | 'archived';
  label: string;
};

export type EventStatusMeta = {
  value: EventStatus | 'planned' | 'open' | 'completed' | 'cancelled';
  label: string;
};

export const TASK_STATUS_META_BY_VALUE: Record<TaskStatus | 'open' | 'completed' | 'cancelled' | 'archived', TaskStatusMeta> = {
  todo: { value: 'todo', label: 'Do zrobienia' },
  open: { value: 'open', label: 'Otwarte' },
  scheduled: { value: 'scheduled', label: 'Zaplanowane' },
  in_progress: { value: 'in_progress', label: 'W trakcie' },
  done: { value: 'done', label: 'Zrobione' },
  completed: { value: 'completed', label: 'Zrobione' },
  canceled: { value: 'canceled', label: 'Anulowane' },
  cancelled: { value: 'cancelled', label: 'Anulowane' },
  deleted: { value: 'deleted', label: 'Usuniete' },
  archived: { value: 'archived', label: 'Archiwum' },
};

export const EVENT_STATUS_META_BY_VALUE: Record<EventStatus | 'planned' | 'open' | 'completed' | 'cancelled', EventStatusMeta> = {
  planned: { value: 'planned', label: 'Zaplanowane' },
  open: { value: 'open', label: 'Zaplanowane' },
  scheduled: { value: 'scheduled', label: 'Zaplanowane' },
  in_progress: { value: 'in_progress', label: 'W trakcie' },
  done: { value: 'done', label: 'Odbyte' },
  completed: { value: 'completed', label: 'Odbyte' },
  canceled: { value: 'canceled', label: 'Anulowane' },
  cancelled: { value: 'cancelled', label: 'Anulowane' },
  deleted: { value: 'deleted', label: 'Usuniete' },
};

export const TASK_STATUS_LABELS = Object.fromEntries(
  Object.entries(TASK_STATUS_META_BY_VALUE).map(([value, meta]) => [value, meta.label]),
) as Record<keyof typeof TASK_STATUS_META_BY_VALUE, string>;

export const CALENDAR_EVENT_STATUS_LABELS = Object.fromEntries(
  Object.entries(EVENT_STATUS_META_BY_VALUE).map(([value, meta]) => [value, meta.label]),
) as Record<keyof typeof EVENT_STATUS_META_BY_VALUE, string>;

export const CLOSED_WORK_ITEM_STATUSES = ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted'] as const;

function findOption<T extends ScheduleOption<string | number>>(
  options: readonly T[],
  value: unknown,
  fallback: T,
): T {
  const normalized = typeof fallback.value === 'number' ? Number(value) : String(value || '').trim().toLowerCase();
  return options.find((entry) => entry.value === normalized) ?? fallback;
}

export function getTaskTypeMeta(type: unknown) {
  return findOption(TASK_TYPE_OPTIONS, type, TASK_TYPE_OPTIONS[TASK_TYPE_OPTIONS.length - 1]);
}

export function getEventTypeMeta(type: unknown) {
  return findOption(EVENT_TYPE_OPTIONS, type, EVENT_TYPE_OPTIONS[EVENT_TYPE_OPTIONS.length - 1]);
}

export function getPriorityMeta(priority: unknown) {
  return findOption(PRIORITY_OPTIONS, priority, PRIORITY_OPTIONS[1]);
}

export function getRecurrenceMeta(value: unknown) {
  return findOption(RECURRENCE_OPTIONS, value, RECURRENCE_OPTIONS[0]);
}

export function getReminderModeMeta(value: unknown) {
  return findOption(REMINDER_MODE_OPTIONS, value, REMINDER_MODE_OPTIONS[0]);
}

export function getReminderOffsetMeta(value: unknown) {
  return findOption(REMINDER_OFFSET_OPTIONS, value, REMINDER_OFFSET_OPTIONS[0]);
}

export function getGoogleCalendarReminderMethodMeta(value: unknown) {
  return findOption(
    GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS,
    value,
    GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS[0],
  );
}

export function getTaskStatusLabel(status: unknown) {
  const raw = String(status || '').trim().toLowerCase();
  if (raw in TASK_STATUS_META_BY_VALUE) return TASK_STATUS_META_BY_VALUE[raw as keyof typeof TASK_STATUS_META_BY_VALUE].label;
  return TASK_STATUS_META_BY_VALUE[normalizeTaskStatus(status)].label;
}

export function getCalendarEventStatusLabel(status: unknown) {
  const raw = String(status || '').trim().toLowerCase();
  if (raw in EVENT_STATUS_META_BY_VALUE) return EVENT_STATUS_META_BY_VALUE[raw as keyof typeof EVENT_STATUS_META_BY_VALUE].label;
  return EVENT_STATUS_META_BY_VALUE[normalizeEventStatus(status)].label;
}

export function isDoneStatus(status: unknown) {
  return (CLOSED_WORK_ITEM_STATUSES as readonly string[]).includes(String(status || '').trim().toLowerCase());
}

export function getScheduleEntryIcon(kind: 'event' | 'task' | 'lead', type?: string): ScheduleIcon {
  if (kind === 'lead') return LEAD_SCHEDULE_ICON;
  if (kind === 'event') return getEventTypeMeta(type).icon ?? EVENT_SCHEDULE_ICON;
  return getTaskTypeMeta(type).icon ?? TASK_SCHEDULE_ICON;
}
