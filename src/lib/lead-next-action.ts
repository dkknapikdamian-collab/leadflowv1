import { isAfter, parseISO } from 'date-fns';
import { normalizeCalendarEvent, normalizeCalendarTask } from './calendar-items';

type LinkedItem = Record<string, unknown>;

export type LeadNextAction = {
  id: string;
  kind: 'task' | 'event';
  title: string;
  when: string;
  status: string;
  caseId?: string | null;
  leadId?: string | null;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isOpenTaskStatus(status: string) {
  return status !== 'done' && status !== 'cancelled' && status !== 'canceled';
}

function isOpenEventStatus(status: string) {
  return status !== 'completed' && status !== 'cancelled' && status !== 'canceled';
}

function toTaskAction(item: LinkedItem): LeadNextAction | null {
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
    caseId: normalized.caseId || null,
    leadId: normalized.leadId || null,
  };
}

function toEventAction(item: LinkedItem): LeadNextAction | null {
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
    caseId: normalized.caseId || null,
    leadId: normalized.leadId || null,
  };
}

export function getLeadNextAction(tasks: LinkedItem[], events: LinkedItem[]) {
  const candidates = [
    ...tasks.map((item) => toTaskAction(item)),
    ...events.map((item) => toEventAction(item)),
  ].filter((item): item is LeadNextAction => Boolean(item));

  if (candidates.length === 0) return null;

  return candidates.sort((left, right) => {
    const leftDate = parseISO(left.when);
    const rightDate = parseISO(right.when);
    if (isAfter(leftDate, rightDate)) return 1;
    if (isAfter(rightDate, leftDate)) return -1;
    return left.kind.localeCompare(right.kind);
  })[0];
}
