import {
  normalizeAiDraftStatus,
  normalizeBillingStatus,
  normalizeCaseStatus,
  normalizeEventStatus,
  normalizeLeadStatus,
  normalizePortalItemStatus,
  normalizeTaskStatus,
  type AccessState,
  type BillingStatus,
} from './domain-statuses';
export type { AccessState, BillingStatus };
export type DataRecord = Record<string, unknown>;

export type LeadDto = DataRecord & {
  id: string;
  workspaceId: string;
  clientId?: string;
  linkedCaseId?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  dealValue: number;
  priority: string;
  createdAt: string | null;
  updatedAt: string | null;
  movedToServiceAt: string | null;
  nextActionAt: string | null;
  nextActionItemId?: string;
  movedToService: boolean;
  leadVisibility: string;
  salesOutcome: string;
};

export type ClientDto = DataRecord & {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  tags: string[];
  sourcePrimary: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastActivityAt: string | null;
  archivedAt: string | null;
};

export type CaseDto = DataRecord & {
  id: string;
  workspaceId: string;
  clientId?: string;
  leadId?: string;
  title: string;
  clientName: string;
  status: string;
  completenessPercent: number;
  portalReady: boolean;
  startedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TaskDto = DataRecord & {
  id: string;
  workspaceId: string;
  title: string;
  status: string;
  type: string;
  priority: string;
  scheduledAt: string | null;
  date: string;
  leadId?: string;
  caseId?: string;
  clientId?: string;
  leadName?: string;
  reminderAt: string | null;
  recurrenceRule: string;
  createdAt: string | null;
  updatedAt: string | null;
  /** Legacy compatibility only. New code should use scheduledAt. */
  dueAt: string | null;
};

export type EventDto = DataRecord & {
  id: string;
  workspaceId: string;
  title: string;
  type: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  leadId?: string;
  caseId?: string;
  clientId?: string;
  leadName?: string;
  reminderAt: string | null;
  recurrenceRule: string;
  createdAt: string | null;
  updatedAt: string | null;
  /** Legacy compatibility only. New code should use startAt. */
  scheduledAt: string | null;
};

export type ActivityDto = DataRecord & {
  id: string;
  workspaceId: string;
  caseId?: string;
  leadId?: string;
  clientId?: string;
  ownerId?: string;
  actorId?: string;
  actorType: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NormalizedPaymentRecord = DataRecord & {
  id: string;
  workspaceId: string;
  clientId?: string;
  leadId?: string;
  caseId?: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AiDraftDto = DataRecord & {
  id: string;
  workspaceId: string;
  type: string;
  status: string;
  rawText: string;
  provider: string;
  source: string;
  parsedDraft: Record<string, unknown> | null;
  parsedData: Record<string, unknown> | null;
  linkedRecordId: string | null;
  linkedRecordType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  confirmedAt: string | null;
  convertedAt: string | null;
  cancelledAt: string | null;
};

export type ResponseTemplateDto = DataRecord & {
  id: string;
  workspaceId: string;
  name: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  variables: string[];
  archivedAt: string | null;
  channel: string;
  isArchived: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CaseItemDto = DataRecord & {
  id: string;
  workspaceId: string;
  caseId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  isRequired: boolean;
  order: number;
  response: string | null;
  fileUrl: string | null;
  fileName: string | null;
  dueDate: string | null;
  approvedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NormalizedLeadRecord = LeadDto;
export type NormalizedClientRecord = ClientDto;
export type NormalizedCaseRecord = CaseDto;
export type NormalizedTaskRecord = TaskDto;
export type NormalizedEventRecord = EventDto;
export type NormalizedActivityRecord = ActivityDto;
export type NormalizedAiDraftRecord = AiDraftDto;
export type NormalizedResponseTemplateRecord = ResponseTemplateDto;
export type NormalizedCaseItemRecord = CaseItemDto;

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

function pickNullableText(row: DataRecord, keys: string[]) {
  const value = pickText(row, keys, '');
  return value || null;
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

function pickBoolean(row: DataRecord, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string' && value.trim()) {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes', 'tak'].includes(normalized)) return true;
      if (['false', '0', 'no', 'nie'].includes(normalized)) return false;
    }
    if (typeof value === 'number' && Number.isFinite(value)) return value !== 0;
  }
  return fallback;
}

function pickStringArray(row: DataRecord, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) {
      return value.map((item) => pickText({ item }, ['item'])).filter(Boolean);
    }
    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function pickPayload(row: DataRecord, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
      } catch {
        return { raw: value };
      }
    }
  }
  return {};
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
  if (status === 'follow_up') return 'waiting_response';
  if (status === 'accepted_waiting_start') return 'accepted';
  if (status === 'active_service') return 'moved_to_service';
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

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 0)));
}

