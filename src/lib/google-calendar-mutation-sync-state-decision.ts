export type GoogleCalendarMutationKind =
  | 'create'
  | 'update'
  | 'delete';

export type GoogleCalendarMutationSyncStateOutcome =
  | 'pending'
  | 'pending_delete'
  | 'unchanged'
  | 'skip_imported'
  | 'skip_no_owner'
  | 'skip_no_calendar_time';

export interface GoogleCalendarMutationSyncStateInput {
  mutationKind: GoogleCalendarMutationKind | string;
  recordType: unknown;
  type: unknown;
  status: unknown;
  showInCalendar: unknown;
  hasCalendarTime: boolean;
  createdByUserId: unknown;
  googleCalendarEventId: unknown;
  currentGoogleSyncStatus: unknown;
}

export interface GoogleCalendarMutationSyncStateDecision {
  outcome: GoogleCalendarMutationSyncStateOutcome;
  nextSyncStatus: 'pending' | 'pending_delete' | null;
  shouldWrite: boolean;
}

const CLOSED_OR_DELETE_STATUSES = new Set([
  'done',
  'completed',
  'cancelled',
  'canceled',
  'archived',
  'deleted',
  'removed',
]);

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value.trim().toLowerCase();
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).trim().toLowerCase();
  return '';
}

function hasTrimmedValue(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).trim().length > 0;
  return false;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return null;
}

function noWrite(outcome: GoogleCalendarMutationSyncStateOutcome): GoogleCalendarMutationSyncStateDecision {
  return {
    outcome,
    nextSyncStatus: null,
    shouldWrite: false,
  };
}

export function decideGoogleCalendarMutationSyncState(
  input: GoogleCalendarMutationSyncStateInput,
): GoogleCalendarMutationSyncStateDecision {
  const mutationKind = normalizeText(input.mutationKind);
  const recordType = normalizeText(input.recordType);
  const type = normalizeText(input.type);
  const status = normalizeText(input.status);
  const showInCalendar = normalizeBoolean(input.showInCalendar);
  const currentGoogleSyncStatus = normalizeText(input.currentGoogleSyncStatus);
  const hasOwner = hasTrimmedValue(input.createdByUserId);
  const hasGoogleCalendarEventId = hasTrimmedValue(input.googleCalendarEventId);
  const isClosedOrDeleted = CLOSED_OR_DELETE_STATUSES.has(status);

  if (type === 'external_google_event') {
    return noWrite('skip_imported');
  }

  if (recordType !== 'task' && recordType !== 'event') {
    return noWrite('unchanged');
  }

  if (!hasOwner) {
    return noWrite('skip_no_owner');
  }

  const requestsRemoteDelete = mutationKind === 'delete'
    || showInCalendar === false
    || isClosedOrDeleted;

  if (hasGoogleCalendarEventId && requestsRemoteDelete) {
    return {
      outcome: 'pending_delete',
      nextSyncStatus: 'pending_delete',
      shouldWrite: currentGoogleSyncStatus !== 'pending_delete',
    };
  }

  if (!hasGoogleCalendarEventId && requestsRemoteDelete) {
    return noWrite('unchanged');
  }

  if (mutationKind !== 'create' && mutationKind !== 'update') {
    return noWrite('unchanged');
  }

  if (showInCalendar !== true) {
    return noWrite('unchanged');
  }

  if (input.hasCalendarTime !== true) {
    return noWrite('skip_no_calendar_time');
  }

  return {
    outcome: 'pending',
    nextSyncStatus: 'pending',
    shouldWrite: currentGoogleSyncStatus !== 'pending',
  };
}
