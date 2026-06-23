// STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT
// Central action policy for Calendar/Today operational entries.
// Pure helper: no React, no Supabase, no Google sync, no SQL.

import {
  getSupportedOperationalEntryActions,
  type OperationalEntryAction,
  type OperationalEntryKind,
} from './calendar-operational-entry-contract';

export const STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT = 'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT';

export type CalendarOperationalActionDecisionReason =
  | 'allowed_by_contract'
  | 'blocked_for_lead_shadow'
  | 'unknown_action'
  | 'unknown_kind';

export interface CalendarOperationalActionDecision {
  allowed: boolean;
  kind: OperationalEntryKind | 'unknown';
  action: OperationalEntryAction | string;
  reason: CalendarOperationalActionDecisionReason;
  allowedActions: OperationalEntryAction[];
}

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : {};
}

function readNestedRecord(record: AnyRecord, key: string): AnyRecord {
  return asRecord(record[key]);
}

function normalizeKeyPart(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function hasAny(record: AnyRecord, keys: string[]): boolean {
  return keys.some((key) => {
    const value = record[key];
    return value !== null && value !== undefined && String(value).trim() !== '';
  });
}

export function normalizeOperationalEntryAction(action: unknown): OperationalEntryAction | string {
  const value = normalizeKeyPart(action);
  if (['done', 'complete', 'completed', 'mark-done', 'mark_done'].includes(value)) return 'complete';
  if (['restore', 'undo', 'reopen'].includes(value)) return 'restore';
  if (['delete', 'remove', 'trash'].includes(value)) return 'delete';
  if (['shift', 'reschedule', 'snooze', 'move'].includes(value)) return 'shift';
  if (['edit', 'update'].includes(value)) return 'edit';
  if (['open-related', 'open_related', 'open', 'link', 'details'].includes(value)) return 'open-related';
  return value;
}

export function getOperationalEntryActionKind(entryInput: unknown): OperationalEntryKind | 'unknown' {
  const entry = asRecord(entryInput);
  const raw = readNestedRecord(entry, 'raw');
  const candidates = [
    entry.kind,
    entry.type,
    entry.sourceKind,
    entry.source_kind,
    entry.sourceType,
    entry.source_type,
    entry.sourceTable,
    entry.source_table,
    entry.table,
    raw.kind,
    raw.type,
    raw.sourceKind,
    raw.source_kind,
    raw.sourceType,
    raw.source_type,
    raw.sourceTable,
    raw.source_table,
    raw.table,
  ].map(normalizeKeyPart);
  if (candidates.some((value) => value === 'lead' || value === 'leads' || value.includes('lead'))) return 'lead';
  if (candidates.some((value) => value === 'event' || value === 'events' || value.includes('event'))) return 'event';
  if (candidates.some((value) => value === 'task' || value === 'tasks' || value.includes('task'))) return 'task';
  if (hasAny(entry, ['leadId', 'lead_id', 'nextActionAt', 'next_action_at', 'followUpAt', 'follow_up_at'])
    || hasAny(raw, ['leadId', 'lead_id', 'nextActionAt', 'next_action_at', 'followUpAt', 'follow_up_at'])) return 'lead';
  if (hasAny(entry, ['eventId', 'event_id', 'startAt', 'startsAt']) || hasAny(raw, ['eventId', 'event_id', 'startAt', 'startsAt'])) return 'event';
  if (hasAny(entry, ['taskId', 'task_id', 'scheduledAt', 'scheduled_at', 'dueAt', 'due_at']) || hasAny(raw, ['taskId', 'task_id', 'scheduledAt', 'scheduled_at', 'dueAt', 'due_at'])) return 'task';
  return 'unknown';
}

export function getAllowedOperationalEntryActions(entryInput: unknown): OperationalEntryAction[] {
  const kind = getOperationalEntryActionKind(entryInput);
  if (kind === 'unknown') return [];
  return getSupportedOperationalEntryActions(kind);
}

export function getOperationalEntryActionDecision(entryInput: unknown, actionInput: unknown): CalendarOperationalActionDecision {
  const action = normalizeOperationalEntryAction(actionInput);
  const kind = getOperationalEntryActionKind(entryInput);
  const allowedActions = getAllowedOperationalEntryActions(entryInput);
  if (!['edit', 'shift', 'complete', 'restore', 'delete', 'open-related'].includes(String(action))) {
    return { allowed: false, kind, action, reason: 'unknown_action', allowedActions };
  }
  if (kind === 'unknown') return { allowed: false, kind, action, reason: 'unknown_kind', allowedActions };
  const allowed = allowedActions.includes(action as OperationalEntryAction);
  return {
    allowed,
    kind,
    action,
    reason: allowed ? 'allowed_by_contract' : 'blocked_for_lead_shadow',
    allowedActions,
  };
}

export function isOperationalEntryActionAllowed(entryInput: unknown, actionInput: unknown): boolean {
  return getOperationalEntryActionDecision(entryInput, actionInput).allowed;
}

export function sanitizeOperationalEntryActions(actionsInput: unknown, entryInput: unknown): OperationalEntryAction[] {
  const actions = Array.isArray(actionsInput) ? actionsInput : [];
  const allowed = new Set(getAllowedOperationalEntryActions(entryInput));
  return actions
    .map(normalizeOperationalEntryAction)
    .filter((action): action is OperationalEntryAction => allowed.has(action as OperationalEntryAction));
}
