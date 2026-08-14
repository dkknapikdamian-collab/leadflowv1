import { selectFirstAvailable, supabaseRequest } from './_supabase.js';
import { requireScopedRow } from './_request-scope.js';
import { RequestAuthError } from './_supabase-auth.js';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function findCaseItemById(itemId: string) {
  // This resolver is only for callers that already established authenticated
  // workspace/session context. It discovers the parent case so the caller can
  // enforce case -> workspace before any mutation or storage side effect.
  const normalizedItemId = asText(itemId);
  if (!normalizedItemId) return null;
  const result = await selectFirstAvailable([
    `case_items?select=*&id=eq.${encodeURIComponent(normalizedItemId)}&limit=1`,
  ]);
  const rows = Array.isArray(result.data) ? result.data : [];
  return (rows[0] || null) as Record<string, unknown> | null;
}

export async function requireCaseItemInCase(itemId: string, caseId: string) {
  const normalizedItemId = asText(itemId);
  const normalizedCaseId = asText(caseId);
  if (!normalizedItemId || !normalizedCaseId) {
    throw new RequestAuthError(404, 'CASE_ITEM_NOT_FOUND');
  }

  const result = await selectFirstAvailable([
    `case_items?select=*&id=eq.${encodeURIComponent(normalizedItemId)}&case_id=eq.${encodeURIComponent(normalizedCaseId)}&limit=1`,
  ]);
  const rows = Array.isArray(result.data) ? result.data : [];
  const row = (rows[0] || null) as Record<string, unknown> | null;
  if (!row) throw new RequestAuthError(404, 'CASE_ITEM_NOT_FOUND');
  return row;
}

export async function requireScopedCaseItem(itemId: string, caseId: string, workspaceId: string) {
  await requireScopedRow('cases', caseId, workspaceId, 'CASE_NOT_FOUND');
  return requireCaseItemInCase(itemId, caseId);
}

export async function updateCaseItemInCase(itemId: string, caseId: string, payload: Record<string, unknown>) {
  return supabaseRequest(
    `case_items?id=eq.${encodeURIComponent(asText(itemId))}&case_id=eq.${encodeURIComponent(asText(caseId))}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  );
}

export async function deleteCaseItemInCase(itemId: string, caseId: string) {
  return supabaseRequest(
    `case_items?id=eq.${encodeURIComponent(asText(itemId))}&case_id=eq.${encodeURIComponent(asText(caseId))}`,
    { method: 'DELETE', headers: { Prefer: 'return=representation' } },
  );
}
