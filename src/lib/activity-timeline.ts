export type ActivityTimelineFormatters = {
  statusLabel?: (status?: string) => string;
  formatDateTime?: (value: unknown, fallback?: string) => string;
  formatMoney?: (value: unknown) => string;
};

export type ActivityTimelineItem = {
  id: string;
  title: string;
  description: string;
  happenedAt: string;
  sourceType: string;
  raw: unknown;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function pickText(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asText(record[key]);
    if (value) return value;
  }
  return '';
}

function pickNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const raw = record[key];
    const value = typeof raw === 'number' ? raw : Number(raw);
    if (Number.isFinite(value) && value !== 0) return value;
  }
  return null;
}

function eventType(activity: Record<string, unknown>) {
  return String(activity.eventType || activity.event_type || activity.type || activity.activityType || activity.activity_type || 'unknown').toLowerCase();
}

function payloadOf(activity: Record<string, unknown>) {
  const payload = asRecord(activity.payload || activity.metadata || activity.meta || {});
  return { ...activity, ...payload } as Record<string, unknown>;
}

function formatWhen(value: unknown, f: ActivityTimelineFormatters) {
  if (!value) return '';
  return f.formatDateTime ? f.formatDateTime(value, '') : String(value);
}

function statusText(status: unknown, f: ActivityTimelineFormatters) {
  const raw = asText(status);
  if (!raw) return '';
  return f.statusLabel ? f.statusLabel(raw) : raw;
}

export function getActivityTimelineTitle(activityInput: unknown, f: ActivityTimelineFormatters = {}) {
  void f;
  const activity = asRecord(activityInput);
  const payload = payloadOf(activity);
  const type = eventType(activity);

  if (type.includes('status')) return 'Zmieniono status';
  if (type.includes('note')) return 'Dodano notatkę';
  if (type.includes('payment') || type.includes('paid') || type.includes('billing')) return 'Wpłata';
  if (type.includes('task') && (type.includes('done') || type.includes('completed'))) return 'Zadanie wykonane';
  if (type.includes('task') && type.includes('deleted')) return 'Usunięto zadanie';
  if (type.includes('task')) return 'Zadanie';
  if (type.includes('event') && type.includes('deleted')) return 'Usunięto wydarzenie';
  if (type.includes('event')) return 'Wydarzenie';
  if (type.includes('case_created')) return 'Utworzono sprawę';
  if (type.includes('case_linked')) return 'Podpięto sprawę';
  if (type.includes('lead_moved') || type.includes('converted')) return 'Ten temat jest już w obsłudze';

  return pickText(payload, ['title', 'label', 'name']) || 'Aktywność';
}

export function getActivityTimelineDescription(activityInput: unknown, f: ActivityTimelineFormatters = {}) {
  const activity = asRecord(activityInput);
  const payload = payloadOf(activity);
  const type = eventType(activity);

  if (type.includes('status')) {
    const from = statusText(payload.fromStatus || payload.previousStatus || payload.oldStatus || payload.from || payload.before, f);
    const to = statusText(payload.toStatus || payload.newStatus || payload.status || payload.to || payload.after, f);
    if (from && to && from !== to) return from + ' → ' + to;
    if (to) return to;
  }

  if (type.includes('note')) {
    const note = pickText(payload, ['content', 'note', 'body', 'description', 'text', 'message']);
    if (note) return note;
  }

  if (type.includes('payment') || type.includes('paid') || type.includes('billing')) {
    const amount = pickNumber(payload, ['amount', 'paymentAmount', 'paidAmount', 'value', 'price']);
    const label = pickText(payload, ['title', 'note', 'description', 'status', 'paymentStatus']);
    const amountLabel = amount !== null ? (f.formatMoney ? f.formatMoney(amount) : String(amount) + ' PLN') : '';
    return [amountLabel, label].filter(Boolean).join(' · ') || 'Wpłata zapisana w historii.';
  }

  if (type.includes('task')) {
    const title = pickText(payload, ['title', 'taskTitle', 'name', 'content']);
    const when = formatWhen(payload.scheduledAt || payload.dueAt || payload.due_at || payload.reminderAt || payload.createdAt, f);
    const status = statusText(payload.status, f);
    const parts = [title, when, status].filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }

  if (type.includes('event')) {
    const title = pickText(payload, ['title', 'eventTitle', 'name', 'content']);
    const when = formatWhen(payload.startAt || payload.start_at || payload.scheduledAt || payload.date || payload.createdAt, f);
    const parts = [title, when].filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }

  const generic = pickText(payload, ['content', 'note', 'body', 'description', 'title', 'message', 'status']);
  if (generic) return generic;

  return 'Ruch zapisany w historii.';
}

export function normalizeActivityTimelineItem(activityInput: unknown, f: ActivityTimelineFormatters = {}): ActivityTimelineItem {
  const activity = asRecord(activityInput);
  return {
    id: String(activity.id || activity.activityId || activity.createdAt || Math.random()),
    title: getActivityTimelineTitle(activity, f),
    description: getActivityTimelineDescription(activity, f),
    happenedAt: String(activity.happenedAt || activity.createdAt || activity.updatedAt || ''),
    sourceType: eventType(activity),
    raw: activityInput,
  };
}

export const CLOSEFLOW_ACTIVITY_TIMELINE_SOURCE_OF_TRUTH_P1_2026_05_13 = true;