export function normalizeLeadContract(row: DataRecord): LeadDto {
  const status = normalizeLeadStatus(row.status);
  const linkedCaseId = pickOptionalText(row, ['linkedCaseId', 'linked_case_id', 'caseId', 'case_id']);
  const movedToServiceAt =
    toIsoDateTime(row.movedToServiceAt) ||
    toIsoDateTime(row.moved_to_service_at) ||
    toIsoDateTime(row.caseStartedAt) ||
    toIsoDateTime(row.case_started_at);
  const leadVisibility = pickText(row, ['leadVisibility', 'lead_visibility'], status === 'moved_to_service' || linkedCaseId ? 'archived' : 'active');
  const salesOutcome = pickText(row, ['salesOutcome', 'sales_outcome'], status === 'moved_to_service' ? 'moved_to_service' : status === 'won' || status === 'lost' ? status : 'open');

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    linkedCaseId,
    name: pickText(row, ['name', 'fullName', 'full_name', 'title', 'personName', 'person_name'], 'Lead'),
    company: pickText(row, ['company', 'companyName', 'company_name'], ''),
    email: pickText(row, ['email'], ''),
    phone: pickText(row, ['phone'], ''),
    source: pickText(row, ['source', 'sourceLabel', 'source_label', 'sourceType', 'source_type'], 'other'),
    status,
    dealValue: pickNumber(row, ['dealValue', 'deal_value', 'value', 'amount', 'estimatedValue', 'estimated_value'], 0),
    priority: normalizePriority(row.priority),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
    movedToServiceAt,
    nextActionAt: toIsoDateTime(row.nextActionAt) || toIsoDateTime(row.next_action_at) || toIsoDateTime(row.nextStepDueAt) || toIsoDateTime(row.next_step_due_at),
    nextActionItemId: pickOptionalText(row, ['nextActionItemId', 'next_action_item_id']),
    movedToService: status === 'moved_to_service' || leadVisibility === 'archived' || Boolean(linkedCaseId),
    leadVisibility,
    salesOutcome,
  };
}

export function normalizeClientContract(row: DataRecord): ClientDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    name: pickText(row, ['name', 'fullName', 'full_name', 'clientName', 'client_name'], 'Klient'),
    company: pickText(row, ['company', 'companyName', 'company_name'], ''),
    email: pickText(row, ['email'], ''),
    phone: pickText(row, ['phone'], ''),
    notes: pickText(row, ['notes', 'note'], ''),
    tags: pickStringArray(row, ['tags']),
    sourcePrimary: pickText(row, ['sourcePrimary', 'source_primary', 'source'], 'other'),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
    lastActivityAt: toIsoDateTime(row.lastActivityAt) || toIsoDateTime(row.last_activity_at),
    archivedAt: toIsoDateTime(row.archivedAt) || toIsoDateTime(row.archived_at),
  };
}

export function normalizeCaseContract(row: DataRecord): CaseDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    title: pickText(row, ['title', 'name', 'clientName', 'client_name'], 'Sprawa'),
    clientName: pickText(row, ['clientName', 'client_name', 'name'], ''),
    status: normalizeCaseStatus(row.status),
    completenessPercent: clampPercent(pickNumber(row, ['completenessPercent', 'completeness_percent', 'completionPercent', 'completion_percent'], 0)),
    portalReady: pickBoolean(row, ['portalReady', 'portal_ready'], false),
    startedAt: toIsoDateTime(row.startedAt) || toIsoDateTime(row.started_at) || toIsoDateTime(row.serviceStartedAt) || toIsoDateTime(row.service_started_at),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
  };
}

