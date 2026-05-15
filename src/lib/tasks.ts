import { format, isToday, isTomorrow, isValid, parseISO, startOfToday } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { RecurrenceEndType, RecurrenceRule } from './scheduling';

export const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wyślij ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
] as const;

export type TaskStatus = 'todo' | 'done' | 'overdue' | 'postponed';

export type EditableTaskRecord = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: TaskStatus | string;
  priority?: string;
  reminderAt?: string | null;
  recurrenceRule?: RecurrenceRule;
  recurrenceEndType?: RecurrenceEndType;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  recurrenceDoneCount?: number | null;
  snoozeUntil?: string | null;
  leadId?: string;
  leadName?: string;
  clientId?: string;
  clientName?: string;
  caseId?: string;
  caseTitle?: string;
};

export function parseTaskDate(value?: string | null) {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function getSafeTaskDate(task: Pick<EditableTaskRecord, 'date'>) {
  return parseTaskDate(task.date) ?? startOfToday();
}

export function getDateLabel(date: Date) {
  if (isToday(date)) return 'Dzisiaj';
  if (isTomorrow(date)) return 'Jutro';
  return format(date, 'EEEE, d MMMM', { locale: pl });
}

export function getTaskTypeLabel(type?: string) {
  return TASK_TYPES.find((entry) => entry.value === type)?.label || 'Inne';
}

export function toDateTimeLocalValue(value?: string | null) {
  const parsed = parseTaskDate(value);
  return parsed ? format(parsed, "yyyy-MM-dd'T'HH:mm") : '';
}
