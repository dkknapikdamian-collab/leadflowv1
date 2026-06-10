// STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH: active/closed relation truth uses shared closed status source.
// STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION: shared case archive/restore/navigation status contract.
import { deleteCaseFromSupabase, isSupabaseConfigured } from './supabase-fallback';

export function normalizeCaseStatus(value: unknown): string {
  return String(value || '').trim().toLowerCase();
}

export const CLOSED_CASE_STATUSES = ['completed', 'done', 'closed', 'archived', 'canceled', 'cancelled'] as const;

export function isClosedCaseStatus(status: unknown): boolean {
  return (CLOSED_CASE_STATUSES as readonly string[]).includes(normalizeCaseStatus(status));
}

export function getCaseStatusLabel(status: unknown): string {
  switch (normalizeCaseStatus(status)) {
    case 'new':
      return 'Nowa';
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'to_approve':
      return 'Do akceptacji';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'in_progress':
      return 'W realizacji';
    case 'on_hold':
      return 'Wstrzymana';
    case 'completed':
    case 'done':
    case 'closed':
    case 'archived':
      return 'Zamknięta';
    case 'canceled':
    case 'cancelled':
      return 'Anulowana';
    default:
      return String(status || 'Sprawa');
  }
}

export async function deleteCaseWithRelations(caseId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Ta operacja wymaga skonfigurowanego Supabase.');
  }

  await deleteCaseFromSupabase(caseId);
}
