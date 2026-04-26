import { normalizeEvent, normalizeLead, normalizeTask, type NormalizedEvent, type NormalizedLead, type NormalizedTask } from './record-normalizers';

export type PlannedActionSource = 'task' | 'event' | 'legacy_next_action';

export type PlannedAction = {
  source: PlannedActionSource;
  id: string;
  title: string;
  at: string;
  leadId: string | null;
  caseId: string | null;
  raw: any;
};

function timestamp(value: string | null): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

export function getPlannedActionsForLead(input: {
  lead: any;
  tasks?: any[];
  events?: any[];
  includeLegacyNextAction?: boolean;
}): PlannedAction[] {
  const lead: NormalizedLead = normalizeLead(input.lead);
  const actions: PlannedAction[] = [];

  for (const rawTask of input.tasks ?? []) {
    const task: NormalizedTask = normalizeTask(rawTask);
    if (task.status === 'done' || task.status === 'cancelled' || task.status === 'canceled') continue;
    if (task.leadId !== lead.id) continue;
    const at = task.scheduledAt ?? task.dueAt ?? (task.date ? `${task.date}T09:00:00` : null);
    if (!at) continue;
    actions.push({
      source: 'task',
      id: task.id,
      title: task.title,
      at,
      leadId: task.leadId,
      caseId: task.caseId,
      raw: rawTask,
    });
  }

  for (const rawEvent of input.events ?? []) {
    const event: NormalizedEvent = normalizeEvent(rawEvent);
    if (event.status === 'done' || event.status === 'completed' || event.status === 'cancelled' || event.status === 'canceled') continue;
    if (event.leadId !== lead.id) continue;
    if (!event.startAt) continue;
    actions.push({
      source: 'event',
      id: event.id,
      title: event.title,
      at: event.startAt,
      leadId: event.leadId,
      caseId: event.caseId,
      raw: rawEvent,
    });
  }

  if (input.includeLegacyNextAction !== false && lead.nextActionAt) {
    actions.push({
      source: 'legacy_next_action',
      id: `${lead.id}:legacy_next_action`,
      title: 'Zaplanowana akcja',
      at: lead.nextActionAt,
      leadId: lead.id,
      caseId: lead.linkedCaseId,
      raw: input.lead,
    });
  }

  return actions.sort((a, b) => timestamp(a.at) - timestamp(b.at));
}

export function getNearestPlannedActionForLead(input: {
  lead: any;
  tasks?: any[];
  events?: any[];
  now?: Date;
  includeLegacyNextAction?: boolean;
}): PlannedAction | null {
  const now = input.now ?? new Date();
  const actions = getPlannedActionsForLead(input);
  const future = actions.find((action) => timestamp(action.at) >= now.getTime());
  return future ?? actions[0] ?? null;
}

export function leadHasPlannedAction(input: { lead: any; tasks?: any[]; events?: any[] }): boolean {
  return getNearestPlannedActionForLead(input) !== null;
}

export function labelPlannedActionSource(source: PlannedActionSource): string {
  if (source === 'task') return 'Zadanie';
  if (source === 'event') return 'Wydarzenie';
  return 'Starsza akcja';
}
