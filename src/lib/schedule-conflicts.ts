import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { getTaskDate, getTaskStartAt } from './scheduling';
import { getConflictWarningsEnabled } from './app-preferences';

export type ScheduleConflictCandidate = {
  id: string;
  kind: 'task' | 'event';
  title: string;
  startAt: string;
  endAt: string;
  leadName?: string;
  caseId?: string | null;
  caseTitle?: string | null;
};

export type ScheduleConflictDraft = {
  kind: 'task' | 'event';
  title: string;
  startAt: string;
  endAt?: string | null;
};

function toDateSafe(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = parseISO(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function normalizeWindow(startAt: string, endAt?: string | null) {
  const start = toDateSafe(startAt);
  if (!start) return null;
  const endCandidate = toDateSafe(typeof endAt === 'string' ? endAt : '');
  const safeEnd = endCandidate && endCandidate.getTime() > start.getTime() ? endCandidate : new Date(start.getTime() + 60 * 60_000);
  return {
    startAt: start.toISOString(),
    endAt: safeEnd.toISOString(),
  };
}

function buildTaskStart(task: any) {
  return getTaskStartAt(task)
    || (typeof task?.scheduledAt === 'string' && task.scheduledAt)
    || (typeof task?.dueAt === 'string' && task.dueAt)
    || (typeof task?.date === 'string' ? `${task.date}T09:00` : '')
    || '';
}

export function buildConflictCandidates({
  tasks = [],
  events = [],
  caseTitleById,
}: {
  tasks?: any[];
  events?: any[];
  caseTitleById?: Map<string, string>;
}) {
  const taskCandidates: ScheduleConflictCandidate[] = tasks
    .map((task) => {
      const normalized = normalizeWindow(buildTaskStart(task), task?.endAt || null);
      if (!normalized || !task?.id) return null;
      const caseId = typeof task?.caseId === 'string' ? task.caseId : task?.caseId ? String(task.caseId) : null;
      return {
        id: String(task.id),
        kind: 'task' as const,
        title: String(task?.title || 'Zadanie'),
        startAt: normalized.startAt,
        endAt: normalized.endAt,
        leadName: task?.leadName ? String(task.leadName) : '',
        caseId,
        caseTitle: caseId ? caseTitleById?.get(caseId) || null : null,
      };
    })
    .filter(Boolean) as ScheduleConflictCandidate[];

  const eventCandidates: ScheduleConflictCandidate[] = events
    .map((event) => {
      const normalized = normalizeWindow(event?.startAt || '', event?.endAt || null);
      if (!normalized || !event?.id) return null;
      const caseId = typeof event?.caseId === 'string' ? event.caseId : event?.caseId ? String(event.caseId) : null;
      return {
        id: String(event.id),
        kind: 'event' as const,
        title: String(event?.title || 'Wydarzenie'),
        startAt: normalized.startAt,
        endAt: normalized.endAt,
        leadName: event?.leadName ? String(event.leadName) : '',
        caseId,
        caseTitle: caseId ? caseTitleById?.get(caseId) || null : null,
      };
    })
    .filter(Boolean) as ScheduleConflictCandidate[];

  const unique = new Map<string, ScheduleConflictCandidate>();
  [...taskCandidates, ...eventCandidates].forEach((candidate) => {
    unique.set(`${candidate.kind}:${candidate.id}`, candidate);
  });
  return [...unique.values()];
}

export function findScheduleConflicts({
  draft,
  candidates,
  excludeId,
  excludeKind,
}: {
  draft: ScheduleConflictDraft;
  candidates: ScheduleConflictCandidate[];
  excludeId?: string | null;
  excludeKind?: 'task' | 'event' | null;
}) {
  const normalizedDraft = normalizeWindow(draft.startAt, draft.endAt || null);
  if (!normalizedDraft) return [];

  const draftStart = parseISO(normalizedDraft.startAt).getTime();
  const draftEnd = parseISO(normalizedDraft.endAt).getTime();

  return candidates.filter((candidate) => {
    if (excludeId && excludeKind && candidate.id === excludeId && candidate.kind === excludeKind) {
      return false;
    }
    const candidateStart = parseISO(candidate.startAt).getTime();
    const candidateEnd = parseISO(candidate.endAt).getTime();
    return draftStart < candidateEnd && candidateStart < draftEnd;
  });
}

function formatCandidateLine(candidate: ScheduleConflictCandidate) {
  const kindLabel = candidate.kind === 'event' ? 'Wydarzenie' : 'Zadanie';
  const start = parseISO(candidate.startAt);
  const end = parseISO(candidate.endAt);
  const timeLabel = `${format(start, 'd MMM HH:mm', { locale: pl })} - ${format(end, 'HH:mm', { locale: pl })}`;
  const suffixParts = [candidate.caseTitle ? `Sprawa: ${candidate.caseTitle}` : null, candidate.leadName ? `Lead: ${candidate.leadName}` : null].filter(Boolean);
  const suffix = suffixParts.length ? ` (${suffixParts.join(' • ')})` : '';
  return `• ${kindLabel}: ${candidate.title} — ${timeLabel}${suffix}`;
}

export function formatScheduleConflictMessage(conflicts: ScheduleConflictCandidate[]) {
  const listed = conflicts.slice(0, 5).map(formatCandidateLine).join('\n');
  const remaining = conflicts.length > 5 ? `\n• +${conflicts.length - 5} kolejnych konfliktów` : '';
  return `Wykryto konflikt terminu z:\n\n${listed}${remaining}\n\nCzy mimo to zapisać?`;
}

export function confirmScheduleConflicts({
  draft,
  candidates,
  excludeId,
  excludeKind,
}: {
  draft: ScheduleConflictDraft;
  candidates: ScheduleConflictCandidate[];
  excludeId?: string | null;
  excludeKind?: 'task' | 'event' | null;
}) {
  if (!getConflictWarningsEnabled()) return true;
  if (typeof window === 'undefined') return true;
  const conflicts = findScheduleConflicts({ draft, candidates, excludeId, excludeKind });
  if (!conflicts.length) return true;
  return window.confirm(formatScheduleConflictMessage(conflicts));
}
