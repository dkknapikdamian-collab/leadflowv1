import { selectFirstAvailable } from './_supabase.js';

import type {
  GoogleCalendarMutationSyncStateInput,
} from '../lib/google-calendar-mutation-sync-state-decision.js';

export interface GoogleCalendarMutationSnapshotReadInput {
  workItemId: string;
  workspaceId: string;
}

export type GoogleCalendarMutationSnapshotDecisionFields =
  Omit<GoogleCalendarMutationSyncStateInput, 'mutationKind'>;

export interface GoogleCalendarMutationSnapshot
  extends GoogleCalendarMutationSnapshotDecisionFields {
  id: string;
  workspaceId: string;
}

export type GoogleCalendarMutationSnapshotReadResult =
  | {
      found: true;
      snapshot: GoogleCalendarMutationSnapshot;
    }
  | {
      found: false;
      snapshot: null;
    };

export type GoogleCalendarMutationSnapshotSelect =
  (queries: string[]) => Promise<{
    query: string;
    data: unknown;
  }>;

export const GOOGLE_CALENDAR_MUTATION_SNAPSHOT_SELECT = [
  'id',
  'workspace_id',
  'record_type',
  'type',
  'status',
  'show_in_calendar',
  'start_at',
  'scheduled_at',
  'due_at',
  'created_by_user_id',
  'google_calendar_event_id',
  'google_calendar_sync_status',
].join(',');

function requiredIdentifier(value: unknown, errorCode: string): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) throw new Error(errorCode);
  return normalized;
}

function rowIdentifier(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).trim();
  return '';
}

function hasNonEmptyCalendarTime(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).trim().length > 0;
  return false;
}

export function buildGoogleCalendarMutationSnapshotQuery(
  input: GoogleCalendarMutationSnapshotReadInput,
): string {
  const workItemId = requiredIdentifier(
    input.workItemId,
    'GCAL_MUTATION_SNAPSHOT_WORK_ITEM_ID_REQUIRED',
  );
  const workspaceId = requiredIdentifier(
    input.workspaceId,
    'GCAL_MUTATION_SNAPSHOT_WORKSPACE_ID_REQUIRED',
  );

  return 'work_items?select=' + GOOGLE_CALENDAR_MUTATION_SNAPSHOT_SELECT
    + '&id=eq.' + encodeURIComponent(workItemId)
    + '&workspace_id=eq.' + encodeURIComponent(workspaceId)
    + '&limit=1';
}

export function normalizeGoogleCalendarMutationSnapshot(
  row: Record<string, unknown>,
): GoogleCalendarMutationSnapshot {
  return {
    id: rowIdentifier(row.id),
    workspaceId: rowIdentifier(row.workspace_id),
    recordType: row.record_type,
    type: row.type,
    status: row.status,
    showInCalendar: row.show_in_calendar,
    hasCalendarTime: [row.start_at, row.scheduled_at, row.due_at]
      .some(hasNonEmptyCalendarTime),
    createdByUserId: row.created_by_user_id,
    googleCalendarEventId: row.google_calendar_event_id,
    currentGoogleSyncStatus: row.google_calendar_sync_status,
  };
}

export async function readGoogleCalendarMutationSnapshotWithSelect(
  input: GoogleCalendarMutationSnapshotReadInput,
  select: GoogleCalendarMutationSnapshotSelect,
): Promise<GoogleCalendarMutationSnapshotReadResult> {
  const expectedWorkItemId = requiredIdentifier(
    input.workItemId,
    'GCAL_MUTATION_SNAPSHOT_WORK_ITEM_ID_REQUIRED',
  );
  const expectedWorkspaceId = requiredIdentifier(
    input.workspaceId,
    'GCAL_MUTATION_SNAPSHOT_WORKSPACE_ID_REQUIRED',
  );
  const query = buildGoogleCalendarMutationSnapshotQuery({
    workItemId: expectedWorkItemId,
    workspaceId: expectedWorkspaceId,
  });

  const result = await select([query]);
  if (!result || typeof result !== 'object' || !Array.isArray(result.data)) {
    throw new Error('GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE');
  }

  if (result.data.length === 0) {
    return { found: false, snapshot: null };
  }

  const row = result.data[0];
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error('GCAL_MUTATION_SNAPSHOT_INVALID_RESPONSE');
  }

  const snapshot = normalizeGoogleCalendarMutationSnapshot(
    row as Record<string, unknown>,
  );

  if (snapshot.id !== expectedWorkItemId) {
    throw new Error('GCAL_MUTATION_SNAPSHOT_ID_MISMATCH');
  }

  if (snapshot.workspaceId !== expectedWorkspaceId) {
    throw new Error('GCAL_MUTATION_SNAPSHOT_WORKSPACE_MISMATCH');
  }

  return { found: true, snapshot };
}

export async function readGoogleCalendarMutationSnapshot(
  input: GoogleCalendarMutationSnapshotReadInput,
): Promise<GoogleCalendarMutationSnapshotReadResult> {
  return readGoogleCalendarMutationSnapshotWithSelect(
    input,
    selectFirstAvailable,
  );
}
