import {
  decideGoogleCalendarMutationSyncState,
  type GoogleCalendarMutationSyncStateDecision,
  type GoogleCalendarMutationSyncStateInput,
} from './google-calendar-mutation-sync-state-decision.js';

export type GoogleCalendarCreateSyncStateDecisionFields =
  Omit<GoogleCalendarMutationSyncStateInput, 'mutationKind'>;

export type GoogleCalendarCreateSyncStateInsertPayload =
  Readonly<Record<string, never>>
  | Readonly<{ google_calendar_sync_status: 'pending' }>;

export interface GoogleCalendarCreateSyncStateInsertPayloadResult {
  decision: GoogleCalendarMutationSyncStateDecision;
  insertPayload: GoogleCalendarCreateSyncStateInsertPayload;
}

export interface GoogleCalendarCreateSyncStateInsertPayloadDependencies {
  decide: (
    input: GoogleCalendarMutationSyncStateInput,
  ) => GoogleCalendarMutationSyncStateDecision;
}

const INVALID_DECISION =
  'GCAL_CREATE_SYNC_STATE_INSERT_PAYLOAD_INVALID_DECISION';

function invalidDecision(): never {
  throw new Error(INVALID_DECISION);
}

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value.trim().toLowerCase();
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value).trim().toLowerCase();
  }
  return '';
}

function isDecision(
  value: unknown,
): value is GoogleCalendarMutationSyncStateDecision {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const decision = value as Record<string, unknown>;
  return typeof decision.outcome === 'string'
    && (decision.nextSyncStatus === 'pending'
      || decision.nextSyncStatus === 'pending_delete'
      || decision.nextSyncStatus === null)
    && typeof decision.shouldWrite === 'boolean';
}

export function buildGoogleCalendarCreateSyncStateInsertPayloadWithDependencies(
  input: GoogleCalendarCreateSyncStateDecisionFields,
  dependencies: GoogleCalendarCreateSyncStateInsertPayloadDependencies,
): GoogleCalendarCreateSyncStateInsertPayloadResult {
  const decision = dependencies.decide({
    mutationKind: 'create',
    recordType: input.recordType,
    type: input.type,
    status: input.status,
    showInCalendar: input.showInCalendar,
    hasCalendarTime: input.hasCalendarTime,
    createdByUserId: input.createdByUserId,
    googleCalendarEventId: input.googleCalendarEventId,
    currentGoogleSyncStatus: input.currentGoogleSyncStatus,
  });

  if (!isDecision(decision) || decision.outcome === 'pending_delete') {
    return invalidDecision();
  }

  if (decision.shouldWrite === true) {
    if (
      decision.outcome !== 'pending'
      || decision.nextSyncStatus !== 'pending'
    ) {
      return invalidDecision();
    }

    return {
      decision,
      insertPayload: {
        google_calendar_sync_status: 'pending',
      },
    };
  }

  const isAlreadyPendingNoWrite =
    decision.outcome === 'pending'
    && decision.nextSyncStatus === 'pending'
    && normalizeText(input.currentGoogleSyncStatus) === 'pending';

  if (decision.nextSyncStatus !== null && !isAlreadyPendingNoWrite) {
    return invalidDecision();
  }

  return {
    decision,
    insertPayload: {},
  };
}

export function buildGoogleCalendarCreateSyncStateInsertPayload(
  input: GoogleCalendarCreateSyncStateDecisionFields,
): GoogleCalendarCreateSyncStateInsertPayloadResult {
  return buildGoogleCalendarCreateSyncStateInsertPayloadWithDependencies(
    input,
    { decide: decideGoogleCalendarMutationSyncState },
  );
}