export function normalizeTaskContract(row: DataRecord): TaskDto {
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

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    title: pickText(row, ['title', 'name', 'summary'], 'Zadanie'),
    status: normalizeTaskStatus(row.status),
    type: pickText(row, ['type', 'taskType', 'task_type', 'recordType', 'record_type'], 'task'),
    priority: normalizePriority(row.priority),
    scheduledAt,
    date: toDateOnly(scheduledAt) || toDateOnly(createdAt) || '',
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    leadName: pickOptionalText(row, ['leadName', 'lead_name']),
    reminderAt: toIsoDateTime(row.reminderAt) || toIsoDateTime(row.reminder_at) || (typeof row.reminder === 'string' ? toIsoDateTime(row.reminder) : null),
    recurrenceRule: normalizeRecurrence(row.recurrenceRule || row.recurrence_rule || row.recurrence),
    createdAt,
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
    dueAt: scheduledAt,
  };
}

export function normalizeEventContract(row: DataRecord): EventDto {
  const startAt =
    toIsoDateTime(row.startAt) ||
    toIsoDateTime(row.start_at) ||
    toIsoDateTime(row.scheduledAt) ||
    toIsoDateTime(row.scheduled_at) ||
    toIsoDateTime(row.date) ||
    null;

  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    title: pickText(row, ['title', 'name', 'summary'], 'Wydarzenie'),
    type: pickText(row, ['type', 'eventType', 'event_type', 'recordType', 'record_type'], 'event'),
    status: normalizeEventStatus(row.status),
    startAt,
    endAt: toIsoDateTime(row.endAt) || toIsoDateTime(row.end_at),
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    leadName: pickOptionalText(row, ['leadName', 'lead_name']),
    reminderAt: toIsoDateTime(row.reminderAt) || toIsoDateTime(row.reminder_at) || (typeof row.reminder === 'string' ? toIsoDateTime(row.reminder) : null),
    recurrenceRule: normalizeRecurrence(row.recurrenceRule || row.recurrence_rule || row.recurrence),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
    scheduledAt: startAt,
  };
}

export function normalizeActivityContract(row: DataRecord): ActivityDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    ownerId: pickOptionalText(row, ['ownerId', 'owner_id']),
    actorId: pickOptionalText(row, ['actorId', 'actor_id']),
    actorType: pickText(row, ['actorType', 'actor_type'], 'operator'),
    eventType: pickText(row, ['eventType', 'event_type', 'type'], 'activity'),
    payload: pickPayload(row, ['payload', 'data']),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
  };
}

export function normalizePaymentContract(row: DataRecord): NormalizedPaymentRecord {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    clientId: pickOptionalText(row, ['clientId', 'client_id']),
    leadId: pickOptionalText(row, ['leadId', 'lead_id']),
    caseId: pickOptionalText(row, ['caseId', 'case_id']),
    type: pickText(row, ['type'], 'manual'),
    status: normalizeBillingStatus(row.status, 'not_started'),
    amount: pickNumber(row, ['amount', 'value', 'total'], 0),
    currency: pickText(row, ['currency'], 'PLN').toUpperCase(),
    paidAt: toIsoDateTime(row.paidAt) || toIsoDateTime(row.paid_at),
    dueAt: toIsoDateTime(row.dueAt) || toIsoDateTime(row.due_at),
    note: pickText(row, ['note', 'notes'], ''),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
  };
}

