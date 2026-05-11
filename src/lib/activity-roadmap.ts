export type ActivityRoadmapEntityType = 'lead' | 'client' | 'case';

export type ActivityRoadmapItemKind =
  | 'note'
  | 'task_created'
  | 'task_done'
  | 'event_created'
  | 'event_done'
  | 'payment_added'
  | 'payment_removed'
  | 'payment_updated'
  | 'case_created'
  | 'case_updated'
  | 'case_deleted'
  | 'missing_item_added'
  | 'missing_item_done'
  | 'status_changed'
  | 'unknown';

export type ActivityRoadmapItem = {
  id: string;
  entityType: ActivityRoadmapEntityType;
  entityId: string;
  kind: ActivityRoadmapItemKind;
  title: string;
  description?: string;
  amount?: number | null;
  currency?: string | null;
  happenedAt: string;
  sourceTable?: string;
  sourceId?: string;
  editable?: boolean;
  deletable?: boolean;
  raw?: unknown;
};

type RoadmapInputRow = Record<string, unknown>;

const CLOSED_STATUSES = new Set(['done', 'completed', 'cancelled', 'canceled', 'closed', 'archived']);
const PAYMENT_DELETE_TYPES = new Set(['payment_removed', 'payment_deleted', 'payment_delete']);
const PAYMENT_UPDATE_TYPES = new Set(['payment_updated', 'payment_update', 'payment_changed', 'payment_status_changed']);
const PAYMENT_ADD_TYPES = new Set(['payment_added', 'payment_created', 'payment_add', 'payment_create']);

function isRecord(value: unknown): value is RoadmapInputRow {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function asRecord(value: unknown): RoadmapInputRow {
  return isRecord(value) ? value : {};
}

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function asNullableText(value: unknown) {
  const valueText = asText(value);
  return valueText || null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickText(row: RoadmapInputRow, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return fallback;
}

function pickPayload(row: RoadmapInputRow) {
  const raw = row.payload || row.data;
  if (isRecord(raw)) return raw;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return isRecord(parsed) ? parsed : {};
    } catch {
      return { raw };
    }
  }
  return {};
}

function pickIso(row: RoadmapInputRow, keys: string[], fallback?: string | null) {
  for (const key of keys) {
    const raw = row[key];
    if (!raw) continue;
    if (raw instanceof Date && Number.isFinite(raw.getTime())) return raw.toISOString();
    if (typeof (raw as any)?.toDate === 'function') {
      const date = (raw as any).toDate();
      if (date instanceof Date && Number.isFinite(date.getTime())) return date.toISOString();
    }
    const parsed = new Date(String(raw));
    if (Number.isFinite(parsed.getTime())) return parsed.toISOString();
  }
  if (fallback) {
    const parsed = new Date(fallback);
    if (Number.isFinite(parsed.getTime())) return parsed.toISOString();
  }
  return new Date(0).toISOString();
}

function normalizeStatus(value: unknown) {
  return asText(value).toLowerCase();
}

function isClosedStatus(value: unknown) {
  return CLOSED_STATUSES.has(normalizeStatus(value));
}

function getCaseId(caseRecord: unknown) {
  const row = asRecord(caseRecord);
  return pickText(row, ['id', 'caseId', 'case_id']);
}

function getRowCaseId(input: unknown) {
  const row = asRecord(input);
  const payload = pickPayload(row);
  return pickText(row, ['caseId', 'case_id']) || pickText(payload, ['caseId', 'case_id']);
}

function belongsToExactCase(input: unknown, caseId: string) {
  return Boolean(caseId && getRowCaseId(input) === caseId);
}

function getSourceId(row: RoadmapInputRow) {
  return pickText(row, ['id', 'sourceId', 'source_id', 'activityId', 'activity_id']) || cryptoSafeId('source');
}

function cryptoSafeId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return `${prefix}:${crypto.randomUUID()}`;
  return `${prefix}:${Math.random().toString(36).slice(2)}:${Date.now()}`;
}

function formatMoneyDescription(amount: number | null, currency: string | null) {
  if (amount == null) return '';
  return `${amount.toLocaleString('pl-PL')} ${(currency || 'PLN').toUpperCase()}`;
}

