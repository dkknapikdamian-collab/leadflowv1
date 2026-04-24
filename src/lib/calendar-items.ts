import { isValid, parseISO } from 'date-fns';
import { fetchCasesFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, hasStoredWorkspaceContext, isSupabaseConfigured } from './supabase-fallback';

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
  leads: never[];
  cases: Record<string, unknown>[];
};

function isIsoLike(value?: string | null) {
  if (!value) return false;
  return isValid(parseISO(value));
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const normalized = asString(value);
    if (normalized) return normalized;
  }
  return '';
}

function asNullableText(...values: unknown[]) {
  const normalized = firstText(...values);
  return normalized || undefined;
}

function asNullableIso(...values: unknown[]) {
  const normalized = firstText(...values);
  if (!normalized) return undefined;
  return isIsoLike(normalized) ? normalized : undefined;
}

function normalizeTaskScheduledAt(row: Record<string, unknown>) {
  const dueAt = firstText(row.dueAt, row.due_at);
  if (dueAt && isIsoLike(dueAt)) return dueAt;

  const scheduledAt = firstText(row.scheduledAt, row.scheduled_at);
  if (scheduledAt && isIsoLike(scheduledAt)) return scheduledAt;

  const dateField = firstText(row.date, row.due_date, row.scheduled_date);
  const timeField = firstText(row.time, row.scheduled_time, row.due_time) || '09:00';
  if (!dateField) return '';

  const composed = `${dateField}T${timeField}`;
  return isIsoLike(composed) ? composed : '';
}

function normalizeEventStartAt(row: Record<string, unknown>) {
  const startAt = firstText(row.startAt, row.start_at, row.scheduledAt, row.scheduled_at);
  if (!startAt || !isIsoLike(startAt)) return '';
  return startAt;
}

function normalizeReminderMinutes(scheduledAt: string, reminderAt?: string | null) {
  if (!reminderAt) return 30;
  const minutes = Math.round((new Date(scheduledAt).getTime() - new Date(reminderAt).getTime()) / 60000);
  return Math.max(0, minutes);
}

export function normalizeCalendarTask(row: Record<string, unknown>): CalendarTaskItem | null {
  const scheduledAt = normalizeTaskScheduledAt(row);
  if (!scheduledAt) return null;

  const reminderAt = firstText(row.reminderAt, row.reminder_at) || null;
  const recurrenceRule = firstText(row.recurrenceRule, row.recurrence_rule) || undefined;
  const recurrenceEndType = firstText(row.recurrenceEndType, row.recurrence_end_type) || undefined;
  const recurrenceEndAt = firstText(row.recurrenceEndAt, row.recurrence_end_at) || null;
  const recurrenceCount = typeof row.recurrenceCount === 'number'
    ? row.recurrenceCount
    : typeof row.recurrence_count === 'number'
      ? row.recurrence_count
      : null;
  const reminderMinutes = normalizeReminderMinutes(scheduledAt, reminderAt);

  return {
    id: String(row.id || crypto.randomUUID()),
    title: firstText(row.title, row.name) || 'Zadanie bez tytułu',
    date: scheduledAt.slice(0, 10),
    dueAt: scheduledAt.slice(0, 16),
    time: scheduledAt.slice(11, 16),
    scheduledAt,
    status: firstText(row.status, row.task_status).toLowerCase() || 'todo',
    type: asNullableText(row.type, row.task_type),
    priority: asNullableText(row.priority),
    reminderAt,
    recurrenceRule,
    recurrence: row.recurrence && typeof row.recurrence === 'object'
      ? (row.recurrence as Record<string, unknown>)
      : { mode: recurrenceRule || 'none', interval: 1, until: null, endType: recurrenceEndType || 'never', count: recurrenceCount },
    reminder: row.reminder && typeof row.reminder === 'object'
      ? (row.reminder as Record<string, unknown>)
      : reminderAt
        ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
        : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrenceEndType,
    recurrenceEndAt,
    recurrenceCount,
    leadId: asNullableText(row.leadId, row.lead_id),
    leadName: asNullableText(row.leadName, row.lead_name),
    caseId: asNullableText(row.caseId, row.case_id),
  };
}

export function normalizeCalendarEvent(row: Record<string, unknown>): CalendarEventItem | null {
  const startAt = normalizeEventStartAt(row);
  if (!startAt) return null;

  const reminderAt = firstText(row.reminderAt, row.reminder_at) || null;
  const recurrenceRule = firstText(row.recurrenceRule, row.recurrence_rule) || undefined;
  const recurrenceEndType = firstText(row.recurrenceEndType, row.recurrence_end_type) || undefined;
  const recurrenceEndAt = firstText(row.recurrenceEndAt, row.recurrence_end_at) || null;
  const recurrenceCount = typeof row.recurrenceCount === 'number'
    ? row.recurrenceCount
    : typeof row.recurrence_count === 'number'
      ? row.recurrence_count
      : null;
  const reminderMinutes = normalizeReminderMinutes(startAt, reminderAt);

  return {
    id: String(row.id || crypto.randomUUID()),
    title: firstText(row.title, row.name) || 'Wydarzenie bez tytułu',
    type: firstText(row.type, row.event_type) || 'meeting',
    startAt,
    endAt: asNullableIso(row.endAt, row.end_at),
    status: firstText(row.status, row.event_status).toLowerCase() || 'scheduled',
    leadId: asNullableText(row.leadId, row.lead_id),
    leadName: asNullableText(row.leadName, row.lead_name),
    caseId: asNullableText(row.caseId, row.case_id),
    reminderAt,
    recurrenceRule,
    recurrence: row.recurrence && typeof row.recurrence === 'object'
      ? (row.recurrence as Record<string, unknown>)
      : { mode: recurrenceRule || 'none', interval: 1, until: null, endType: recurrenceEndType || 'never', count: recurrenceCount },
    reminder: row.reminder && typeof row.reminder === 'object'
      ? (row.reminder as Record<string, unknown>)
      : reminderAt
        ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
        : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrenceEndType,
    recurrenceEndAt,
    recurrenceCount,
  };
}

export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  if (!isSupabaseConfigured() || !hasStoredWorkspaceContext()) return { tasks: [], events: [], leads: [], cases: [] };

  const [taskItems, eventItems, caseItems] = await Promise.all([
    fetchTasksFromSupabase(),
    fetchEventsFromSupabase(),
    fetchCasesFromSupabase().catch(() => []),
  ]);

  return {
    tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),
    events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),
    leads: [],
    cases: caseItems as Record<string, unknown>[],
  };
}
