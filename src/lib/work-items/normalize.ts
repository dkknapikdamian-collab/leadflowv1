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

export type CanonicalTask = {
  id: string;
  title: string;
  status: string;
  type: string;
  priority: string;
  scheduledAt: string | null;
  reminderAt: string | null;
  recurrenceRule: string | null;
  leadId: string | null;
  caseId: string | null;
  clientId: string | null;
  leadName?: string | null;
  workspaceId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CanonicalEvent = {
  id: string;
  title: string;
  status: string;
  type: string;
  startAt: string | null;
  endAt: string | null;
  reminderAt: string | null;
  recurrenceRule: string | null;
  leadId: string | null;
  caseId: string | null;
  clientId: string | null;
  leadName?: string | null;
  workspaceId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CanonicalLead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  dealValue: number;
  priority: string;
  isInService: boolean;
  linkedClientId: string | null;
  linkedCaseId: string | null;
  movedToServiceAt: string | null;
  workspaceId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CanonicalCase = {
  id: string;
  title: string;
  clientId: string | null;
  leadId: string | null;
  status: string;
  completenessPercent: number;
  portalReady: boolean;
  workspaceId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
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
  date?: string | null;
  priority?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
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

function asBool(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'tak') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'nie') return false;
  }
  return false;
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(',', '.'));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
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
    date: asNullableText(row.date) || (dateAt ? dateAt.slice(0, 10) : null),
    priority: asNullableText(row.priority),
    createdAt: pickIso(row, ['createdAt', 'created_at']),
    updatedAt: pickIso(row, ['updatedAt', 'updated_at']),
    leadName: asNullableText(row.leadName) || asNullableText(row.lead_name),
    caseTitle: asNullableText(row.caseTitle) || asNullableText(row.case_title),
  };
}

export function normalizeDateBearingItem(input: unknown): DateBearingItem {
  return normalizeWorkItem(input);
}

export function normalizeTaskV1(input: unknown): CanonicalTask {
  const row = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const item = normalizeWorkItem(row);
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    type: item.type,
    priority: asText(row.priority).toLowerCase() || 'medium',
    scheduledAt: item.scheduledAt,
    reminderAt: item.reminderAt,
    recurrenceRule: item.recurrenceRule,
    leadId: item.leadId,
    caseId: item.caseId,
    clientId: item.clientId,
    leadName: item.leadName,
    workspaceId: asNullableText(row.workspaceId) || asNullableText(row.workspace_id),
    createdAt: pickIso(row, ['createdAt', 'created_at']),
    updatedAt: pickIso(row, ['updatedAt', 'updated_at']),
  };
}

export function normalizeEventV1(input: unknown): CanonicalEvent {
  const row = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const item = normalizeWorkItem(row);
  return {
    id: item.id,
    title: item.title,
    status: item.status || 'scheduled',
    type: item.type === 'task' ? 'event' : item.type,
    startAt: item.startAt || item.scheduledAt,
    endAt: item.endAt,
    reminderAt: item.reminderAt,
    recurrenceRule: item.recurrenceRule,
    leadId: item.leadId,
    caseId: item.caseId,
    clientId: item.clientId,
    leadName: item.leadName,
    workspaceId: asNullableText(row.workspaceId) || asNullableText(row.workspace_id),
    createdAt: pickIso(row, ['createdAt', 'created_at']),
    updatedAt: pickIso(row, ['updatedAt', 'updated_at']),
  };
}

export function normalizeLeadV1(input: unknown): CanonicalLead {
  const row = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const status = asText(row.status).toLowerCase() || 'new';
  const linkedCaseId = asNullableText(row.linkedCaseId) || asNullableText(row.linked_case_id) || asNullableText(row.caseId) || asNullableText(row.case_id);
  const movedToServiceAt = pickIso(row, ['movedToServiceAt', 'moved_to_service_at', 'serviceStartedAt', 'service_started_at']);
  const isInService = status === 'moved_to_service' || Boolean(linkedCaseId) || Boolean(movedToServiceAt);
  return {
    id: asText(row.id) || '',
    name: asText(row.name) || asText(row.company) || 'Lead',
    company: asNullableText(row.company),
    email: asNullableText(row.email),
    phone: asNullableText(row.phone),
    source: asNullableText(row.source),
    status,
    dealValue: asNumber(row.dealValue ?? row.deal_value ?? row.value),
    priority: asText(row.priority).toLowerCase() || 'medium',
    isInService,
    linkedClientId: asNullableText(row.clientId) || asNullableText(row.client_id),
    linkedCaseId,
    movedToServiceAt,
    workspaceId: asNullableText(row.workspaceId) || asNullableText(row.workspace_id),
    createdAt: pickIso(row, ['createdAt', 'created_at']),
    updatedAt: pickIso(row, ['updatedAt', 'updated_at']),
  };
}

export function normalizeCaseV1(input: unknown): CanonicalCase {
  const row = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  return {
    id: asText(row.id) || '',
    title: asText(row.title) || 'Sprawa',
    clientId: asNullableText(row.clientId) || asNullableText(row.client_id),
    leadId: asNullableText(row.leadId) || asNullableText(row.lead_id),
    status: asText(row.status).toLowerCase() || 'new',
    completenessPercent: Math.max(0, Math.min(100, Math.round(asNumber(row.completenessPercent ?? row.completeness_percent)))),
    portalReady: asBool(row.portalReady ?? row.portal_ready),
    workspaceId: asNullableText(row.workspaceId) || asNullableText(row.workspace_id),
    createdAt: pickIso(row, ['createdAt', 'created_at']),
    updatedAt: pickIso(row, ['updatedAt', 'updated_at']),
  };
}

// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE
export const CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE = 'normalized work items can carry visual kind in UI layers';