function activityKindFromEventType(eventType: string): ActivityRoadmapItemKind {
  const normalized = eventType.trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (PAYMENT_DELETE_TYPES.has(normalized)) return 'payment_removed';
  if (PAYMENT_UPDATE_TYPES.has(normalized)) return 'payment_updated';
  if (PAYMENT_ADD_TYPES.has(normalized)) return 'payment_added';
  if (normalized.includes('payment') && (normalized.includes('remove') || normalized.includes('delete'))) return 'payment_removed';
  if (normalized.includes('payment') && (normalized.includes('update') || normalized.includes('change'))) return 'payment_updated';
  if (normalized.includes('payment')) return 'payment_added';
  if (normalized.includes('note')) return 'note';
  if (normalized === 'operator_note') return 'note';
  if (normalized.includes('task') && (normalized.includes('done') || normalized.includes('completed') || normalized.includes('status'))) return 'task_done';
  if (normalized.includes('task')) return 'task_created';
  if ((normalized.includes('event') || normalized.includes('calendar')) && (normalized.includes('done') || normalized.includes('completed') || normalized.includes('status'))) return 'event_done';
  if (normalized.includes('event') || normalized.includes('calendar')) return 'event_created';
  if (normalized.includes('item') || normalized.includes('missing') || normalized.includes('file') || normalized.includes('decision')) {
    if (normalized.includes('accepted') || normalized.includes('done') || normalized.includes('completed')) return 'missing_item_done';
    return 'missing_item_added';
  }
  if (normalized.includes('status') || normalized.includes('lifecycle')) return 'status_changed';
  if (normalized.includes('case') && normalized.includes('delete')) return 'case_deleted';
  if (normalized.includes('case') && (normalized.includes('update') || normalized.includes('change'))) return 'case_updated';
  if (normalized.includes('case') || normalized.includes('start')) return 'case_created';
  return 'unknown';
}

function titleForKind(kind: ActivityRoadmapItemKind, row: RoadmapInputRow, fallbackTitle = '') {
  const payload = pickPayload(row);
  const title = fallbackTitle
    || pickText(payload, ['title', 'itemTitle', 'name', 'label', 'note'])
    || pickText(row, ['title', 'name', 'note']);

  if (kind === 'note') return title ? `Notatka: ${title}` : 'Dodano notatkę';
  if (kind === 'task_created') return title ? `Dodano zadanie: ${title}` : 'Dodano zadanie';
  if (kind === 'task_done') return title ? `Zadanie wykonane: ${title}` : 'Zadanie wykonane';
  if (kind === 'event_created') return title ? `Dodano wydarzenie: ${title}` : 'Dodano wydarzenie';
  if (kind === 'event_done') return title ? `Wydarzenie wykonane: ${title}` : 'Wydarzenie wykonane';
  if (kind === 'payment_added') return title ? `Dodano płatność: ${title}` : 'Dodano płatność';
  if (kind === 'payment_removed') return title ? `Usunięto płatność: ${title}` : 'Usunięto płatność';
  if (kind === 'payment_updated') return title ? `Zmieniono płatność: ${title}` : 'Zmieniono płatność';
  if (kind === 'case_created') return title ? `Utworzono sprawę: ${title}` : 'Utworzono sprawę';
  if (kind === 'case_updated') return title ? `Zmieniono sprawę: ${title}` : 'Zmieniono sprawę';
  if (kind === 'case_deleted') return title ? `Usunięto sprawę: ${title}` : 'Usunięto sprawę';
  if (kind === 'missing_item_added') return title ? `Dodano brak: ${title}` : 'Dodano brak';
  if (kind === 'missing_item_done') return title ? `Uzupełniono brak: ${title}` : 'Uzupełniono brak';
  if (kind === 'status_changed') return title ? `Zmieniono status: ${title}` : 'Zmieniono status';
  return title || 'Zapis w sprawie';
}

function descriptionFromActivity(row: RoadmapInputRow) {
  const payload = pickPayload(row);
  return pickText(payload, ['description', 'note', 'reason', 'status', 'nextStatus', 'raw'])
    || pickText(row, ['description', 'note']);
}

function pushItem(target: ActivityRoadmapItem[], item: ActivityRoadmapItem | null) {
  if (!item || !item.entityId || !item.happenedAt) return;
  target.push(item);
}

