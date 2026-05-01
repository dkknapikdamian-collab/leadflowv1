import { isAfter, parseISO } from 'date-fns';
import { normalizeCalendarEvent, normalizeCalendarTask } from './calendar-items';

type LinkedItem = Record<string, unknown>;

export type PlannedActionRecordType = 'lead' | 'case' | 'client';

export type PlannedAction = {
  id: string;
  kind: 'task' | 'event';
  title: string;
  when: string;
  status: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};

export type GetNearestPlannedActionInput = {
  recordType: PlannedActionRecordType;
  recordId: string;
  tasks?: LinkedItem[];
  events?: LinkedItem[];
  leadId?: string | null;
  caseId?: string | null;
  clientId?: string | null;
  alreadyScoped?: boolean;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readLinkedId(item: LinkedItem, camelKey: string, snakeKey: string) {
  return asText(item[camelKey] || item[snakeKey]);
}

function isOpenTaskStatus(status: string) {
  return status !== 'done' && status !== 'completed' && status !== 'cancelled' && status !== 'canceled' && status !== 'archived';
}

function isOpenEventStatus(status: string) {
  return status !== 'done' && status !== 'completed' && status !== 'cancelled' && status !== 'canceled' && status !== 'archived';
}

function matchesRecord(item: LinkedItem, input: GetNearestPlannedActionInput) {
  if (input.alreadyScoped) return true;

  const recordId = asText(input.recordId);
  if (!recordId) return false;

  const itemLeadId = readLinkedId(item, 'leadId', 'lead_id');
  const itemCaseId = readLinkedId(item, 'caseId', 'case_id');
  const itemClientId = readLinkedId(item, 'clientId', 'client_id');

  if (input.recordType === 'lead') {
    const linkedCaseId = asText(input.caseId);
    return itemLeadId === recordId || Boolean(linkedCaseId && itemCaseId === linkedCaseId);
  }

  if (input.recordType === 'case') {
    const linkedLeadId = asText(input.leadId);
    return itemCaseId === recordId || Boolean(linkedLeadId && itemLeadId === linkedLeadId);
  }

  if (input.recordType === 'client') {
    return itemClientId === recordId;
  }

  return false;
}

function toTaskAction(item: LinkedItem, input: GetNearestPlannedActionInput): PlannedAction | null {
  if (!matchesRecord(item, input)) return null;

  const normalized = normalizeCalendarTask(item);
  if (!normalized) return null;

  const status = asText(normalized.status).toLowerCase() || 'todo';
  if (!isOpenTaskStatus(status)) return null;

  return {
    id: normalized.id,
    kind: 'task',
    title: normalized.title || 'Zadanie bez tytułu',
    when: normalized.scheduledAt || `${normalized.date}T09:00:00`,
    status,
    caseId: normalized.caseId || readLinkedId(item, 'caseId', 'case_id') || null,
    leadId: normalized.leadId || readLinkedId(item, 'leadId', 'lead_id') || null,
    clientId: readLinkedId(item, 'clientId', 'client_id') || null,
  };
}

function toEventAction(item: LinkedItem, input: GetNearestPlannedActionInput): PlannedAction | null {
  if (!matchesRecord(item, input)) return null;

  const normalized = normalizeCalendarEvent(item);
  if (!normalized) return null;

  const status = asText(normalized.status).toLowerCase() || 'scheduled';
  if (!isOpenEventStatus(status)) return null;

  return {
    id: normalized.id,
    kind: 'event',
    title: normalized.title || 'Wydarzenie bez tytułu',
    when: normalized.startAt,
    status,
    caseId: normalized.caseId || readLinkedId(item, 'caseId', 'case_id') || null,
    leadId: normalized.leadId || readLinkedId(item, 'leadId', 'lead_id') || null,
    clientId: readLinkedId(item, 'clientId', 'client_id') || null,
  };
}

function normalizeInput(
  recordTypeOrInput: PlannedActionRecordType | GetNearestPlannedActionInput,
  recordId?: string,
  tasks?: LinkedItem[],
  events?: LinkedItem[],
  extra?: Partial<GetNearestPlannedActionInput>,
): GetNearestPlannedActionInput {
  if (typeof recordTypeOrInput === 'object') {
    return {
      ...recordTypeOrInput,
      tasks: recordTypeOrInput.tasks || [],
      events: recordTypeOrInput.events || [],
    };
  }

  return {
    recordType: recordTypeOrInput,
    recordId: recordId || '',
    tasks: tasks || [],
    events: events || [],
    ...extra,
  };
}

export function getNearestPlannedAction(
  recordTypeOrInput: PlannedActionRecordType | GetNearestPlannedActionInput,
  recordId?: string,
  tasks?: LinkedItem[],
  events?: LinkedItem[],
  extra?: Partial<GetNearestPlannedActionInput>,
) {
  const input = normalizeInput(recordTypeOrInput, recordId, tasks, events, extra);

  const candidates = [
    ...(input.tasks || []).map((item) => toTaskAction(item, input)),
    ...(input.events || []).map((item) => toEventAction(item, input)),
  ].filter((item): item is PlannedAction => Boolean(item));

  if (candidates.length === 0) return null;

  return candidates.sort((left, right) => {
    const leftDate = parseISO(left.when);
    const rightDate = parseISO(right.when);

    if (isAfter(leftDate, rightDate)) return 1;
    if (isAfter(rightDate, leftDate)) return -1;

    return left.kind.localeCompare(right.kind);
  })[0];
}

export function formatNearestPlannedActionEmptyLabel() {
  return 'Brak zaplanowanych działań';
}

export function formatTodayWithoutPlannedActionLabel() {
  return 'Bez zaplanowanej akcji';
}
