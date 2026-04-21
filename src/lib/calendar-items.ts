import { isValid, parseISO } from 'date-fns';
import { fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, isSupabaseConfigured } from './supabase-fallback';

export type CalendarTaskItem = {
  id: string;
  title: string;
  date: string;
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
  reminderAt?: string | null;
  recurrenceRule?: string;
  recurrenceEndType?: string;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  recurrence?: Record<string, unknown>;
  reminder?: Record<string, unknown>;
};

export type CalendarLeadActionItem = {
  id: string;
  name: string;
  nextActionAt?: string;
  nextStep?: string;
  nextActionItemId?: string;
  status?: string;
  dealValue?: number;
  phone?: string;
  company?: string;
  source?: string;
  isAtRisk?: boolean;
  updatedAt?: string | null;
};

export type CalendarBundle = {
  tasks: CalendarTaskItem[];
  events: CalendarEventItem[];
  leads: CalendarLeadActionItem[];
};

function isIsoLike(value?: string | null) {
  if (!value) return false;
  const parsed = parseISO(value);
  return isValid(parsed);
}

export function normalizeCalendarTask(row: Record<string, unknown>): CalendarTaskItem | null {
  const date = typeof row.date === 'string' ? row.date : '';
  if (!isIsoLike(date)) return null;

  const reminderAt = row.reminderAt ? String(row.reminderAt) : null;
  const recurrenceRule = row.recurrenceRule ? String(row.recurrenceRule) : undefined;
  const startAt = `${date}T09:00:00.000Z`;
  const reminderMinutes = reminderAt
    ? Math.max(0, Math.round((new Date(startAt).getTime() - new Date(reminderAt).getTime()) / 60_000))
    : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    date,
    status: String(row.status || 'todo'),
    type: row.type ? String(row.type) : undefined,
    priority: row.priority ? String(row.priority) : undefined,
    reminderAt,
    recurrenceRule,
    reminder: reminderAt
      ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
      : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrence: {
      mode: recurrenceRule || 'none',
      interval: 1,
      until: null,
      endType: 'never',
      count: null,
    },
    recurrenceEndType: row.recurrenceEndType ? String(row.recurrenceEndType) : undefined,
    recurrenceEndAt: row.recurrenceEndAt ? String(row.recurrenceEndAt) : null,
    recurrenceCount: typeof row.recurrenceCount === 'number' ? row.recurrenceCount : null,
    leadId: row.leadId ? String(row.leadId) : undefined,
    leadName: row.leadName ? String(row.leadName) : undefined,
  };
}

export function normalizeCalendarEvent(row: Record<string, unknown>): CalendarEventItem | null {
  const startAt = typeof row.startAt === 'string' ? row.startAt : '';
  if (!isIsoLike(startAt)) return null;

  const reminderAt = row.reminderAt ? String(row.reminderAt) : null;
  const recurrenceRule = row.recurrenceRule ? String(row.recurrenceRule) : undefined;
  const reminderMinutes = reminderAt
    ? Math.max(0, Math.round((new Date(startAt).getTime() - new Date(reminderAt).getTime()) / 60_000))
    : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || 'meeting'),
    startAt,
    endAt: row.endAt ? String(row.endAt) : undefined,
    status: String(row.status || 'scheduled'),
    leadId: row.leadId ? String(row.leadId) : undefined,
    leadName: row.leadName ? String(row.leadName) : undefined,
    reminderAt,
    recurrenceRule,
    reminder: reminderAt
      ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
      : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrence: {
      mode: recurrenceRule || 'none',
      interval: 1,
      until: null,
      endType: 'never',
      count: null,
    },
    recurrenceEndType: row.recurrenceEndType ? String(row.recurrenceEndType) : undefined,
    recurrenceEndAt: row.recurrenceEndAt ? String(row.recurrenceEndAt) : null,
    recurrenceCount: typeof row.recurrenceCount === 'number' ? row.recurrenceCount : null,
  };
}

export function normalizeCalendarLeadAction(row: Record<string, unknown>): CalendarLeadActionItem | null {
  const status = row.status ? String(row.status) : undefined;
  if (status === 'won' || status === 'lost') return null;

  const nextActionAt = typeof row.nextActionAt === 'string' && isIsoLike(row.nextActionAt)
    ? row.nextActionAt
    : undefined;

  return {
    id: String(row.id || crypto.randomUUID()),
    name: String(row.name || ''),
    nextActionAt,
    nextStep: row.nextStep ? String(row.nextStep) : undefined,
    nextActionItemId: row.nextActionItemId ? String(row.nextActionItemId) : undefined,
    status,
    dealValue: Number(row.dealValue || 0),
    phone: row.phone ? String(row.phone) : undefined,
    company: row.company ? String(row.company) : undefined,
    source: row.source ? String(row.source) : undefined,
    isAtRisk: Boolean(row.isAtRisk),
    updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : null,
  };
}

export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  if (!isSupabaseConfigured()) {
    return { tasks: [], events: [], leads: [] };
  }

  const [taskItems, eventItems, leadItems] = await Promise.all([
    fetchTasksFromSupabase(),
    fetchEventsFromSupabase(),
    fetchLeadsFromSupabase(),
  ]);

  return {
    tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),
    events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),
    leads: (leadItems as Record<string, unknown>[]).map(normalizeCalendarLeadAction).filter((item): item is CalendarLeadActionItem => Boolean(item)),
  };
}
