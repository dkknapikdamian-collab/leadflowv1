import { addDays, addMonths, addWeeks, format, isBefore, parseISO } from 'date-fns';

export type RecurrenceRule = 'none' | 'daily' | 'every_2_days' | 'weekly' | 'monthly' | 'weekday';
export type RecurrenceEndType = 'never' | 'until_date' | 'count';
export type SnoozePreset = 'plus_1h' | 'tomorrow' | 'plus_2d' | 'next_week';

export function toIsoDate(value: Date) {
  return format(value, 'yyyy-MM-dd');
}

export function toIsoDateTimeLocal(value: Date) {
  return format(value, "yyyy-MM-dd'T'HH:mm");
}

export function applySnoozePreset(preset: SnoozePreset) {
  const now = new Date();
  if (preset === 'plus_1h') {
    return toIsoDateTimeLocal(new Date(now.getTime() + 60 * 60 * 1000));
  }
  if (preset === 'tomorrow') {
    const target = addDays(now, 1);
    target.setHours(9, 0, 0, 0);
    return toIsoDateTimeLocal(target);
  }
  if (preset === 'plus_2d') {
    const target = addDays(now, 2);
    target.setHours(9, 0, 0, 0);
    return toIsoDateTimeLocal(target);
  }

  const target = addWeeks(now, 1);
  target.setHours(9, 0, 0, 0);
  return toIsoDateTimeLocal(target);
}

export function nextRecurringDate(currentDate: string, recurrenceRule: RecurrenceRule) {
  const base = parseISO(currentDate);
  if (Number.isNaN(base.getTime()) || recurrenceRule === 'none') return null;

  if (recurrenceRule === 'daily') return toIsoDate(addDays(base, 1));
  if (recurrenceRule === 'every_2_days') return toIsoDate(addDays(base, 2));
  if (recurrenceRule === 'weekly') return toIsoDate(addWeeks(base, 1));
  if (recurrenceRule === 'monthly') return toIsoDate(addMonths(base, 1));

  let target = addDays(base, 1);
  while (target.getDay() === 0 || target.getDay() === 6) {
    target = addDays(target, 1);
  }
  return toIsoDate(target);
}

export function canScheduleNextRecurrence(
  endType: RecurrenceEndType | undefined,
  endAt: string | undefined,
  currentCount: number | undefined,
  maxCount: number | undefined
) {
  if (!endType || endType === 'never') return true;
  if (endType === 'count') {
    if (!maxCount) return false;
    return (currentCount || 0) < maxCount;
  }
  if (!endAt) return false;
  const boundary = parseISO(endAt);
  if (Number.isNaN(boundary.getTime())) return false;
  return isBefore(new Date(), addDays(boundary, 1));
}
