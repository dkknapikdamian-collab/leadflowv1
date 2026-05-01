import { isValid, parseISO } from 'date-fns';
import { fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, isSupabaseConfigured } from './supabase-fallback';
import { normalizeEventContract, normalizeTaskContract } from './data-contract';

export type CalendarTaskItem = {
  id: string;
  title: string;
  date: string;
  dueAt?: string;
  time?: string;
  scheduledAt?: string;
  status: string;
  type?: string;
  priority?: string;
  reminderAt?: string | null;
  recurrenceRule?: string;
  recurrenceEndType?: string;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  recurrence?: Record<string, unknown>;
  reminder?: Record<string, unknown>;
  leadId?: string;
  leadName?: string;
  caseId?: string;
  clientId?: string;
};

export type CalendarEventItem = {
  id: string;
  title: string;
  type: string;
  startAt: string;
  endAt?: string;
  status: string;
  leadId?: string;
  leadName?: string;
  caseId?: string;
  clientId?: string;
  reminderAt?: string | null;
  recurrenceRule?: string;
  recurrenceEndType?: string;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  recurrence?: Record<string, unknown>;
  reminder?: Record<string, unknown>;
};

export type CalendarBundle = {
  tasks: CalendarTaskItem[];
  events: CalendarEventItem[];
  leads: Record<string, unknown>[];
  cases: Record<string, unknown>[];
};

function isIsoLike(value?: string | null) {
  if (!value) return false;
  return isValid(parseISO(value));
}

function asNullableText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizeReminderMinutes(scheduledAt: string, reminderAt?: string | null) {
  if (!reminderAt) return 30;
  const minutes = Math.round((new Date(scheduledAt).getTime() - new Date(reminderAt).getTime()) / 60000);
  return Math.max(0, minutes);
}

function normalizeRecurrenceObject(row: Record<string, unknown>, recurrenceRule?: string, recurrenceEndType?: string, recurrenceCount?: number | null) {
  return row.recurrence && typeof row.recurrence === 'object'
    ? (row.recurrence as Record<string, unknown>)
    : { mode: recurrenceRule || 'none', interval: 1, until: null, endType: recurrenceEndType || 'never', count: recurrenceCount ?? null };
}

function normalizeReminderObject(row: Record<string, unknown>, scheduledAt: string, reminderAt?: string | null) {
  if (row.reminder && typeof row.reminder === 'object') return row.reminder as Record<string, unknown>;
  return reminderAt
    ? { mode: 'once', minutesBefore: normalizeReminderMinutes(scheduledAt, reminderAt), recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
    : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null };
}

function getRecurrenceMeta(row: Record<string, unknown>) {
  const recurrenceEndType = asNullableText(row.recurrenceEndType) || asNullableText(row.recurrence_end_type);
  const recurrenceEndAt = asNullableText(row.recurrenceEndAt) || asNullableText(row.recurrence_end_at) || null;
  const recurrenceCount = typeof row.recurrenceCount === 'number'
    ? row.recurrenceCount
    : typeof row.recurrence_count === 'number'
      ? row.recurrence_count
      : null;
  return { recurrenceEndType, recurrenceEndAt, recurrenceCount };
}

export function normalizeCalendarTask(row: Record<string, unknown>): CalendarTaskItem | null {
  const task = normalizeTaskContract(row);
  const scheduledAt = task.scheduledAt;
  if (!scheduledAt || !isIsoLike(scheduledAt)) return null;

  const { recurrenceEndType, recurrenceEndAt, recurrenceCount } = getRecurrenceMeta(row);

  return {
    id: task.id,
    title: task.title || 'Zadanie bez tytułu',
    date: task.date || scheduledAt.slice(0, 10),
    dueAt: scheduledAt.slice(0, 16),
    time: scheduledAt.slice(11, 16),
    scheduledAt,
    status: task.status || 'todo',
    type: task.type || 'task',
    priority: task.priority,
    reminderAt: task.reminderAt,
    recurrenceRule: task.recurrenceRule || undefined,
    recurrence: normalizeRecurrenceObject(row, task.recurrenceRule, recurrenceEndType, recurrenceCount),
    reminder: normalizeReminderObject(row, scheduledAt, task.reminderAt),
    recurrenceEndType,
    recurrenceEndAt,
    recurrenceCount,
    leadId: task.leadId,
    leadName: task.leadName,
    caseId: task.caseId,
    clientId: task.clientId,
  };
}

export function normalizeCalendarEvent(row: Record<string, unknown>): CalendarEventItem | null {
  const event = normalizeEventContract(row);
  const startAt = event.startAt;
  if (!startAt || !isIsoLike(startAt)) return null;

  const { recurrenceEndType, recurrenceEndAt, recurrenceCount } = getRecurrenceMeta(row);

  return {
    id: event.id,
    title: event.title || 'Wydarzenie bez tytułu',
    type: event.type || 'event',
    startAt,
    endAt: event.endAt || undefined,
    status: event.status || 'scheduled',
    leadId: event.leadId,
    leadName: event.leadName,
    caseId: event.caseId,
    clientId: event.clientId,
    reminderAt: event.reminderAt,
    recurrenceRule: event.recurrenceRule || undefined,
    recurrence: normalizeRecurrenceObject(row, event.recurrenceRule, recurrenceEndType, recurrenceCount),
    reminder: normalizeReminderObject(row, startAt, event.reminderAt),
    recurrenceEndType,
    recurrenceEndAt,
    recurrenceCount,
  };
}

export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  if (!isSupabaseConfigured()) return { tasks: [], events: [], leads: [], cases: [] };

  const [taskItems, eventItems, caseItems, leadItems] = await Promise.all([
    fetchTasksFromSupabase(),
    fetchEventsFromSupabase(),
    fetchCasesFromSupabase().catch(() => []),
    fetchLeadsFromSupabase().catch(() => []),
  ]);

  return {
    tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),
    events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),
    leads: leadItems as Record<string, unknown>[],
    cases: caseItems as Record<string, unknown>[],
  };
}
