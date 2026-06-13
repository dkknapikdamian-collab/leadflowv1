import { createCaseInSupabase } from '../supabase-fallback';

export type CreateStarterCaseForClientInput = {
  title: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  workspaceId: string;
  primaryForClient: boolean;
};

export function readCreatedCaseId(result: unknown) {
  const row = (result || {}) as Record<string, any>;
  return String(
    row.id
    || row.caseId
    || row.case_id
    || row.case?.id
    || row.data?.id
    || row.data?.case?.id
    || row.row?.id
    || ''
  ).trim();
}

export async function createStarterCaseForClient(input: CreateStarterCaseForClientInput) {
  const createdCase = await createCaseInSupabase({
    title: input.title.trim(),
    clientId: input.clientId,
    clientName: input.clientName,
    clientEmail: input.clientEmail || '',
    clientPhone: input.clientPhone || '',
    status: 'new',
    contractValue: 0,
    expectedRevenue: 0,
    caseValue: 0,
    remainingAmount: 0,
    commissionMode: 'not_set',
    commissionAmount: 0,
    commissionStatus: 'not_set',
    primaryForClient: input.primaryForClient,
    workspaceId: input.workspaceId,
  });

  return {
    createdCase,
    createdCaseId: readCreatedCaseId(createdCase),
  };
}
