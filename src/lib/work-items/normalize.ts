export type WorkItemType = 'task' | 'event' | 'follow_up' | 'meeting' | 'deadline' | 'note';

export type CalendarReminderRule =
  | { kind: 'same_day_at'; time: string }
  | { kind: 'day_before_at'; time: string }
  | { kind: 'two_days_before_at'; time: string }
  | { kind: 'week_before_at'; time: string }
  | { kind: 'custom'; amount: number; unit: 'days' | 'weeks'; time: string }
  | null;

export type DateBearingItem = {
  id: string;
  type: WorkItemType;
  title: string;
  status: string;
  dateAt: string | null;
  startAt: string | null;
  endAt: string | null;
  leadId: string | null;
  clientId: string | null;
  caseId: string | null;
  reminderRule: CalendarReminderRule;
};

export type WorkItem = DateBearingItem & {
  id: string;
  type: WorkItemType;
  title: string;
  status: string;
  scheduledAt: string | null;
  startAt: string | null;
  endAt: string | null;
  leadId: string | null;
  caseId: string | null;
  clientId: string | null;
  reminderAt: string | null;
  recurrenceRule: string | null;
  completedAt: string | null;
  leadName?: string | null;
  caseTitle?: string | null;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableText(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

function isKnownType(value: string): value is WorkItemType {
  return value === 'task' || value === 'event' || value === 'follow_up' || value === 'meeting' || value === 'deadline';
}

function normalizeType(row: Record<string, unknown>) {
  const rawType = asText(row.type).toLowerCase();
  if (isKnownType(rawType)) return rawType;

  if (asText(row.kind).toLowerCase() === 'note') return 'note';
  const recordType = asText(row.record_type || row.recordType).toLowerCase();
  if (recordType === 'event') return 'event';
  return 'task';
}

function normalizeStatus(row: Record<string, unknown>) {
  return asText(row.status) || 'todo';
}

function pickIso(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asNullableText(row[key]);
    if (value) return value;
  }
  return null;
}

function normalizeReminderRule(value: unknown): CalendarReminderRule {
  if (!value || typeof value !== 'object') return null;
  const rule = value as Record<string, unknown>;
  const kind = asText(rule.kind).toLowerCase();
  const time = asText(rule.time) || '09:00';
  if (kind === 'same_day_at') return { kind: 'same_day_at', time };
  if (kind === 'day_before_at') return { kind: 'day_before_at', time };
  if (kind === 'two_days_before_at') return { kind: 'two_days_before_at', time };
  if (kind === 'week_before_at') return { kind: 'week_before_at', time };
  if (kind === 'custom') {
    const amount = Number(rule.amount);
    const unit = asText(rule.unit).toLowerCase();
    if (Number.isFinite(amount) && amount > 0 && (unit === 'days' || unit === 'weeks')) {
      return { kind: 'custom', amount: Math.floor(amount), unit, time };
    }
  }
  return null;
}

export function normalizeWorkItem(input: unknown): WorkItem {
  const row = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;

  const scheduledAt = pickIso(row, ['scheduledAt', 'scheduled_at', 'dueAt', 'dateTime'])
    || (() => {
      const date = asText(row.date);
      if (!date) return null;
      const time = asText(row.time) || '09:00';
      return date.includes('T') ? date : `${date}T${time}`;
    })();

  const startAt = pickIso(row, ['startAt', 'start_at', 'startsAt']) || scheduledAt;
  const endAt = pickIso(row, ['endAt', 'end_at', 'endsAt']);
  const reminderAt = pickIso(row, ['reminderAt', 'reminder_at', 'reminder']);
  const reminderRule = normalizeReminderRule(row.reminderRule)
    || normalizeReminderRule(row.reminder)
    || (reminderAt ? { kind: 'same_day_at' as const, time: asText(row.time) || '09:00' } : null);
  const dateAt = startAt || scheduledAt || reminderAt;

  return {
    id: asText(row.id) || '',
    type: normalizeType(row),
    title: asText(row.title) || 'Bez tytulu',
    status: normalizeStatus(row),
    dateAt,
    scheduledAt,
    startAt,
    endAt,
    leadId: asNullableText(row.leadId) || asNullableText(row.lead_id),
    caseId: asNullableText(row.caseId) || asNullableText(row.case_id),
    clientId: asNullableText(row.clientId) || asNullableText(row.client_id),
    reminderAt,
    reminderRule,
    recurrenceRule: asNullableText(row.recurrenceRule) || asNullableText(row.recurrence),
    completedAt: pickIso(row, ['completedAt', 'completed_at', 'doneAt', 'done_at']),
    leadName: asNullableText(row.leadName) || asNullableText(row.lead_name),
    caseTitle: asNullableText(row.caseTitle) || asNullableText(row.case_title),
  };
}

export function normalizeDateBearingItem(input: unknown): DateBearingItem {
  return normalizeWorkItem(input);
}