export function normalizeAiDraftContract(row: DataRecord): AiDraftDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    type: pickText(row, ['type', 'draftType', 'draft_type'], 'note'),
    status: normalizeAiDraftStatus(row.status),
    rawText: pickText(row, ['rawText', 'raw_text', 'text'], ''),
    provider: pickText(row, ['provider'], 'manual'),
    source: pickText(row, ['source'], 'app'),
    parsedDraft: Object.keys(pickPayload(row, ['parsedDraft', 'parsed_draft'])).length ? pickPayload(row, ['parsedDraft', 'parsed_draft']) : null,
    parsedData: Object.keys(pickPayload(row, ['parsedData', 'parsed_data'])).length ? pickPayload(row, ['parsedData', 'parsed_data']) : null,
    linkedRecordId: pickNullableText(row, ['linkedRecordId', 'linked_record_id']),
    linkedRecordType: pickNullableText(row, ['linkedRecordType', 'linked_record_type']),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
    confirmedAt: toIsoDateTime(row.confirmedAt) || toIsoDateTime(row.confirmed_at),
    convertedAt: toIsoDateTime(row.convertedAt) || toIsoDateTime(row.converted_at),
    cancelledAt: toIsoDateTime(row.cancelledAt) || toIsoDateTime(row.cancelled_at),
  };
}

export function normalizeResponseTemplateContract(row: DataRecord): ResponseTemplateDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    name: pickText(row, ['name', 'title'], 'Szablon'),
    title: pickText(row, ['title', 'name'], 'Szablon'),
    body: pickText(row, ['body', 'content', 'text'], ''),
    category: pickText(row, ['category', 'type'], 'general'),
    tags: pickStringArray(row, ['tags']),
    variables: pickStringArray(row, ['variables']),
    archivedAt: toIsoDateTime(row.archivedAt) || toIsoDateTime(row.archived_at),
    channel: pickText(row, ['channel'], 'email'),
    isArchived: pickBoolean(row, ['isArchived', 'is_archived', 'archived'], false),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
  };
}

export function normalizeCaseItemContract(row: DataRecord): CaseItemDto {
  return {
    ...row,
    id: pickText(row, ['id'], crypto.randomUUID()),
    workspaceId: pickText(row, ['workspaceId', 'workspace_id'], ''),
    caseId: pickText(row, ['caseId', 'case_id'], ''),
    title: pickText(row, ['title', 'name'], 'Element sprawy'),
    description: pickText(row, ['description', 'desc'], ''),
    type: pickText(row, ['type', 'itemType', 'item_type'], 'document'),
    status: normalizePortalItemStatus(row.status),
    isRequired: pickBoolean(row, ['isRequired', 'is_required', 'required'], false),
    order: Math.round(pickNumber(row, ['order', 'sort_order', 'position'], 0)),
    response: pickNullableText(row, ['response']),
    fileUrl: pickNullableText(row, ['fileUrl', 'file_url']),
    fileName: pickNullableText(row, ['fileName', 'file_name']),
    dueDate: toIsoDateTime(row.dueDate) || toIsoDateTime(row.due_date),
    approvedAt: toIsoDateTime(row.approvedAt) || toIsoDateTime(row.approved_at),
    createdAt: toIsoDateTime(row.createdAt) || toIsoDateTime(row.created_at),
    updatedAt: toIsoDateTime(row.updatedAt) || toIsoDateTime(row.updated_at),
  };
}

function normalizeList<T>(rows: unknown, normalizer: (row: DataRecord) => T) {
  return Array.isArray(rows) ? rows.filter(Boolean).map((row) => normalizer(row as DataRecord)) : [];
}

export function normalizeLeadListContract(rows: unknown) { return normalizeList(rows, normalizeLeadContract); }
export function normalizeClientListContract(rows: unknown) { return normalizeList(rows, normalizeClientContract); }
export function normalizeCaseListContract(rows: unknown) { return normalizeList(rows, normalizeCaseContract); }
export function normalizeTaskListContract(rows: unknown) { return normalizeList(rows, normalizeTaskContract); }
export function normalizeEventListContract(rows: unknown) { return normalizeList(rows, normalizeEventContract); }
export function normalizeActivityListContract(rows: unknown) { return normalizeList(rows, normalizeActivityContract); }
export function normalizePaymentListContract(rows: unknown) { return normalizeList(rows, normalizePaymentContract); }
export function normalizeAiDraftListContract(rows: unknown) { return normalizeList(rows, normalizeAiDraftContract); }
export function normalizeResponseTemplateListContract(rows: unknown) { return normalizeList(rows, normalizeResponseTemplateContract); }
export function normalizeCaseItemListContract(rows: unknown) { return normalizeList(rows, normalizeCaseItemContract); }
