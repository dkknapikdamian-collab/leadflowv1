import {
  getNearestPlannedAction,
  type PlannedAction,
} from './planned-actions';

type LinkedItem = Record<string, unknown>;

export type LeadNextAction = PlannedAction;

export { getNearestPlannedAction };

export function getLeadNextAction(tasks: LinkedItem[], events: LinkedItem[]) {
  // A25_NEAREST_PLANNED_ACTION_COMPAT
  // Existing callers already pass items scoped to the lead or case.
  // The core source is still tasks and events.
  return getNearestPlannedAction({
    recordType: 'lead',
    recordId: '__already_scoped__',
    tasks,
    events,
    alreadyScoped: true,
  });
}
