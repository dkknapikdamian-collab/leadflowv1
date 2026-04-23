import { deleteCaseFromSupabase, isSupabaseConfigured } from './supabase-fallback';

export async function deleteCaseWithRelations(caseId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Ta operacja wymaga skonfigurowanego Supabase.');
  }

  await deleteCaseFromSupabase(caseId);
}
