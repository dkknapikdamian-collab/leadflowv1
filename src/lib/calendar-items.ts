import { isValid, parseISO } from 'date-fns';
import { fetchCasesFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, isSupabaseConfigured } from './supabase-fallback';

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
  return typeof value === 'string' ? value : '';
}

export function normalizeCalendarTask(row: Record<string, unknown>): CalendarTaskItem | null {
  const dueAt = asString(row.dueAt);
  const scheduledAtField = asString(row.scheduledAt);
  const dateField = asString(row.date);
  const timeField = asString(row.time) || '09:00';
  const scheduledAt = (dueAt && isIsoLike(dueAt) ? dueAt : '') || (scheduledAtField && isIsoLike(scheduledAtField) ? scheduledAtField : '') || (dateField ? `${dateField}T${timeField}` : '');
  if (!scheduledAt || !isIsoLike(scheduledAt)) return null;

  const reminderAt = row.reminderAt ? String(row.reminderAt) : null;
  const recurrenceRule = row.recurrenceRule ? String(row.recurrenceRule) : undefined;
  const reminderMinutes = reminderAt ? Math.max(0, Math.round((new Date(scheduledAt).getTime() - new Date(reminderAt).getTime()) / 60000)) : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    date: scheduledAt.slice(0, 10),
    dueAt: scheduledAt.slice(0, 16),
    time: scheduledAt.slice(11, 16),
    scheduledAt,
    status: String(row.status || 'todo'),
    type: row.type ? String(row.type) : undefined,
    priority: row.priority ? String(row.priority) : undefined,
    reminderAt,
    recurrenceRule,
    reminder: reminderAt ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null } : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrence: { mode: recurrenceRule || 'none', interval: 1, until: null, endType: 'never', count: null },
    recurrenceEndType: row.recurrenceEndType ? String(row.recurrenceEndType) : undefined,
    recurrenceEndAt: row.recurrenceEndAt ? String(row.recurrenceEndAt) : null,
    recurrenceCount: typeof row.recurrenceCount === 'number' ? row.recurrenceCount : null,
    leadId: row.leadId ? String(row.leadId) : undefined,
    leadName: row.leadName ? String(row.leadName) : undefined,
    caseId: row.caseId ? String(row.caseId) : undefined,
  };
}

export function normalizeCalendarEvent(row: Record<string, unknown>): CalendarEventItem | null {
  const startAt = asString(row.startAt);
  if (!isIsoLike(startAt)) return null;

  const reminderAt = row.reminderAt ? String(row.reminderAt) : null;
  const recurrenceRule = row.recurrenceRule ? String(row.recurrenceRule) : undefined;
  const reminderMinutes = reminderAt ? Math.max(0, Math.round((new Date(startAt).getTime() - new Date(reminderAt).getTime()) / 60000)) : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || 'meeting'),
    startAt,
    endAt: row.endAt ? String(row.endAt) : undefined,
    status: String(row.status || 'scheduled'),
    leadId: row.leadId ? String(row.leadId) : undefined,
    leadName: row.leadName ? String(row.leadName) : undefined,
    caseId: row.caseId ? String(row.caseId) : undefined,
    reminderAt,
    recurrenceRule,
    reminder: reminderAt ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null } : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrence: { mode: recurrenceRule || 'none', interval: 1, until: null, endType: 'never', count: null },
    recurrenceEndType: row.recurrenceEndType ? String(row.recurrenceEndType) : undefined,
    recurrenceEndAt: row.recurrenceEndAt ? String(row.recurrenceEndAt) : null,
    recurrenceCount: typeof row.recurrenceCount === 'number' ? row.recurrenceCount : null,
  };
}

export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  if (!isSupabaseConfigured()) return { tasks: [], events: [], leads: [], cases: [] };

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
