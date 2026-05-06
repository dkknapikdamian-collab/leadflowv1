import { normalizeEventV1, normalizeTaskV1 } from './work-items/normalize.ts';

type EntityId = string | null | undefined;
type AnyRow = Record<string, unknown>;

export type NearestActionStatus = 'overdue' | 'today' | 'upcoming' | 'none';

export type NearestPlannedAction = {
  kind: 'task' | 'event' | null;
  id: string | null;
  title: string | null;
  at: string | null;
  status: NearestActionStatus;
  relation: {
    leadId?: string;
    caseId?: string;
    clientId?: string;
  };
};

export type GetNearestPlannedActionInput = {
  leadId?: EntityId;
  caseId?: EntityId;
  clientId?: EntityId;
  tasks?: unknown[];
  events?: unknown[];
  now?: Date;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDate(value: unknown) {
  if (!value || typeof value !== 'string') return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isClosedStatus(status: unknown) {
  const normalized = String(status || '').toLowerCase().trim();
  return normalized === 'done' || normalized === 'completed' || normalized === 'cancelled' || normalized === 'canceled' || normalized === 'closed' || normalized === 'archived';
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function resolveStatus(at: Date, now: Date): NearestActionStatus {
  if (at.getTime() < now.getTime()) return 'overdue';
  if (sameDay(at, now)) return 'today';
  return 'upcoming';
}

function isLinked(row: { leadId?: string | null; caseId?: string | null; clientId?: string | null }, input: GetNearestPlannedActionInput) {
  const leadId = asText(input.leadId);
  const caseId = asText(input.caseId);
  const clientId = asText(input.clientId);

  if (leadId && asText(row.leadId) === leadId) return true;
  if (caseId && asText(row.caseId) === caseId) return true;
  if (clientId && asText(row.clientId) === clientId) return true;
  return false;
}

type Candidate = {
  kind: 'task' | 'event';
  id: string;
  title: string;
  at: string;
  atDate: Date;
  status: string;
  leadId?: string;
  caseId?: string;
  clientId?: string;
};

export function getNearestPlannedAction({
  leadId,
  caseId,
  clientId,
  tasks = [],
  events = [],
  now = new Date(),
}: GetNearestPlannedActionInput): NearestPlannedAction {
  const candidates: Candidate[] = [];

  for (const taskRow of tasks as AnyRow[]) {
    const task = normalizeTaskV1(taskRow);
    if (!task.id || isClosedStatus(task.status)) continue;
    if (!isLinked(task, { leadId, caseId, clientId })) continue;
    const at = asText(task.scheduledAt || task.reminderAt);
    const atDate = parseDate(at);
    if (!atDate) continue;
    candidates.push({
      kind: 'task',
      id: task.id,
      title: task.title || 'Task',
      at,
      atDate,
      status: task.status || 'todo',
      leadId: task.leadId || undefined,
      caseId: task.caseId || undefined,
      clientId: task.clientId || undefined,
    });
  }

  for (const eventRow of events as AnyRow[]) {
    const event = normalizeEventV1(eventRow);
    if (!event.id || isClosedStatus(event.status)) continue;
    if (!isLinked(event, { leadId, caseId, clientId })) continue;
    const at = asText(event.startAt || event.reminderAt || event.endAt);
    const atDate = parseDate(at);
    if (!atDate) continue;
    candidates.push({
      kind: 'event',
      id: event.id,
      title: event.title || 'Event',
      at,
      atDate,
      status: event.status || 'scheduled',
      leadId: event.leadId || undefined,
      caseId: event.caseId || undefined,
      clientId: event.clientId || undefined,
    });
  }

  if (candidates.length === 0) {
    return {
      kind: null,
      id: null,
      title: null,
      at: null,
      status: 'none',
      relation: {},
    };
  }

  candidates.sort((left, right) => left.atDate.getTime() - right.atDate.getTime());
  const nearest = candidates[0];

  return {
    kind: nearest.kind,
    id: nearest.id,
    title: nearest.title,
    at: nearest.at,
    status: resolveStatus(nearest.atDate, now),
    relation: {
      leadId: nearest.leadId,
      caseId: nearest.caseId,
      clientId: nearest.clientId,
    },
  };
}

export function getNearestPlannedActionReason(status: NearestActionStatus) {
  if (status === 'overdue') return 'Zaległe';
  if (status === 'today') return 'Do ruchu dziś';
  if (status === 'upcoming') return 'Najbliższe dni';
  return 'Bez zaplanowanej akcji';
}
