import {
  getEventEndAt,
  getEventStartAt,
  getTaskStartAt,
} from './task-event-contract';

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
  parseISO,
  startOfDay,
  subMinutes,
} from 'date-fns';

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
  raw: any;
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

export function normalizeRecurrenceConfig(value: any): RecurrenceConfig {
  const legacyRule = typeof value?.recurrenceRule === 'string' ? value.recurrenceRule : typeof value === 'string' ? value : null;
  const rawMode = value?.mode ?? legacyRule;
  const mode: RecurrenceMode = rawMode === 'daily' || rawMode === 'every_2_days' || rawMode === 'weekly' || rawMode === 'monthly' || rawMode === 'weekday'
    ? rawMode
    : 'none';
  const interval = mode === 'every_2_days'
    ? 2
    : Number.isFinite(Number(value?.interval)) && Number(value.interval) > 0
      ? Number(value.interval)
      : 1;
  const endType: RecurrenceEndType = value?.endType === 'until_date' || value?.endType === 'count'
    ? value.endType
    : value?.recurrenceEndType === 'until_date' || value?.recurrenceEndType === 'count'
      ? value.recurrenceEndType
      : 'never';
  const until = typeof value?.until === 'string' && value.until
    ? value.until
    : typeof value?.recurrenceEndAt === 'string' && value.recurrenceEndAt
      ? value.recurrenceEndAt
      : null;
  const count = Number.isFinite(Number(value?.count)) && Number(value.count) > 0
    ? Number(value.count)
    : Number.isFinite(Number(value?.recurrenceCount)) && Number(value.recurrenceCount) > 0
      ? Number(value.recurrenceCount)
      : null;

  return {
    mode,
    interval,
    until,
    endType,
    count,
  };
}

export function normalizeReminderConfig(value: any): ReminderConfig {
  return {
    mode: value?.mode === 'once' || value?.mode === 'recurring' ? value.mode : 'none',
    minutesBefore: Number.isFinite(Number(value?.minutesBefore)) && Number(value.minutesBefore) >= 0 ? Number(value.minutesBefore) : 30,
    recurrenceMode: value?.recurrenceMode === 'weekly' || value?.recurrenceMode === 'monthly' ? value.recurrenceMode : 'daily',
    recurrenceInterval: Number.isFinite(Number(value?.recurrenceInterval)) && Number(value.recurrenceInterval) > 0 ? Number(value.recurrenceInterval) : 1,
    until: typeof value?.until === 'string' && value.until ? value.until : null,
  };
}

