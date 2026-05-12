import {
  getEventEndAt,
  getEventStartAt,
  getTaskStartAt,
} from './task-event-contract';
import { normalizeLeadV1 } from './work-items/normalize';

export {
  getEventEndAt,
  getEventMainDate,
  getEventStartAt,
  getTaskDate,
  getTaskMainDate,
  getTaskStartAt,
  normalizeEventRecord,
  normalizeScheduleDateTimeValue,
  normalizeTaskRecord,
  syncTaskDerivedFields,
} from './task-event-contract';

import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isEqual,
  isToday,
  parseISO,
  startOfDay,
  subMinutes,
} from 'date-fns';
import type { CalendarReminderRule } from './work-items/normalize';

export type ScheduleRawRecord = Record<string, unknown> & {
  id?: string | number;
  title?: string;
  name?: string;
  company?: string;
  status?: string | null;
  type?: string | null;
  priority?: string | null;
  startAt?: string | Date | null;
  startsAt?: string | Date | null;
  endAt?: string | Date | null;
  endsAt?: string | Date | null;
  scheduledAt?: string | Date | null;
  dueAt?: string | Date | null;
  dateTime?: string | Date | null;
  date?: string | Date | null;
  time?: string | null;
  reminderAt?: string | Date | null;
  recurrence?: unknown;
  recurrenceRule?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  caseId?: string | null;
  caseTitle?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  customerName?: string | null;
  nextActionTitle?: string | null;
  next_action_title?: string | null;
  nextActionItemId?: string | null;
};

export type RecurrenceRule = 'none' | 'daily' | 'every_2_days' | 'weekly' | 'monthly' | 'weekday';
export type RecurrenceEndType = 'never' | 'until_date' | 'count';
export type RecurrenceMode = RecurrenceRule;
export type ReminderMode = 'none' | 'once' | 'recurring';
export type ScheduleEntryKind = 'event' | 'task' | 'lead';

export interface RecurrenceConfig {
  mode: RecurrenceMode;
  interval: number;
  until: string | null;
  endType?: RecurrenceEndType;
  count?: number | null;
}

export interface ReminderConfig {
  mode: ReminderMode;
  minutesBefore: number;
  recurrenceMode: RecurrenceMode;
  recurrenceInterval: number;
  until: string | null;
}

function isCalendarReminderRule(value: unknown): value is CalendarReminderRule {
  return Boolean(value && typeof value === 'object' && 'kind' in (value as Record<string, unknown>));
}

