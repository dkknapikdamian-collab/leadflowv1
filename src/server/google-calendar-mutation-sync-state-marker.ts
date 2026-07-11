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
  workItemId: string;
  workspaceId: string;
  mutationKind: GoogleCalendarMutationKind | string;
}

export type GoogleCalendarMutationSnapshotReader = (
  input: GoogleCalendarMutationSnapshotReadInput,
) => Promise<GoogleCalendarMutationSnapshotReadResult>;

export type GoogleCalendarMutationDecisionFunction = (
  input: GoogleCalendarMutationSyncStateInput,
) => GoogleCalendarMutationSyncStateDecision;

export type GoogleCalendarMutationScopedWriter = (
  table: string,
  id: string,
  workspaceId: string,
  payload: Record<string, unknown>,
) => Promise<unknown>;

export interface GoogleCalendarMutationSyncStateMarkerDependencies {
  readSnapshot: GoogleCalendarMutationSnapshotReader;
  decide: GoogleCalendarMutationDecisionFunction;
  updateScoped: GoogleCalendarMutationScopedWriter;
}

export interface GoogleCalendarMutationSyncStateWriteConfirmation {
  workItemId: string;
  workspaceId: string;
  googleCalendarSyncStatus: 'pending' | 'pending_delete';
}

export type GoogleCalendarMutationSyncStateMarkerResult =
  | {
      found: false;
      wrote: false;
      decision: null;
      confirmation: null;
    }
  | {
      found: true;
      wrote: false;
      decision: GoogleCalendarMutationSyncStateDecision;
      confirmation: null;
    }
  | {
      found: true;
      wrote: true;
      decision: GoogleCalendarMutationSyncStateDecision;
      confirmation: GoogleCalendarMutationSyncStateWriteConfirmation;
    };

function requiredIdentifier(value: unknown, errorCode: string): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) throw new Error(errorCode);
  return normalized;
}

function returnedIdentifier(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value).trim();
  }
  return '';
}

function requiredWriteStatus(
  decision: GoogleCalendarMutationSyncStateDecision,
): 'pending' | 'pending_delete' {
  if (
    decision.nextSyncStatus !== 'pending'
    && decision.nextSyncStatus !== 'pending_delete'
  ) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_INVALID_DECISION');
  }
  return decision.nextSyncStatus;
}

function confirmWriteResponse(
  response: unknown,
  expectedWorkItemId: string,
  expectedWorkspaceId: string,
  expectedStatus: 'pending' | 'pending_delete',
): GoogleCalendarMutationSyncStateWriteConfirmation {
  if (!Array.isArray(response)) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_INVALID_RESPONSE');
  }

  if (response.length !== 1) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_NOT_CONFIRMED');
  }

  const row = response[0];
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_INVALID_RESPONSE');
  }

  const returned = row as Record<string, unknown>;
  if (returnedIdentifier(returned.id) !== expectedWorkItemId) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_ID_MISMATCH');
  }

  if (returnedIdentifier(returned.workspace_id) !== expectedWorkspaceId) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_WORKSPACE_MISMATCH');
  }

  if (returned.google_calendar_sync_status !== expectedStatus) {
    throw new Error('GCAL_MUTATION_SYNC_STATE_MARKER_WRITE_STATUS_MISMATCH');
  }

  return {
    workItemId: expectedWorkItemId,
    workspaceId: expectedWorkspaceId,
    googleCalendarSyncStatus: expectedStatus,
  };
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
      found: false,
      wrote: false,
      decision: null,
      confirmation: null,
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

  if (decision.shouldWrite === false) {
    return {
      found: true,
      wrote: false,
      decision,
      confirmation: null,
    };
  }

  const nextSyncStatus = requiredWriteStatus(decision);
  const writeResponse = await dependencies.updateScoped(
    'work_items',
    snapshot.id,
    snapshot.workspaceId,
    {
      google_calendar_sync_status: nextSyncStatus,
    },
  );

  const confirmation = confirmWriteResponse(
    writeResponse,
    snapshot.id,
    snapshot.workspaceId,
    nextSyncStatus,
  );

  return {
    found: true,
    wrote: true,
    decision,
    confirmation,
  };
}

export async function markGoogleCalendarMutationSyncState(
  input: GoogleCalendarMutationSyncStateMarkerInput,
): Promise<GoogleCalendarMutationSyncStateMarkerResult> {
  return markGoogleCalendarMutationSyncStateWithDependencies(input, {
    readSnapshot: readGoogleCalendarMutationSnapshot,
    decide: decideGoogleCalendarMutationSyncState,
    updateScoped: updateByIdScoped,
  });
}
