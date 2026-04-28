export type DataRecord = Record<string, unknown>;

export type NormalizedTaskRecord = DataRecord & {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  date: string;
  scheduledAt: string | null;
  dueAt: string | null;
  leadId?: string;
  caseId?: string;
  clientId?: string;
  reminderAt: string | null;
  recurrenceRule: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NormalizedEventRecord = DataRecord & {
  id: string;
  title: string;
  type: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  scheduledAt: string | null;
  leadId?: string;
  caseId?: string;
  clientId?: string;
  reminderAt: string | null;
  recurrenceRule: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NormalizedLeadRecord = DataRecord & {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  dealValue: number;
  nextActionAt: string | null;
  nextActionItemId?: string;
  linkedCaseId?: string;
  clientId?: string;
  workspaceId?: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NormalizedCaseRecord = DataRecord & {
  id: string;
  title: string;
  clientName: string;
  status: string;
  leadId?: string;
  clientId?: string;
  completenessPercent: number;
  portalReady: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

function pickText(row: DataRecord, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function pickOptionalText(row: DataRecord, keys: string[]) {
  const value = pickText(row, keys, '');
  return value || undefined;
}

function pickNumber(row: DataRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const normalized = value.replace(/\s/g, '').replace(/zł|pln/gi, '').replace(',', '.').replace(/[^0-9.-]/g, '');
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

export function toIsoDateTime(value: unknown) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T09:00:00` : raw;
  const parsed = new Date(normalized);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function toDateOnly(value: unknown) {
  const iso = toIsoDateTime(value);
  return iso ? iso.slice(0, 10) : '';
}

function normalizeStatus(value: unknown, fallback: string) {
  const status = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return status || fallback;
}

function normalizeRecurrence(value: unknown) {
  const recurrence = typeof value === 'string' ? value.trim() : '';
  return recurrence || 'none';
}

function normalizePriority(value: unknown) {
  const priority = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (['low', 'medium', 'high', 'urgent'].includes(priority)) return priority;
  if (priority === 'normal') return 'medium';
  return 'medium';
}

export function normalizeTaskContract(row: DataRecord): NormalizedTaskRecord {
  const scheduledAt =
    toIsoDateTime(row.scheduledAt) ||
    toIsoDateTime(row.scheduled_at) ||
    toIsoDateTime(row.dueAt) ||
    toIsoDateTime(row.due_at) ||
    toIsoDateTime(row.date) ||
    toIsoDateTime(row.startAt) ||
    toIsoDateTime(row.start_at) ||
    null;

  const createdAt = toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at);
  const updatedAt = toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at);

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    title: pickText(row, ['title', 'name', 'summary'], 'Zadanie'),
    type: pickText(row, ['type', 'taskType', 'task_type', 'recordType', 'record_type'], 'task'),
    status: normalizeStatus(row.status, 'todo'),
    priority: normalizePriority(row.priority),
    date: toDateOnly(scheduledAt) || toDateOnly(createdAt) || '',
    scheduledAt,
    dueAt: scheduledAt,
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    reminderAt: toIsoDateTime(row.reminderAt) || toIsoDateTime(row.reminder_at) || (typeof row.reminder === 'string' ? toIsoDateTime(row.reminder) : null),
    recurrenceRule: normalizeRecurrence(row.recurrenceRule || row.recurrence_rule || row.recurrence),
    createdAt,
    updatedAt,
  };
}

export function normalizeEventContract(row: DataRecord): NormalizedEventRecord {
  const startAt =
    toIsoDateTime(row.startAt) ||
    toIsoDateTime(row.start_at) ||
    toIsoDateTime(row.scheduledAt) ||
    toIsoDateTime(row.scheduled_at) ||
    toIsoDateTime(row.date) ||
    null;
  const endAt = toIsoDateTime(row.endAt) || toIsoDateTime(row.end_at) || null;
  const createdAt = toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at);
  const updatedAt = toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at);

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    title: pickText(row, ['title', 'name', 'summary'], 'Wydarzenie'),
    type: pickText(row, ['type', 'eventType', 'event_type', 'recordType', 'record_type'], 'event'),
    status: normalizeStatus(row.status, 'scheduled'),
    startAt,
    endAt,
    scheduledAt: startAt,
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    reminderAt: toIsoDateTime(row.reminderAt) || toIsoDateTime(row.reminder_at) || (typeof row.reminder === 'string' ? toIsoDateTime(row.reminder) : null),
    recurrenceRule: normalizeRecurrence(row.recurrenceRule || row.recurrence_rule || row.recurrence),
    createdAt,
    updatedAt,
  };
}

export function normalizeLeadContract(row: DataRecord): NormalizedLeadRecord {
  const createdAt = toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at);
  const updatedAt = toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at);

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickOptionalText(row, ['workspaceId', 'workspace_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    linkedCaseId: pickOptionalText(row, ['linkedCaseId', 'linked_case_id', 'caseId', 'case_id']),
    name: pickText(row, ['name', 'fullName', 'full_name', 'title', 'personName', 'person_name'], 'Lead'),
    company: pickText(row, ['company', 'companyName', 'company_name'], ''),
    email: pickText(row, ['email'], ''),
    phone: pickText(row, ['phone'], ''),
    source: pickText(row, ['source', 'sourceLabel', 'source_label', 'sourceType', 'source_type'], 'other'),
    status: normalizeStatus(row.status, 'new'),
    dealValue: pickNumber(row, ['dealValue', 'deal_value', 'value', 'amount', 'estimatedValue', 'estimated_value'], 0),
    nextActionAt: toIsoDateTime(row.nextActionAt) || toIsoDateTime(row.next_action_at) || toIsoDateTime(row.nextStepDueAt) || toIsoDateTime(row.next_step_due_at),
    nextActionItemId: pickOptionalText(row, ['nextActionItemId', 'next_action_item_id']),
    createdAt,
    updatedAt,
  };
}

export function normalizeCaseContract(row: DataRecord): NormalizedCaseRecord {
  const createdAt = toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at);
  const updatedAt = toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at);

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    title: pickText(row, ['title', 'name', 'clientName', 'client_name'], 'Sprawa'),
    clientName: pickText(row, ['clientName', 'client_name', 'name'], ''),
    status: normalizeStatus(row.status, 'new'),
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    completenessPercent: Math.max(0, Math.min(100, Math.round(pickNumber(row, ['completenessPercent', 'completeness_percent', 'completionPercent', 'completion_percent'], 0)))),
    portalReady: Boolean(row.portalReady ?? row.portal_ready ?? false),
    createdAt,
    updatedAt,
  };
}

export function normalizeTaskListContract(rows: unknown) {
  return Array.isArray(rows) ? rows.filter(Boolean).map((row) => normalizeTaskContract(row as DataRecord)) : [];
}

export function normalizeEventListContract(rows: unknown) {
  return Array.isArray(rows) ? rows.filter(Boolean).map((row) => normalizeEventContract(row as DataRecord)) : [];
}

export function normalizeLeadListContract(rows: unknown) {
  return Array.isArray(rows) ? rows.filter(Boolean).map((row) => normalizeLeadContract(row as DataRecord)) : [];
}

export function normalizeCaseListContract(rows: unknown) {
  return Array.isArray(rows) ? rows.filter(Boolean).map((row) => normalizeCaseContract(row as DataRecord)) : [];
}
