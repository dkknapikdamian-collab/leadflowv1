export type ActivityTruthSource = 'activity' | 'task' | 'event' | 'payment' | 'field';

export type ActivityTruth = {
  entityType: 'lead' | 'case' | 'client';
  entityId: string;
  lastContactAt: string | null;
  lastContactSource: 'activity' | 'task' | 'event' | 'field' | null;
  lastActivityAt: string | null;
  lastActivitySource: ActivityTruthSource | null;
  contactSilentDays: number | null;
  activitySilentDays: number | null;
  lastContactIsFallback: boolean;
  lastActivityIsFallback: boolean;
};

export type BuildActivityTruthInput = {
  entityType: 'lead' | 'case' | 'client';
  entityId: string;
  record?: unknown;
  activities?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  payments?: unknown[];
  now?: Date;
};

const DAY_MS = 86_400_000;
const STAGE223_ACTIVITY_TRUTH = 'distinguish real contact silence from generic activity silence; updatedAt is fallback only';
const STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER = 'updatedAt fallback is used only when no real activity/contact/payment candidate exists';
void STAGE223_ACTIVITY_TRUTH;
void STAGE223_ACTIVITY_TRUTH_FALLBACK_ORDER;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value instanceof Date) return value.toISOString();
  }
  return '';
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function daysSince(iso: string | null, now: Date) {
  const parsed = parseDate(iso || '');
  if (!parsed) return null;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / DAY_MS));
}

function isContactRecord(record: Record<string, unknown>) {
  const haystack = [
    readString(record, ['type', 'kind', 'category', 'channel', 'action', 'eventType', 'event_type', 'taskType', 'task_type']),
    readString(record, ['title', 'name', 'description', 'note', 'body', 'content']),
  ].join(' ').toLowerCase();

  return [
    'kontakt',
    'contact',
    'telefon',
    'phone',
    'call',
    'email',
    'e-mail',
    'mail',
    'wiadomość',
    'wiadomosc',
    'message',
    'sms',
    'spotkanie',
    'meeting',
    'rozmowa',
  ].some((token) => haystack.includes(token));
}

function candidateDate(record: Record<string, unknown>, keys: string[]) {
  return readString(record, keys);
}

function pushCandidate(
  list: { at: string; source: ActivityTruthSource; isFallback: boolean }[],
  at: string,
  source: ActivityTruthSource,
  isFallback = false,
) {
  const parsed = parseDate(at);
  if (!parsed) return;
  list.push({ at: parsed.toISOString(), source, isFallback });
}

function latestCandidate(list: { at: string; source: ActivityTruthSource; isFallback: boolean }[]) {
  return list
    .slice()
    .sort((left, right) => (parseDate(right.at)?.getTime() || 0) - (parseDate(left.at)?.getTime() || 0))[0] || null;
}

function array(value: unknown[] | undefined) {
  return Array.isArray(value) ? value : [];
}

export function buildActivityTruth(input: BuildActivityTruthInput): ActivityTruth {
  const now = input.now || new Date();
  const record = asRecord(input.record);
  const contactCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
  const realActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];
  const fallbackActivityCandidates: { at: string; source: ActivityTruthSource; isFallback: boolean }[] = [];

  const explicitContactAt = candidateDate(record, ['lastContactAt', 'last_contact_at', 'contactedAt', 'contacted_at']);
  pushCandidate(contactCandidates, explicitContactAt, 'field', false);
  pushCandidate(realActivityCandidates, explicitContactAt, 'field', false);

  const explicitActivityAt = candidateDate(record, ['lastActivityAt', 'last_activity_at']);
  pushCandidate(realActivityCandidates, explicitActivityAt, 'field', false);

  for (const activity of array(input.activities)) {
    const row = asRecord(activity);
    const at = candidateDate(row, ['createdAt', 'created_at', 'dateAt', 'date_at', 'happenedAt', 'happened_at', 'updatedAt', 'updated_at']);
    pushCandidate(realActivityCandidates, at, 'activity', false);
    if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'activity', false);
  }

  for (const task of array(input.tasks)) {
    const row = asRecord(task);
    const at = candidateDate(row, ['completedAt', 'completed_at', 'scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'dateAt', 'date_at', 'createdAt', 'created_at']);
    pushCandidate(realActivityCandidates, at, 'task', false);
    if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'task', false);
  }

  for (const event of array(input.events)) {
    const row = asRecord(event);
    const at = candidateDate(row, ['startAt', 'start_at', 'scheduledAt', 'scheduled_at', 'dateAt', 'date_at', 'date', 'createdAt', 'created_at']);
    pushCandidate(realActivityCandidates, at, 'event', false);
    if (isContactRecord(row)) pushCandidate(contactCandidates, at, 'event', false);
  }

  for (const payment of array(input.payments)) {
    const row = asRecord(payment);
    const at = candidateDate(row, ['paidAt', 'paid_at', 'createdAt', 'created_at', 'updatedAt', 'updated_at', 'dateAt', 'date_at']);
    pushCandidate(realActivityCandidates, at, 'payment', false);
  }

  // Fallback activity only. This must not override real activity/contact/payment candidates.
  pushCandidate(fallbackActivityCandidates, candidateDate(record, ['updatedAt', 'updated_at', 'modifiedAt', 'modified_at']), 'field', true);
  pushCandidate(fallbackActivityCandidates, candidateDate(record, ['createdAt', 'created_at']), 'field', true);

  const lastContact = latestCandidate(contactCandidates);
  const lastRealActivity = latestCandidate(realActivityCandidates);
  const lastFallbackActivity = latestCandidate(fallbackActivityCandidates);
  const lastActivity = lastRealActivity || lastFallbackActivity;

  return {
    entityType: input.entityType,
    entityId: input.entityId,
    lastContactAt: lastContact?.at || null,
    lastContactSource: (lastContact?.source as ActivityTruth['lastContactSource']) || null,
    lastActivityAt: lastActivity?.at || null,
    lastActivitySource: lastActivity?.source || null,
    contactSilentDays: daysSince(lastContact?.at || null, now),
    activitySilentDays: daysSince(lastActivity?.at || null, now),
    lastContactIsFallback: false,
    lastActivityIsFallback: Boolean(lastActivity?.isFallback),
  };
}
