import { isAfter, parseISO } from 'date-fns';

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

function toItemDate(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;

  const iso = normalized.includes('T') ? normalized : `${normalized}T09:00:00`;
  const parsed = parseISO(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isOpenTaskStatus(status: string) {
  return status !== 'done';
}

function isOpenEventStatus(status: string) {
  return status !== 'completed' && status !== 'cancelled';
}

function toAction(item: LinkedItem, kind: 'task' | 'event'): LeadNextAction | null {
  const when = kind === 'task'
    ? asText(item.scheduledAt || item.dueAt || item.date)
    : asText(item.startAt);
  const title = asText(item.title) || (kind === 'task' ? 'Zadanie bez tytułu' : 'Wydarzenie bez tytułu');
  const status = asText(item.status || (kind === 'task' ? 'todo' : 'scheduled')).toLowerCase();
  const parsed = toItemDate(when);

  if (!parsed) return null;
  if (kind === 'task' && !isOpenTaskStatus(status)) return null;
  if (kind === 'event' && !isOpenEventStatus(status)) return null;

  return {
    id: asText(item.id) || crypto.randomUUID(),
    kind,
    title,
    when: parsed.toISOString(),
    status,
    caseId: asText(item.caseId) || null,
    leadId: asText(item.leadId) || null,
  };
}

export function getLeadNextAction(tasks: LinkedItem[], events: LinkedItem[]) {
  const candidates = [
    ...tasks.map((item) => toAction(item, 'task')),
    ...events.map((item) => toAction(item, 'event')),
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
