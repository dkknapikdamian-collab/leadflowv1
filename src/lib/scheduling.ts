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
  subMinutes,
  startOfDay,
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

export function getTaskStartAt(task: any): string | null {
  if (typeof task?.dueAt === 'string' && task.dueAt) return task.dueAt;
  if (typeof task?.date === 'string' && task.date) {
    const time = typeof task?.time === 'string' && task.time ? task.time : '09:00';
    return `${task.date}T${time}`;
  }
  return null;
}

export function getTaskDate(task: any): string {
  if (typeof task?.date === 'string' && task.date) return task.date;
  const startAt = getTaskStartAt(task);
  return startAt ? format(parseISO(startAt), 'yyyy-MM-dd') : toDateValue(new Date());
}

export function syncTaskDerivedFields(task: any) {
  const startAt = getTaskStartAt(task) ?? toDateTimeLocalValue(new Date());
  return {
    ...task,
    dueAt: startAt,
    date: format(parseISO(startAt), 'yyyy-MM-dd'),
  };
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

export function expandLeadEntries(leads: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  return leads.flatMap((lead) => {
    if (!lead?.nextActionAt || lead?.status === 'won' || lead?.status === 'lost') return [] as ScheduleEntry[];

    const startsAt = lead.nextActionAt.includes('T') ? lead.nextActionAt : `${lead.nextActionAt}T09:00`;
    const start = parseISO(startsAt);
    if (isBefore(start, rangeStart) || isAfter(start, rangeEnd)) return [] as ScheduleEntry[];

    return [{
      id: lead.id,
      kind: 'lead' as const,
      title: lead.nextStep || `Lead: ${lead.name}`,
      startsAt,
      endsAt: null,
      sourceId: lead.id,
      link: `/leads/${lead.id}`,
      badgeLabel: 'Lead',
      leadId: lead.id,
      leadName: lead.name,
      raw: lead,
    }];
  });
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
  return [
    ...expandEventEntries(events, rangeStart, rangeEnd),
    ...expandTaskEntries(tasks, rangeStart, rangeEnd),
    ...expandLeadEntries(leads, rangeStart, rangeEnd),
  ].sort((a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime());
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
