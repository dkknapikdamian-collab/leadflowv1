import { isValid, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchMeFromSupabase,
  fetchTasksFromSupabase,
  syncGoogleCalendarInboundInSupabase,
  getStoredWorkspaceId,
  isSupabaseConfigured,
} from './supabase-fallback';
import { normalizeWorkItem } from './work-items/normalize';

export type CalendarTaskItem = {
  id: string;
  title: string;
  date: string;
  dueAt?: string;
  time?: string;
  scheduledAt?: string;
  startAt?: string;
  startsAt?: string;
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
  startsAt?: string;
  scheduledAt?: string;
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

const CALENDAR_BOOTSTRAP_DELAYS_MS = [0, 250, 650, 1200, 2000];
const CALENDAR_READ_DELAYS_MS = [0, 350, 900, 1600, 2600];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasWorkspaceContext() {
  return Boolean(getStoredWorkspaceId());
}

function shouldRetryRead(error: unknown) {
  const message = String(error instanceof Error ? error.message : error || '').toLowerCase();
  return message.includes('workspace') || message.includes('auth') || message.includes('required') || message.includes('forbidden');
}

async function ensureWorkspaceContext() {
  if (hasWorkspaceContext()) return;
  for (const delayMs of CALENDAR_BOOTSTRAP_DELAYS_MS) {
    if (delayMs > 0) await wait(delayMs);
    if (hasWorkspaceContext()) return;
    await fetchMeFromSupabase().catch(() => null);
    if (hasWorkspaceContext()) return;
  }
}

async function readCollection<T>(loader: () => Promise<T[]>): Promise<T[]> {
  for (const delayMs of CALENDAR_READ_DELAYS_MS) {
    if (delayMs > 0) await wait(delayMs);
    try {
      return await loader();
    } catch (error) {
      if (!shouldRetryRead(error)) return [];
      await ensureWorkspaceContext();
    }
  }
  return [];
}

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
  if (row.reminderRule && typeof row.reminderRule === 'object') return row.reminderRule as Record<string, unknown>;
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
  const task = normalizeWorkItem(row);
  const scheduledAt = task.dateAt || task.scheduledAt;
  if (!scheduledAt || !isIsoLike(scheduledAt)) return null;

  const { recurrenceEndType, recurrenceEndAt, recurrenceCount } = getRecurrenceMeta(row);

  return {
    id: task.id,
    title: task.title || 'Zadanie bez tytułu',
    date: scheduledAt.slice(0, 10),
    dueAt: scheduledAt,
    time: scheduledAt.slice(11, 16),
    scheduledAt,
    startAt: scheduledAt,
    startsAt: scheduledAt,
    status: task.status || 'todo',
    type: task.type || 'task',
    priority: typeof row.priority === 'string' ? row.priority : undefined,
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
  const event = normalizeWorkItem(row);
  const startAt = event.dateAt || event.startAt;
  if (!startAt || !isIsoLike(startAt)) return null;

  const { recurrenceEndType, recurrenceEndAt, recurrenceCount } = getRecurrenceMeta(row);

  return {
    id: event.id,
    title: event.title || 'Wydarzenie bez tytułu',
    type: event.type || 'event',
    startAt,
    startsAt: startAt,
    scheduledAt: startAt,
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

let lastGoogleCalendarInboundPullAt = 0;
const GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS = 60_000;

async function maybePullGoogleCalendarInboundBeforeBundle() {
  // GOOGLE_CALENDAR_STAGE10K_AUTO_PULL_BEFORE_BUNDLE
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (now - lastGoogleCalendarInboundPullAt < GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS) return;
  lastGoogleCalendarInboundPullAt = now;
  try {
    const result = await syncGoogleCalendarInboundInSupabase({ daysBack: 30, daysForward: 90 });
    const conflicts = Array.isArray(result?.conflicts) ? result.conflicts : [];
    if (conflicts.length) {
      const first = conflicts[0] || {};
      toast.warning('Konflikt z Google Calendar', {
        description: first.message || ('Wykryto ' + conflicts.length + ' konfliktów terminów po synchronizacji z Google Calendar.'),
      });
    }
  } catch (error) {
    console.warn('GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_FAILED', error);
  }
}

// P0_TODAY_403_RESILIENT_BUNDLE
// P0_TODAY_BOOTSTRAP_RETRY
// P0_TODAY_TIME_FIELD_COMPAT
export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  if (!isSupabaseConfigured()) return { tasks: [], events: [], leads: [], cases: [] };

  await ensureWorkspaceContext();

  await maybePullGoogleCalendarInboundBeforeBundle(); // GOOGLE_CALENDAR_STAGE10N_AUTO_PULL_CALL

  const [taskItems, eventItems, caseItems, leadItems] = await Promise.all([
    readCollection(() => fetchTasksFromSupabase()),
    readCollection(() => fetchEventsFromSupabase()),
    readCollection(() => fetchCasesFromSupabase()),
    readCollection(() => fetchLeadsFromSupabase()),
  ]);

  return {
    tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),
    events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),
    leads: leadItems as Record<string, unknown>[],
    cases: caseItems as Record<string, unknown>[],
  };
}