function buildTaskItem(task: unknown, caseId: string): ActivityRoadmapItem | null {
  if (!belongsToExactCase(task, caseId)) return null;
  const row = asRecord(task);
  const status = normalizeStatus(row.status);
  const kind: ActivityRoadmapItemKind = isClosedStatus(status) ? 'task_done' : 'task_created';
  const sourceId = getSourceId(row);
  return {
    id: `task:${sourceId}:${kind}`,
    entityType: 'case',
    entityId: caseId,
    kind,
    title: titleForKind(kind, row, pickText(row, ['title', 'name'], 'Zadanie')),
    description: status ? `Status: ${status}` : undefined,
    happenedAt: pickIso(row, ['completedAt', 'completed_at', 'updatedAt', 'updated_at', 'scheduledAt', 'scheduled_at', 'date', 'createdAt', 'created_at']),
    sourceTable: 'work_items',
    sourceId,
    raw: task,
  };
}

function buildEventItem(event: unknown, caseId: string): ActivityRoadmapItem | null {
  if (!belongsToExactCase(event, caseId)) return null;
  const row = asRecord(event);
  const status = normalizeStatus(row.status);
  const kind: ActivityRoadmapItemKind = isClosedStatus(status) ? 'event_done' : 'event_created';
  const sourceId = getSourceId(row);
  return {
    id: `event:${sourceId}:${kind}`,
    entityType: 'case',
    entityId: caseId,
    kind,
    title: titleForKind(kind, row, pickText(row, ['title', 'name'], 'Wydarzenie')),
    description: status ? `Status: ${status}` : undefined,
    happenedAt: pickIso(row, ['completedAt', 'completed_at', 'updatedAt', 'updated_at', 'startAt', 'start_at', 'scheduledAt', 'scheduled_at', 'createdAt', 'created_at']),
    sourceTable: 'work_items',
    sourceId,
    raw: event,
  };
}

function buildPaymentItem(payment: unknown, caseId: string): ActivityRoadmapItem | null {
  if (!belongsToExactCase(payment, caseId)) return null;
  const row = asRecord(payment);
  const amount = asNumber(row.amount ?? row.value ?? row.paidAmount ?? row.paid_amount);
  const currency = asNullableText(row.currency) || 'PLN';
  const sourceId = getSourceId(row);
  const description = [
    formatMoneyDescription(amount, currency),
    pickText(row, ['status']) ? `Status: ${pickText(row, ['status'])}` : '',
    pickText(row, ['note']),
  ].filter(Boolean).join(' · ');
  return {
    id: `payment:${sourceId}:payment_added`,
    entityType: 'case',
    entityId: caseId,
    kind: 'payment_added',
    title: amount == null ? 'Dodano płatność' : `Dodano płatność: ${formatMoneyDescription(amount, currency)}`,
    description: description || undefined,
    amount,
    currency,
    happenedAt: pickIso(row, ['paidAt', 'paid_at', 'updatedAt', 'updated_at', 'createdAt', 'created_at', 'dueAt', 'due_at']),
    sourceTable: 'payments',
    sourceId,
    editable: Boolean(row.editable || row.canEdit),
    deletable: Boolean(row.deletable || row.canDelete),
    raw: payment,
  };
}

function buildActivityItem(activity: unknown, caseId: string): ActivityRoadmapItem | null {
  if (!belongsToExactCase(activity, caseId)) return null;
  const row = asRecord(activity);
  const eventType = pickText(row, ['eventType', 'event_type', 'type']);
  if (eventType === 'note_deleted') return null;
  const kind = activityKindFromEventType(eventType);
  const sourceId = getSourceId(row);
  const payload = pickPayload(row);
  const amount = asNumber(payload.amount ?? payload.value ?? row.amount ?? row.value);
  const currency = asNullableText(payload.currency) || asNullableText(row.currency);
  return {
    id: `activity:${sourceId}:${kind}`,
    entityType: 'case',
    entityId: caseId,
    kind,
    title: titleForKind(kind, row),
    description: descriptionFromActivity(row) || undefined,
    amount,
    currency,
    happenedAt: pickIso(row, ['happenedAt', 'happened_at', 'createdAt', 'created_at', 'updatedAt', 'updated_at']),
    sourceTable: 'activities',
    sourceId,
    editable: kind === 'note',
    deletable: kind === 'note',
    raw: activity,
  };
}