function parseTimeParts(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export function reminderRuleToReminderAtIso(startAt: string, rule: CalendarReminderRule | null): string | null {
  if (!rule) return null;
  const startDate = parseISO(startAt);
  if (Number.isNaN(startDate.getTime())) return null;
  const time = parseTimeParts((rule as any).time || '09:00');
  if (!time) return null;
  const reminderDate = new Date(startDate);
  reminderDate.setSeconds(0, 0);
  reminderDate.setHours(time.hours, time.minutes, 0, 0);

  if (rule.kind === 'same_day_at') {
    if (reminderDate.getTime() >= startDate.getTime()) return null;
    return reminderDate.toISOString();
  }
  if (rule.kind === 'day_before_at') {
    reminderDate.setDate(reminderDate.getDate() - 1);
    return reminderDate.toISOString();
  }
  if (rule.kind === 'two_days_before_at') {
    reminderDate.setDate(reminderDate.getDate() - 2);
    return reminderDate.toISOString();
  }
  if (rule.kind === 'week_before_at') {
    reminderDate.setDate(reminderDate.getDate() - 7);
    return reminderDate.toISOString();
  }
  if (rule.kind === 'custom') {
    const amount = Math.max(1, Math.floor(Number(rule.amount) || 0));
    reminderDate.setDate(reminderDate.getDate() - (rule.unit === 'weeks' ? amount * 7 : amount));
    return reminderDate.toISOString();
  }
  return null;
}

export interface ScheduleEntry {
  id: string;
  kind: ScheduleEntryKind;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  sourceId: string;
  link?: string;
  badgeLabel?: string;
  leadId?: string | null;
  leadName?: string | null;
  raw: ScheduleRawRecord;
}

function isRecord(value: unknown): value is ScheduleRawRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function asRecord(value: unknown): ScheduleRawRecord {
  return isRecord(value) ? value : {};
}

function readText(record: ScheduleRawRecord, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readNumber(record: ScheduleRawRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

export function toDateValue(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function toDateTimeLocalValue(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function createDefaultRecurrence(): RecurrenceConfig {
  return {
    mode: 'none',
    interval: 1,
    until: null,
    endType: 'never',
    count: null,
  };
}

export function createDefaultReminder(): ReminderConfig {
  return {
    mode: 'none',
    minutesBefore: 30,
    recurrenceMode: 'daily',
    recurrenceInterval: 1,
    until: null,
  };
}

export function normalizeRecurrenceConfig(value: unknown): RecurrenceConfig {
  const record = asRecord(value);
  const legacyRule = typeof record.recurrenceRule === 'string'
    ? record.recurrenceRule
    : typeof value === 'string'
      ? value
      : null;
  const rawMode = record.mode ?? legacyRule;
  const mode: RecurrenceMode = rawMode === 'daily' || rawMode === 'every_2_days' || rawMode === 'weekly' || rawMode === 'monthly' || rawMode === 'weekday'
    ? rawMode
    : 'none';
  const interval = mode === 'every_2_days'
    ? 2
    : readNumber(record, ['interval'], 1) > 0
      ? readNumber(record, ['interval'], 1)
      : 1;
  const endType: RecurrenceEndType = record.endType === 'until_date' || record.endType === 'count'
    ? record.endType
    : record.recurrenceEndType === 'until_date' || record.recurrenceEndType === 'count'
      ? record.recurrenceEndType
      : 'never';
  const until = typeof record.until === 'string' && record.until
    ? record.until
    : typeof record.recurrenceEndAt === 'string' && record.recurrenceEndAt
      ? record.recurrenceEndAt
      : null;
  const count = readNumber(record, ['count'], 0) > 0
    ? readNumber(record, ['count'], 0)
    : readNumber(record, ['recurrenceCount'], 0) > 0
      ? readNumber(record, ['recurrenceCount'], 0)
      : null;

  return {
    mode,
    interval,
    until,
    endType,
    count,
  };
}

export function normalizeReminderConfig(value: unknown): ReminderConfig {
  const record = asRecord(value);
  return {
    mode: record.mode === 'once' || record.mode === 'recurring' ? record.mode : 'none',
    minutesBefore: readNumber(record, ['minutesBefore'], 30) >= 0 ? readNumber(record, ['minutesBefore'], 30) : 30,
    recurrenceMode: record.recurrenceMode === 'weekly' || record.recurrenceMode === 'monthly' ? record.recurrenceMode : 'daily',
    recurrenceInterval: readNumber(record, ['recurrenceInterval'], 1) > 0 ? readNumber(record, ['recurrenceInterval'], 1) : 1,
    until: typeof record.until === 'string' && record.until ? record.until : null,
  };
}

export function toReminderAtIso(startAt: string, reminderInput: unknown): string | null {
  if (isCalendarReminderRule(reminderInput)) {
    return reminderRuleToReminderAtIso(startAt, reminderInput);
  }
  const reminder = normalizeReminderConfig(reminderInput);
  if (reminder.mode === 'none') return null;
  const startDate = parseISO(startAt);
  if (Number.isNaN(startDate.getTime())) return null;
  return subMinutes(startDate, reminder.minutesBefore).toISOString();
}

export function buildStartEndPair(startAt: string, durationMinutes = 60) {
  const startDate = parseISO(startAt);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);
  return {
    startAt,
    endAt: toDateTimeLocalValue(endDate),
  };
}

function advanceByRecurrence(date: Date, recurrence: RecurrenceConfig) {
  const step = recurrence.interval > 0 ? recurrence.interval : 1;
  switch (recurrence.mode) {
    case 'daily':
      return addDays(date, step);
    case 'every_2_days':
      return addDays(date, 2 * step);
    case 'weekly':
      return addWeeks(date, step);
    case 'monthly':
      return addMonths(date, step);
    case 'weekday': {
      let target = addDays(date, 1);
      while (target.getDay() === 0 || target.getDay() === 6) {
        target = addDays(target, 1);
      }
      return target;
    }
    default:
      return addDays(date, 10_000);
  }
}

function getSafeUntil(until: string | null) {
  return until ? endOfDay(parseISO(until)) : null;
}

export function expandRecurringMoments(baseStartAt: string, recurrenceInput: unknown, rangeStart: Date, rangeEnd: Date) {
  const recurrence = normalizeRecurrenceConfig(recurrenceInput);
  const baseDate = parseISO(baseStartAt);

  if (recurrence.mode === 'none') {
    if (isBefore(baseDate, rangeStart) || isAfter(baseDate, rangeEnd)) return [] as Date[];
    return [baseDate];
  }

  const until = getSafeUntil(recurrence.until);
  const results: Date[] = [];
  let cursor = baseDate;
  let guard = 0;
  let emitted = 0;

  while (guard < 366) {
    guard += 1;

    if (until && isAfter(cursor, until)) break;
    if (recurrence.endType === 'count' && recurrence.count && emitted >= recurrence.count) break;

    const visible = (isEqual(cursor, rangeStart) || isAfter(cursor, rangeStart)) &&
      (isEqual(cursor, rangeEnd) || isBefore(cursor, rangeEnd));

    if (visible) results.push(cursor);
    emitted += 1;
    if (isAfter(cursor, rangeEnd)) break;

    const nextCursor = advanceByRecurrence(cursor, recurrence);
    if (isEqual(nextCursor, cursor)) break;
    cursor = nextCursor;
  }

  return results;
}

export function expandEventEntries(events: ScheduleRawRecord[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  return events.flatMap((event) => {
    if (!event.startAt || typeof event.startAt !== 'string') return [] as ScheduleEntry[];

    return expandRecurringMoments(event.startAt, event.recurrence, rangeStart, rangeEnd).map((occurrence, index) => {
      const baseStart = parseISO(String(event.startAt));
      const baseEnd = typeof event.endAt === 'string' ? parseISO(event.endAt) : null;
      const duration = baseEnd ? baseEnd.getTime() - baseStart.getTime() : 0;
      const occurrenceEnd = duration > 0 ? new Date(occurrence.getTime() + duration) : null;
      const eventId = String(event.id || crypto.randomUUID());

      return {
        id: eventId + ':' + String(index),
        kind: 'event' as const,
        title: readText(event, ['title'], 'Wydarzenie'),
        startsAt: toDateTimeLocalValue(occurrence),
        endsAt: occurrenceEnd ? toDateTimeLocalValue(occurrenceEnd) : null,
        sourceId: eventId,
        link: '/calendar',
        badgeLabel: 'Wydarzenie',
        leadId: typeof event.leadId === 'string' ? event.leadId : null,
        leadName: typeof event.leadName === 'string' ? event.leadName : null,
        raw: event,
      };
    });
  });
}

export function expandTaskEntries(tasks: ScheduleRawRecord[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  return tasks.flatMap((task) => {
    const startAt = getTaskStartAt(task);
    if (!startAt) return [] as ScheduleEntry[];

    const recurrenceSource = task.recurrence ?? {
      recurrenceRule: task.recurrenceRule,
      recurrenceEndType: task.recurrenceEndType,
      recurrenceEndAt: task.recurrenceEndAt,
      recurrenceCount: task.recurrenceCount,
    };

    return expandRecurringMoments(startAt, recurrenceSource, rangeStart, rangeEnd).map((occurrence, index) => {
      const taskId = String(task.id || crypto.randomUUID());

      return {
        id: taskId + ':' + String(index),
        kind: 'task' as const,
        title: readText(task, ['title'], 'Zadanie'),
        startsAt: toDateTimeLocalValue(occurrence),
        endsAt: null,
        sourceId: taskId,
        link: '/tasks',
        badgeLabel: 'Zadanie',
        leadId: typeof task.leadId === 'string' ? task.leadId : null,
        leadName: typeof task.leadName === 'string' ? task.leadName : null,
        raw: task,
      };
    });
  });
}

function getLeadCalendarMoment(lead: ScheduleRawRecord) {
  const normalizedLead = normalizeLeadV1(lead);
  const direct = readText(lead, ['nextActionAt', 'next_action_at', 'followUpAt', 'follow_up_at']);
  if (direct) return direct;

  const dateField = readText(lead, [
    'nextActionDate',
    'next_action_date',
    'followUpDate',
    'follow_up_date',
    'date',
  ]);
  if (!dateField) return '';

  const timeField = readText(lead, [
    'nextActionTime',
    'next_action_time',
    'followUpTime',
    'follow_up_time',
    'time',
  ], '09:00');
  const seedDate = dateField.includes('T') ? dateField : dateField + 'T' + timeField;
  return seedDate || (normalizedLead.createdAt || '');
}

export function expandLeadEntries(leads: ScheduleRawRecord[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  // STAGE34_CALENDAR_LEAD_NEXT_ACTIONS: leads with nextActionAt/followUpAt are visible in calendar.
  return leads.flatMap((lead) => {
    const startAt = getLeadCalendarMoment(lead);
    if (!startAt) return [] as ScheduleEntry[];

    const date = parseISO(startAt);
    if (Number.isNaN(date.getTime())) return [] as ScheduleEntry[];
    if (isBefore(date, rangeStart) || isAfter(date, rangeEnd)) return [] as ScheduleEntry[];

    const leadId = String(lead.id || crypto.randomUUID());
    const title = readText(lead, ['nextActionTitle', 'next_action_title', 'title', 'name', 'company'], 'Lead do obsługi');
    const leadName = readText(lead, ['name', 'company']);

    return [{
      id: 'lead:' + leadId,
      kind: 'lead' as const,
      title,
      startsAt: toDateTimeLocalValue(date),
      endsAt: null,
      sourceId: leadId,
      link: lead.id ? '/leads/' + leadId : '/leads',
      badgeLabel: 'Lead',
      leadId: lead.id ? leadId : null,
      leadName: leadName || null,
      raw: lead,
    }];
  });
}

function choosePreferredEntry(existing: ScheduleEntry, incoming: ScheduleEntry) {
  const existingDone = existing.kind === 'task' && existing.raw.status === 'done';
  const incomingDone = incoming.kind === 'task' && incoming.raw.status === 'done';

  if (existingDone !== incomingDone) {
    return incomingDone ? incoming : existing;
  }

  return existing;
}

function dedupeScheduleEntries(entries: ScheduleEntry[]) {
  const deduped = new Map<string, ScheduleEntry>();

  for (const entry of entries) {
    const dedupeKey = entry.kind + '::' + entry.sourceId + '::' + entry.startsAt;
    const existing = deduped.get(dedupeKey);
    if (!existing) {
      deduped.set(dedupeKey, entry);
      continue;
    }
    deduped.set(dedupeKey, choosePreferredEntry(existing, entry));
  }

  return Array.from(deduped.values());
}

function normalizeComparableTitle(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function shouldHideLeadEntry(leadEntry: ScheduleEntry, entries: ScheduleEntry[]) {
  if (leadEntry.kind !== 'lead') return false;

  const linkedItemId = readText(leadEntry.raw, ['nextActionItemId', 'next_action_item_id']);
  const leadTitle = normalizeComparableTitle(leadEntry.title);

  return entries.some((entry) => {
    if (entry.id === leadEntry.id || entry.kind === 'lead') return false;

    if (linkedItemId && entry.sourceId === linkedItemId) {
      return true;
    }

    const sameLead = Boolean(entry.leadId && leadEntry.leadId && String(entry.leadId) === String(leadEntry.leadId));
    const sameMoment = entry.startsAt === leadEntry.startsAt;
    const sameTitle = normalizeComparableTitle(entry.title) === leadTitle;

    return sameLead && sameMoment && sameTitle;
  });
}

function removeLeadShadowEntries(entries: ScheduleEntry[]) {
  return entries.filter((entry) => !shouldHideLeadEntry(entry, entries));
}

// P0_TODAY_OPERATOR_SECTIONS_FIX
// P0_TODAY_OPERATOR_SECTIONS_DAY_BUCKET_FIX
// Today is an operator dashboard: overdue open tasks and active leads without a
// next action must stay visible. Otherwise work disappears after the scheduled
// hour and the user sees a false empty day.
// Operator catch-up entries are rendered in today's bucket, because getEntriesForDay
// filters by visible startsAt and would otherwise drop older overdue records again.
function isOperatorTodayRange(rangeEnd: Date) {
  return isToday(rangeEnd);
}

function getScheduleStatus(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function isClosedTaskStatus(value: unknown) {
  const status = getScheduleStatus(value);
  return status === 'done' || status === 'completed' || status === 'canceled' || status === 'cancelled' || status === 'closed';
}

function isClosedLeadStatus(value: unknown) {
  const status = getScheduleStatus(value);
  return status === 'won' || status === 'lost' || status === 'archived' || status === 'moved_to_service';
}

function isActiveOpenLeadForOperatorToday(lead: ScheduleRawRecord) {
  const visibility = getScheduleStatus(lead.leadVisibility || lead.lead_visibility || 'active');
  const outcome = getScheduleStatus(lead.salesOutcome || lead.sales_outcome || 'open');
  const movedToService = lead.movedToService === true || Boolean(lead.moved_to_service_at || lead.movedToServiceAt);

  if (movedToService) return false;
  if (visibility === 'archived' || visibility === 'hidden') return false;
  if (outcome === 'won' || outcome === 'lost' || outcome === 'moved_to_service' || outcome === 'closed') return false;
  return !isClosedLeadStatus(lead.status);
}

function parseScheduleMoment(value: unknown) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;
  const parsed = parseISO(raw.includes('T') ? raw : raw + 'T09:00:00');
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isBeforeRangeStart(moment: Date | null, rangeStart: Date) {
  if (!moment) return false;
  return isBefore(moment, rangeStart);
}

function isOnOrBeforeRangeEnd(moment: Date | null, rangeEnd: Date) {
  if (!moment) return false;
  return isBefore(moment, rangeEnd) || isEqual(moment, rangeEnd);
}

function buildOperatorTodayTaskEntry(task: ScheduleRawRecord, moment: Date): ScheduleEntry {
  const taskId = String(task.id || crypto.randomUUID());
  return {
    id: taskId + ':operator-today',
    kind: 'task' as const,
    title: readText(task, ['title'], 'Zadanie'),
    startsAt: toDateTimeLocalValue(moment),
    endsAt: null,
    sourceId: taskId,
    link: '/tasks',
    badgeLabel: 'Zadanie',
    leadId: typeof task.leadId === 'string' ? task.leadId : null,
    leadName: typeof task.leadName === 'string' ? task.leadName : null,
    raw: task,
  };
}

function expandOperatorTodayTaskEntries(tasks: ScheduleRawRecord[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  if (!isOperatorTodayRange(rangeEnd)) return [];

  const todayMorning = startOfDay(rangeEnd);
  todayMorning.setHours(9, 0, 0, 0);

  return tasks.flatMap((task) => {
    if (isClosedTaskStatus(task.status)) return [] as ScheduleEntry[];

    const startAt = getTaskStartAt(task);
    const moment = parseScheduleMoment(startAt);
    if (!moment) return [] as ScheduleEntry[];

    const alreadyIncludedByNormalRange = !isBeforeRangeStart(moment, rangeStart);
    if (alreadyIncludedByNormalRange) return [] as ScheduleEntry[];
    if (!isOnOrBeforeRangeEnd(moment, rangeEnd)) return [] as ScheduleEntry[];

    const displayMoment = isBefore(moment, startOfDay(rangeEnd)) ? todayMorning : moment;
    return [buildOperatorTodayTaskEntry(task, displayMoment)];
  });
}

function buildOperatorTodayLeadEntry(lead: ScheduleRawRecord, moment: Date, reasonLabel: string): ScheduleEntry {
  const leadId = String(lead.id || crypto.randomUUID());
  const leadName = readText(lead, ['name', 'company'], 'Lead');
  const actionTitle = readText(lead, ['nextActionTitle', 'next_action_title'], reasonLabel);

  return {
    id: 'lead-operator:' + leadId,
    kind: 'lead' as const,
    title: actionTitle,
    startsAt: toDateTimeLocalValue(moment),
    endsAt: null,
    sourceId: leadId,
    link: lead.id ? '/leads/' + leadId : '/leads',
    badgeLabel: 'Lead',
    leadId: lead.id ? leadId : null,
    leadName: leadName || null,
    raw: lead,
  };
}

function expandOperatorTodayLeadEntries(leads: ScheduleRawRecord[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  if (!isOperatorTodayRange(rangeEnd)) return [];

  const todayMorning = startOfDay(rangeEnd);
  todayMorning.setHours(9, 0, 0, 0);

  return leads.flatMap((lead) => {
    if (!isActiveOpenLeadForOperatorToday(lead)) return [] as ScheduleEntry[];

    const calendarMomentRaw = getLeadCalendarMoment(lead);
    const calendarMoment = parseScheduleMoment(calendarMomentRaw);

    if (!calendarMoment) {
      return [buildOperatorTodayLeadEntry(lead, todayMorning, 'Ustal następny krok')];
    }

    const alreadyIncludedByNormalRange = !isBeforeRangeStart(calendarMoment, rangeStart);
    if (alreadyIncludedByNormalRange) return [] as ScheduleEntry[];
    if (!isOnOrBeforeRangeEnd(calendarMoment, rangeEnd)) return [] as ScheduleEntry[];

    const displayMoment = isBefore(calendarMoment, startOfDay(rangeEnd)) ? todayMorning : calendarMoment;
    return [buildOperatorTodayLeadEntry(lead, displayMoment, 'Zaległy kontakt')];
  });
}

export function combineScheduleEntries({
  events,
  tasks,
  leads,
  rangeStart,
  rangeEnd,
}: {
  events: ScheduleRawRecord[];
  tasks: ScheduleRawRecord[];
  leads: ScheduleRawRecord[];
  rangeStart: Date;
  rangeEnd: Date;
}) {
  const merged = dedupeScheduleEntries([
    ...expandEventEntries(events, rangeStart, rangeEnd),
    ...expandTaskEntries(tasks, rangeStart, rangeEnd),
    ...expandOperatorTodayTaskEntries(tasks, rangeStart, rangeEnd),
    ...expandLeadEntries(leads, rangeStart, rangeEnd),
    ...expandOperatorTodayLeadEntries(leads, rangeStart, rangeEnd),
  ]);

  return removeLeadShadowEntries(merged)
    .sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime());
}

export function getEntriesForDay(entries: ScheduleEntry[], day: Date) {
  const start = startOfDay(day);
  const end = endOfDay(day);
  return entries.filter((entry) => {
    const date = parseISO(entry.startsAt);
    return (isEqual(date, start) || isAfter(date, start)) && (isEqual(date, end) || isBefore(date, end));
  });
}

export function getEntryTone(entry: ScheduleEntry) {
  if (entry.kind === 'event') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  if (entry.kind === 'task') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-amber-50 text-amber-700 border-amber-100';
}

// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING
export const CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING = 'tasks-events-notes-followups-deadlines-meetings-calls-emails-payments-system';
export type CloseFlowSchedulingActionKind = 'task' | 'event' | 'note' | 'followup' | 'deadline' | 'meeting' | 'call' | 'email' | 'payment' | 'system' | 'default';
