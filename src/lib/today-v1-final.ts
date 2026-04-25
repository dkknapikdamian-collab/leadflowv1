export type TodayQuickSnoozeOption = {
  key: 'plus_2h' | 'tomorrow_9' | 'in_3_days_9';
  label: string;
  description: string;
};

export const TODAY_QUICK_SNOOZE_OPTIONS: TodayQuickSnoozeOption[] = [
  {
    key: 'plus_2h',
    label: 'Odłóż 2h',
    description: 'Przesuwa wpis o dwie godziny od teraz.',
  },
  {
    key: 'tomorrow_9',
    label: 'Jutro 9:00',
    description: 'Przenosi wpis na jutro rano.',
  },
  {
    key: 'in_3_days_9',
    label: 'Za 3 dni',
    description: 'Przenosi wpis na kolejny spokojniejszy termin.',
  },
];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function toTodayLocalDateTimeValue(value: Date) {
  return [
    value.getFullYear(),
    '-',
    pad(value.getMonth() + 1),
    '-',
    pad(value.getDate()),
    'T',
    pad(value.getHours()),
    ':',
    pad(value.getMinutes()),
  ].join('');
}

function atNine(value: Date) {
  const next = new Date(value);
  next.setHours(9, 0, 0, 0);
  return next;
}

export function resolveTodaySnoozeAt(optionKey: string, now = new Date()) {
  if (optionKey === 'plus_2h') {
    const next = new Date(now);
    next.setHours(next.getHours() + 2, 0, 0, 0);
    return toTodayLocalDateTimeValue(next);
  }

  if (optionKey === 'in_3_days_9') {
    const next = atNine(now);
    next.setDate(next.getDate() + 3);
    return toTodayLocalDateTimeValue(next);
  }

  const next = atNine(now);
  next.setDate(next.getDate() + 1);
  return toTodayLocalDateTimeValue(next);
}

function parseEntryMoment(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const normalized = value.includes('T') ? value : value + 'T09:00:00';
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEntryStatus(entry: any) {
  return String(entry?.raw?.status || entry?.status || '').toLowerCase();
}

function isEntryCompleted(entry: any) {
  const status = getEntryStatus(entry);
  return status === 'done' || status === 'completed';
}

function getEntryStartAt(entry: any) {
  return entry?.startsAt || entry?.raw?.scheduledAt || entry?.raw?.dueAt || entry?.raw?.startAt || entry?.raw?.date || null;
}

function hasRelation(entry: any) {
  return Boolean(entry?.raw?.leadId || entry?.raw?.caseId || entry?.leadId || entry?.caseId);
}

export function getTodayEntryPriorityReasons(entry: any, now = new Date()) {
  const reasons: string[] = [];
  const startAt = parseEntryMoment(getEntryStartAt(entry));
  const completed = isEntryCompleted(entry);

  if (completed) {
    reasons.push('Wykonane');
    return reasons;
  }

  if (startAt && startAt < now && !isSameLocalDay(startAt, now)) {
    reasons.push('Zaległe');
  }

  if (startAt && isSameLocalDay(startAt, now)) {
    reasons.push('Na dziś');
  }

  if (String(entry?.raw?.priority || '').toLowerCase() === 'high') {
    reasons.push('Wysoki priorytet');
  }

  if (!hasRelation(entry)) {
    reasons.push('Bez relacji');
  }

  if (!entry?.raw?.reminderAt) {
    reasons.push('Bez przypomnienia');
  }

  return reasons.slice(0, 4);
}

export function buildTodayV1Digest(entries: any[], now = new Date()) {
  const result = {
    total: entries.length,
    active: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0,
    withRelation: 0,
    withoutRelation: 0,
  };

  for (const entry of entries) {
    const completed = isEntryCompleted(entry);
    const startAt = parseEntryMoment(getEntryStartAt(entry));
    const related = hasRelation(entry);

    if (completed) result.completed += 1;
    else result.active += 1;

    if (!completed && startAt && startAt < now && !isSameLocalDay(startAt, now)) {
      result.overdue += 1;
    }

    if (!completed && startAt && isSameLocalDay(startAt, now)) {
      result.dueToday += 1;
    }

    if (related) result.withRelation += 1;
    else result.withoutRelation += 1;
  }

  return result;
}