function buildCaseLifecycleSeed(caseRecord: unknown, caseId: string): ActivityRoadmapItem | null {
  if (!caseId) return null;
  const row = asRecord(caseRecord);
  const title = pickText(row, ['title', 'name', 'clientName', 'client_name'], 'Sprawa');
  return {
    id: `case:${caseId}:case_created`,
    entityType: 'case',
    entityId: caseId,
    kind: 'case_created',
    title: `Utworzono sprawę: ${title}`,
    description: pickText(row, ['status']) ? `Status: ${pickText(row, ['status'])}` : undefined,
    happenedAt: pickIso(row, ['startedAt', 'started_at', 'serviceStartedAt', 'service_started_at', 'createdAt', 'created_at', 'updatedAt', 'updated_at']),
    sourceTable: 'cases',
    sourceId: caseId,
    raw: caseRecord,
  };
}

function dedupeRoadmap(items: ActivityRoadmapItem[]) {
  const map = new Map<string, ActivityRoadmapItem>();
  for (const item of items) {
    const key = [item.sourceTable || 'unknown', item.sourceId || item.id, item.kind].join('::');
    const current = map.get(key);
    if (!current) {
      map.set(key, item);
      continue;
    }
    const currentTime = new Date(current.happenedAt).getTime() || 0;
    const nextTime = new Date(item.happenedAt).getTime() || 0;
    if (nextTime >= currentTime) map.set(key, item);
  }
  return Array.from(map.values());
}

export function buildCaseActivityRoadmap(input: {
  caseRecord: unknown;
  notes: unknown[];
  tasks: unknown[];
  events: unknown[];
  payments: unknown[];
  activities: unknown[];
}): ActivityRoadmapItem[] {
  const caseId = getCaseId(input.caseRecord);
  if (!caseId) return [];

  const items: ActivityRoadmapItem[] = [];
  pushItem(items, buildCaseLifecycleSeed(input.caseRecord, caseId));

  for (const task of Array.isArray(input.tasks) ? input.tasks : []) pushItem(items, buildTaskItem(task, caseId));
  for (const event of Array.isArray(input.events) ? input.events : []) pushItem(items, buildEventItem(event, caseId));
  for (const payment of Array.isArray(input.payments) ? input.payments : []) pushItem(items, buildPaymentItem(payment, caseId));

  const activitySource = [
    ...(Array.isArray(input.activities) ? input.activities : []),
    ...(Array.isArray(input.notes) ? input.notes : []),
  ];
  for (const activity of activitySource) pushItem(items, buildActivityItem(activity, caseId));

  return dedupeRoadmap(items).sort((first, second) => {
    const firstTime = new Date(first.happenedAt).getTime() || 0;
    const secondTime = new Date(second.happenedAt).getTime() || 0;
    return secondTime - firstTime;
  });
}

export function getRoadmapRawPayload(item: ActivityRoadmapItem): Record<string, unknown> {
  const raw = item.raw;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const payload = (raw as Record<string, unknown>).payload || (raw as Record<string, unknown>).data;
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) return payload as Record<string, unknown>;
    if (typeof payload === 'string' && payload.trim()) {
      try {
        const parsed = JSON.parse(payload);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
      } catch {
        return { raw: payload };
      }
    }
  }
  return {};
}

function readRoadmapText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function stripRoadmapTitlePrefix(value: string) {
  return value
    .replace(/^Notatka:\s*/i, '')
    .replace(/^Dodano notatkę:?\s*/i, '')
    .replace(/^Dodano zadanie:?\s*/i, '')
    .replace(/^Wykonano zadanie:?\s*/i, '')
    .replace(/^Zadanie wykonane:?\s*/i, '')
    .replace(/^Dodano wydarzenie:?\s*/i, '')
    .replace(/^Zakończono wydarzenie:?\s*/i, '')
    .replace(/^Wydarzenie wykonane:?\s*/i, '')
    .replace(/^Dodano brak:?\s*/i, '')
    .replace(/^Uzupełniono brak:?\s*/i, '')
    .replace(/^Zmieniono status:?\s*/i, '')
    .trim();
}

