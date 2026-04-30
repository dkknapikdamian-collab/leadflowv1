/*
AI_DRAFT_CONFIRM_RECORDS_STAGE25

Small helpers for draft -> final record confirmation.

The UI remains responsible for user confirmation. These helpers only normalize
metadata after the user clicks "Zatwierdź".
*/

export type AiDraftConfirmedRecordType = 'lead' | 'task' | 'event' | 'note';

export type AiDraftConfirmedRecordMeta = {
  linkedRecordId: string;
  linkedRecordType: AiDraftConfirmedRecordType;
  confirmedAt: string;
  rawTextRemoved: true;
};

export function asAiDraftConfirmText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getAiDraftCreatedRecordId(record: unknown) {
  if (!record || typeof record !== 'object') return '';
  const row = record as Record<string, unknown>;

  return asAiDraftConfirmText(
    row.id
      || row.leadId
      || row.taskId
      || row.eventId
      || row.activityId
      || row.recordId
      || row.linkedRecordId,
  );
}

export function buildAiDraftConfirmedParsedDraft(input: {
  parsedDraft?: Record<string, unknown> | null;
  linkedRecordId: string;
  linkedRecordType: AiDraftConfirmedRecordType;
  confirmedAt?: string;
}) {
  const confirmedAt = input.confirmedAt || new Date().toISOString();

  return {
    ...(input.parsedDraft || {}),
    confirmedAt,
    linkedRecordId: input.linkedRecordId,
    linkedRecordType: input.linkedRecordType,
    rawTextRemoved: true,
    approval: {
      ...(input.parsedDraft?.approval && typeof input.parsedDraft.approval === 'object'
        ? input.parsedDraft.approval as Record<string, unknown>
        : {}),
      confirmedAt,
      linkedRecordId: input.linkedRecordId,
      linkedRecordType: input.linkedRecordType,
    },
  };
}
