import { updateByIdScoped } from './_supabase.js';

import {
  readGoogleCalendarMutationSnapshot,
  type GoogleCalendarMutationSnapshotReadInput,
  type GoogleCalendarMutationSnapshotReadResult,
} from './google-calendar-mutation-snapshot.js';

import {
  decideGoogleCalendarMutationSyncState,
  type GoogleCalendarMutationKind,
  type GoogleCalendarMutationSyncStateDecision,
  type GoogleCalendarMutationSyncStateInput,
} from '../lib/google-calendar-mutation-sync-state-decision.js';

export interface GoogleCalendarMutationSyncStateMarkerInput {
  mutationKind: GoogleCalendarMutationKind | string;
  workItemId: string;
  workspaceId: string;
}

export type GoogleCalendarMutationSnapshotReader =
  (
    input: GoogleCalendarMutationSnapshotReadInput,
  ) => Promise<GoogleCalendarMutationSnapshotReadResult>;

export type GoogleCalendarMutationDecisionFunction =
  (
    input: GoogleCalendarMutationSyncStateInput,
  ) => GoogleCalendarMutationSyncStateDecision;

export type GoogleCalendarMutationScopedUpdater =
  (
    table: string,
    id: string,
    workspaceId: string,
    payload: Record<string, unknown>,
  ) => Promise<unknown>;

export interface GoogleCalendarMutationSyncStateMarkerDependencies {
  readSnapshot: GoogleCalendarMutationSnapshotReader;
  decide: GoogleCalendarMutationDecisionFunction;
  updateScoped: GoogleCalendarMutationScopedUpdater;
}

export type GoogleCalendarMutationSyncStateMarkerResult =
  | {
      resultKind: 'snapshot_not_found';
      snapshotFound: false;
      decision: null;
      nextSyncStatus: null;
      writeAttempted: false;
      writeConfirmed: false;
    }
  | {
      resultKind: 'decision_no_write';
      snapshotFound: true;
      decision: GoogleCalendarMutationSyncStateDecision;
      nextSyncStatus: 'pending' | 'pending_delete' | null;
      writeAttempted: false;
      writeConfirmed: false;
    }
  | {
      resultKind: 'status_written';
      snapshotFound: true;
      decision: GoogleCalendarMutationSyncStateDecision;
      nextSyncStatus: 'pending' | 'pending_delete';
      writeAttempted: true;
      writeConfirmed: true;
    };

function requiredIdentifier(value: unknown, errorCode: string): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) throw new Error(errorCode);
  return normalized;
}

function returnedIdentifier(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).trim();
  return '';
}

function allowedSyncStatus(
  value: unknown,
): 'pending' | 'pending_delete' | null {
  if (value === 'pending' || value === 'pending_delete') return value;
  return null;
}

function confirmWriteResponse(
  response: unknown,
  workItemId: string,
  workspaceId: string,
  nextSyncStatus: 'pending' | 'pending_delete',
): void {
  if (!Array.isArray(response)) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_WRITE_RESPONSE');
  }

  if (response.length === 0) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED');
  }

  if (response.length > 1) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_MULTIPLE_ROWS_UPDATED');
  }

  const row = response[0];
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_UPDATED_ROW');
  }

  const returned = row as Record<string, unknown>;

  if (returnedIdentifier(returned.id) !== workItemId) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_ID_MISMATCH');
  }

  if (returnedIdentifier(returned.workspace_id) !== workspaceId) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_MISMATCH');
  }

  if (returned.google_calendar_sync_status !== nextSyncStatus) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_STATUS_MISMATCH');
  }
}

export async function markGoogleCalendarMutationSyncStateWithDependencies(
  input: GoogleCalendarMutationSyncStateMarkerInput,
  dependencies: GoogleCalendarMutationSyncStateMarkerDependencies,
): Promise<GoogleCalendarMutationSyncStateMarkerResult> {
  const workItemId = requiredIdentifier(
    input.workItemId,
    'GCAL_MUTATION_SYNC_STATE_MARKER_WORK_ITEM_ID_REQUIRED',
  );
  const workspaceId = requiredIdentifier(
    input.workspaceId,
    'GCAL_MUTATION_SYNC_STATE_MARKER_WORKSPACE_ID_REQUIRED',
  );

  const snapshotResult = await dependencies.readSnapshot({
    workItemId,
    workspaceId,
  });

  if (snapshotResult.found === false) {
    return {
      resultKind: 'snapshot_not_found',
      snapshotFound: false,
      decision: null,
      nextSyncStatus: null,
      writeAttempted: false,
      writeConfirmed: false,
    };
  }

  const snapshot = snapshotResult.snapshot;
  const decision = dependencies.decide({
    mutationKind: input.mutationKind,
    recordType: snapshot.recordType,
    type: snapshot.type,
    status: snapshot.status,
    showInCalendar: snapshot.showInCalendar,
    hasCalendarTime: snapshot.hasCalendarTime,
    createdByUserId: snapshot.createdByUserId,
    googleCalendarEventId: snapshot.googleCalendarEventId,
    currentGoogleSyncStatus: snapshot.currentGoogleSyncStatus,
  });

  const nextSyncStatus = allowedSyncStatus(decision.nextSyncStatus);

  if (decision.shouldWrite !== true || decision.nextSyncStatus === null) {
    return {
      resultKind: 'decision_no_write',
      snapshotFound: true,
      decision,
      nextSyncStatus,
      writeAttempted: false,
      writeConfirmed: false,
    };
  }

  if (nextSyncStatus === null) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_UNSUPPORTED_STATUS');
  }

  const writeResponse = await dependencies.updateScoped(
    'work_items',
    workItemId,
    workspaceId,
    {
      google_calendar_sync_status: decision.nextSyncStatus,
    },
  );

  confirmWriteResponse(
    writeResponse,
    workItemId,
    workspaceId,
    nextSyncStatus,
  );

  return {
    resultKind: 'status_written',
    snapshotFound: true,
    decision,
    nextSyncStatus,
    writeAttempted: true,
    writeConfirmed: true,
  };
}

export async function markGoogleCalendarMutationSyncState(
  input: GoogleCalendarMutationSyncStateMarkerInput,
): Promise<GoogleCalendarMutationSyncStateMarkerResult> {
  return markGoogleCalendarMutationSyncStateWithDependencies(
    input,
    {
      readSnapshot: readGoogleCalendarMutationSnapshot,
      decide: decideGoogleCalendarMutationSyncState,
      updateScoped: updateByIdScoped,
    },
  );
}