export function getRoadmapItemNoteText(item: ActivityRoadmapItem): string {
  const payload = getRoadmapRawPayload(item);
  return readRoadmapText(payload.note)
    || readRoadmapText(payload.description)
    || readRoadmapText(payload.title)
    || readRoadmapText((item.raw as Record<string, unknown> | undefined)?.note)
    || readRoadmapText(item.description)
    || stripRoadmapTitlePrefix(readRoadmapText(item.title));
}

function getRoadmapItemSubject(item: ActivityRoadmapItem): string {
  const payload = getRoadmapRawPayload(item);
  return readRoadmapText(payload.title)
    || readRoadmapText(payload.itemTitle)
    || readRoadmapText(payload.name)
    || readRoadmapText(payload.label)
    || stripRoadmapTitlePrefix(readRoadmapText(item.title))
    || readRoadmapText(item.description);
}

function getRoadmapItemAmount(item: ActivityRoadmapItem): number | null {
  if (typeof item.amount === 'number' && Number.isFinite(item.amount)) return item.amount;
  const payload = getRoadmapRawPayload(item);
  const raw = payload.amount ?? payload.value ?? (item.raw as Record<string, unknown> | undefined)?.amount ?? (item.raw as Record<string, unknown> | undefined)?.value;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim()) {
    const parsed = Number(raw.replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getRoadmapItemCurrency(item: ActivityRoadmapItem): string {
  const payload = getRoadmapRawPayload(item);
  const value = readRoadmapText(item.currency) || readRoadmapText(payload.currency) || readRoadmapText((item.raw as Record<string, unknown> | undefined)?.currency) || 'PLN';
  return value.toUpperCase();
}

function formatRoadmapMoney(amount: number | null, currency: string) {
  if (amount == null) return '';
  return amount.toLocaleString('pl-PL') + ' ' + (currency || 'PLN');
}

function getStatusChangeLabel(item: ActivityRoadmapItem) {
  const payload = getRoadmapRawPayload(item);
  const from = readRoadmapText(payload.from) || readRoadmapText(payload.previousStatus) || readRoadmapText(payload.oldStatus);
  const to = readRoadmapText(payload.to) || readRoadmapText(payload.nextStatus) || readRoadmapText(payload.status);
  if (from && to) return from + ' → ' + to;
  return to || getRoadmapItemSubject(item);
}

export function formatRoadmapActivityTitle(item: ActivityRoadmapItem): string {
  const subject = getRoadmapItemSubject(item);
  const amount = getRoadmapItemAmount(item);
  const money = formatRoadmapMoney(amount, getRoadmapItemCurrency(item));

  switch (item.kind) {
    case 'note':
      return 'Dodano notatkę';
    case 'task_created':
      return subject ? 'Dodano zadanie: ' + subject : 'Dodano zadanie';
    case 'task_done':
      return subject ? 'Wykonano zadanie: ' + subject : 'Wykonano zadanie';
    case 'event_created':
      return subject ? 'Dodano wydarzenie: ' + subject : 'Dodano wydarzenie';
    case 'event_done':
      return subject ? 'Zakończono wydarzenie: ' + subject : 'Zakończono wydarzenie';
    case 'payment_added':
      return money ? 'Dodano wpłatę ' + money : 'Dodano wpłatę';
    case 'payment_removed':
      return money ? 'Usunięto wpłatę ' + money : 'Usunięto wpłatę';
    case 'payment_updated':
      return money ? 'Zmieniono wpłatę ' + money : 'Zmieniono wpłatę';
    case 'case_created':
      return 'Utworzono sprawę';
    case 'case_updated':
      return 'Zmieniono sprawę';
    case 'case_deleted':
      return 'Usunięto sprawę';
    case 'missing_item_added':
      return subject ? 'Dodano brak: ' + subject : 'Dodano brak';
    case 'missing_item_done':
      return subject ? 'Uzupełniono brak: ' + subject : 'Uzupełniono brak';
    case 'status_changed': {
      const status = getStatusChangeLabel(item);
      return status ? 'Zmieniono status: ' + status : 'Zmieniono status';
    }
    case 'unknown':
    default:
      return 'Zaktualizowano sprawę';
  }
}
