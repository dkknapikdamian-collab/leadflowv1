import { createCaseInSupabase } from '../supabase-fallback';
import { readCreatedCaseId } from './read-created-case-id';

export { readCreatedCaseId } from './read-created-case-id';

export type CreateStarterCaseForClientInput = {
  title: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  workspaceId: string;
  primaryForClient: boolean;
};

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