export function toReminderAtIso(startAt: string, reminderInput: any): string | null {
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

export function expandRecurringMoments(baseStartAt: string, recurrenceInput: any, rangeStart: Date, rangeEnd: Date) {
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

export function expandEventEntries(events: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  return events.flatMap((event) => {
    if (!event?.startAt) return [] as ScheduleEntry[];

    return expandRecurringMoments(event.startAt, event.recurrence, rangeStart, rangeEnd).map((occurrence, index) => {
      const baseStart = parseISO(event.startAt);
      const baseEnd = event.endAt ? parseISO(event.endAt) : null;
      const duration = baseEnd ? baseEnd.getTime() - baseStart.getTime() : 0;
      const occurrenceEnd = duration > 0 ? new Date(occurrence.getTime() + duration) : null;

      return {
        id: `${event.id}:${index}`,
        kind: 'event' as const,
        title: event.title,
        startsAt: toDateTimeLocalValue(occurrence),
        endsAt: occurrenceEnd ? toDateTimeLocalValue(occurrenceEnd) : null,
        sourceId: event.id,
        link: '/calendar',
        badgeLabel: 'Wydarzenie',
        leadId: event.leadId ?? null,
        leadName: event.leadName ?? null,
        raw: event,
      };
    });
  });
}

export function expandTaskEntries(tasks: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  return tasks.flatMap((task) => {
    const startAt = getTaskStartAt(task);
    if (!startAt) return [] as ScheduleEntry[];

    const recurrenceSource = task.recurrence ?? {
      recurrenceRule: task.recurrenceRule,
      recurrenceEndType: task.recurrenceEndType,
      recurrenceEndAt: task.recurrenceEndAt,
      recurrenceCount: task.recurrenceCount,
    };

    return expandRecurringMoments(startAt, recurrenceSource, rangeStart, rangeEnd).map((occurrence, index) => ({
      id: `${task.id}:${index}`,
      kind: 'task' as const,
      title: task.title,
      startsAt: toDateTimeLocalValue(occurrence),
      endsAt: null,
      sourceId: task.id,
      link: '/tasks',
      badgeLabel: 'Zadanie',
      leadId: task.leadId ?? null,
      leadName: task.leadName ?? null,
      raw: task,
    }));
  });
}

function getLeadCalendarMoment(lead: any) {
  const direct = String(
    lead?.nextActionAt ||
    lead?.next_action_at ||
    lead?.followUpAt ||
    lead?.follow_up_at ||
    lead?.scheduledAt ||
    lead?.scheduled_at ||
    lead?.reminderAt ||
    lead?.reminder_at ||
    '',
  ).trim();
  if (direct) return direct;

  const dateField = String(
    lead?.nextActionDate ||
    lead?.next_action_date ||
    lead?.followUpDate ||
    lead?.follow_up_date ||
    lead?.date ||
    '',
  ).trim();
  if (!dateField) return "";

  const timeField = String(
    lead?.nextActionTime ||
    lead?.next_action_time ||
    lead?.followUpTime ||
    lead?.follow_up_time ||
    lead?.time ||
    '09:00',
  ).trim();
  return dateField.includes('T') ? dateField : dateField + 'T' + timeField;
}
export function expandLeadEntries(leads: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  // STAGE34_CALENDAR_LEAD_NEXT_ACTIONS: leads with nextActionAt/followUpAt are visible in calendar.
  return leads.flatMap((lead) => {
    const startAt = getLeadCalendarMoment(lead);
    if (!startAt) return [] as ScheduleEntry[];

    const date = parseISO(startAt);
    if (Number.isNaN(date.getTime())) return [] as ScheduleEntry[];
    if (isBefore(date, rangeStart) || isAfter(date, rangeEnd)) return [] as ScheduleEntry[];

    return [{
      id: 'lead:' + String(lead.id || crypto.randomUUID()),
      kind: 'lead' as const,
      title: String(lead.nextActionTitle || lead.next_action_title || lead.title || lead.name || lead.company || 'Lead do obsługi'),
      startsAt: toDateTimeLocalValue(date),
      endsAt: null,
      sourceId: String(lead.id || crypto.randomUUID()),
      link: lead.id ? '/leads/' + String(lead.id) : '/leads',
      badgeLabel: 'Lead',
      leadId: lead.id ? String(lead.id) : null,
      leadName: lead.name || lead.company || null,
      raw: lead,
    }];
  });
}

function choosePreferredEntry(existing: ScheduleEntry, incoming: ScheduleEntry) {
  const existingDone = existing.kind === 'task' && existing.raw?.status === 'done';
  const incomingDone = incoming.kind === 'task' && incoming.raw?.status === 'done';

  if (existingDone !== incomingDone) {
    return incomingDone ? incoming : existing;
  }

  return existing;
}

function dedupeScheduleEntries(entries: ScheduleEntry[]) {
  const deduped = new Map<string, ScheduleEntry>();

  for (const entry of entries) {
    const dedupeKey = `${entry.kind}::${entry.sourceId}::${entry.startsAt}`;
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

  const linkedItemId = String(
    leadEntry.raw?.nextActionItemId || leadEntry.raw?.next_action_item_id || '',
  ).trim();
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

export function combineScheduleEntries({
  events,
  tasks,
  leads,
  rangeStart,
  rangeEnd,
}: {
  events: any[];
  tasks: any[];
  leads: any[];
  rangeStart: Date;
  rangeEnd: Date;
}) {
  const merged = dedupeScheduleEntries([
    ...expandEventEntries(events, rangeStart, rangeEnd),
    ...expandTaskEntries(tasks, rangeStart, rangeEnd),
    ...expandLeadEntries(leads, rangeStart, rangeEnd),
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
