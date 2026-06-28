// STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH: active/closed relation truth uses shared closed status source.
// STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION: shared case archive/restore/navigation status contract.
import { deleteCaseFromSupabase, isSupabaseConfigured } from './supabase-fallback';
import {
  CASE_CLOSED_STATUSES,
  getCaseStatusLabel as getCaseStatusLabelFromConfig,
  isClosedCaseStatusValue,
} from './config/case-status';
import { normalizeCaseStatus as normalizeCaseStatusFromDomain } from './domain-statuses';

export function normalizeCaseStatus(value: unknown): string {
  return normalizeCaseStatusFromDomain(value);
}

export const CLOSED_CASE_STATUSES = CASE_CLOSED_STATUSES;

export function isClosedCaseStatus(status: unknown): boolean {
  return isClosedCaseStatusValue(status);
}

export function getCaseStatusLabel(status: unknown): string {
  return getCaseStatusLabelFromConfig(status);
}

export async function deleteCaseWithRelations(caseId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Ta operacja wymaga skonfigurowanego Supabase.');
  }

  await deleteCaseFromSupabase(caseId);
}
