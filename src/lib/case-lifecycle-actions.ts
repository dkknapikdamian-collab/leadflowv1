import { insertActivityToSupabase, updateCaseInSupabase } from './supabase-fallback';

export type CaseLifecycleStatusTransitionV1 = {
  caseId: string;
  status: string;
  previousStatus?: string | null;
  source: string;
};

function getLifecycleEventType(status: string, previousStatus?: string | null) {
  if (status === 'completed') return 'case_lifecycle_completed';
  if (previousStatus === 'completed') return 'case_lifecycle_reopened';
  return 'case_lifecycle_started';
}

/**
 * Canonical owner for operator-driven case lifecycle transitions.
 *
 * The case row is the source of truth for status. Activity is an audit trail
 * and must not become a second state store or block the status mutation.
 */
export async function transitionCaseLifecycleStatusV1(input: CaseLifecycleStatusTransitionV1) {
  const lastActivityAt = new Date().toISOString();

  await updateCaseInSupabase({
    id: input.caseId,
    status: input.status,
    lastActivityAt,
  });

  await insertActivityToSupabase({
    caseId: input.caseId,
    actorType: 'operator',
    eventType: getLifecycleEventType(input.status, input.previousStatus),
    payload: {
      status: input.status,
      previousStatus: input.previousStatus || null,
      source: input.source,
    },
  }).catch(() => null);

  return { lastActivityAt };
}
