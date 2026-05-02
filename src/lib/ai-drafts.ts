// AI_DRAFT_CONFIRM_RECORDS_STAGE25_LIB
// AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11
import { getClientAuthSnapshot } from './client-auth';
import {
  createAiDraftInSupabase,
  deleteAiDraftFromSupabase,
  fetchAiDraftsFromSupabase,
  updateAiDraftInSupabase,
} from './supabase-fallback';

export type AiLeadDraftStatus = 'draft' | 'converted' | 'archived';
export type AiLeadDraftSource = 'quick_capture' | 'today_assistant' | 'manual';

export type AiLeadDraft = {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  type?: 'lead' | 'task' | 'event' | 'note';
  kind: 'lead_capture';
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  parsedData?: Record<string, unknown> | null;
  provider?: string;
  source: AiLeadDraftSource;
  status: AiLeadDraftStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  convertedAt?: string | null;
  linkedRecordId?: string | null;
  linkedRecordType?: 'lead' | 'task' | 'event' | 'note' | null;
  remoteSynced?: boolean;
};

const STORAGE_PREFIX = 'closeflow:ai-lead-drafts:v1';
export const AI_DRAFTS_SUPABASE_SYNC_STAGE13_MARKER = 'AI_DRAFTS_SUPABASE_SYNC_STAGE13';
export const AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11 = true;

function getStorageKey() {
  const auth = getClientAuthSnapshot();
  const userKey = auth.uid || auth.email || 'anonymous';
  return STORAGE_PREFIX + ':' + userKey;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function getViteEnv() {
  return (((import.meta as any)?.env || {}) as Record<string, unknown>);
}

function isProductionRuntime() {
  const env = getViteEnv();
  return env.PROD === true || String(env.MODE || '').toLowerCase() === 'production';
}

function canUseDevLocalDraftFallback() {
  const env = getViteEnv();
  if (isProductionRuntime()) return false;
  return env.DEV === true || String(env.VITE_AI_DRAFTS_DEV_LOCAL_FALLBACK || '').toLowerCase() === 'true';
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'ai_draft_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
}

function normalizeStatus(value: unknown): AiLeadDraftStatus {
  if (value === 'converted') return 'converted';
  if (value === 'archived' || value === 'cancelled' || value === 'expired') return 'archived';
  return 'draft';
}

function normalizeSource(value: unknown): AiLeadDraftSource {
  if (value === 'today_assistant') return 'today_assistant';
  if (value === 'manual') return 'manual';
  return 'quick_capture';
}

function normalizeDraft(input: unknown): AiLeadDraft | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Record<string, unknown>;
  const rawText = String(row.rawText ?? row.raw_text ?? '').trim();
  const status = normalizeStatus(row.status);
  const createdAt = String(row.createdAt ?? row.created_at ?? new Date().toISOString());
  const updatedAt = String(row.updatedAt ?? row.updated_at ?? createdAt);
  const parsed = row.parsedDraft ?? row.parsedData ?? row.parsed_data;

  if (!rawText && status === 'draft') return null;

  return {
    id: String(row.id || makeId()),
    workspaceId: typeof row.workspaceId === 'string' ? row.workspaceId : typeof row.workspace_id === 'string' ? row.workspace_id : null,
    userId: typeof row.userId === 'string' ? row.userId : typeof row.user_id === 'string' ? row.user_id : null,
    type: row.type === 'task' || row.type === 'event' || row.type === 'note' ? row.type : 'lead',
    kind: 'lead_capture',
    rawText,
    parsedDraft: parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null,
    parsedData: parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null,
    provider: typeof row.provider === 'string' ? row.provider : 'supabase',
    source: normalizeSource(row.source),
    status,
    createdAt,
    updatedAt,
    expiresAt: typeof row.expiresAt === 'string' ? row.expiresAt : typeof row.expires_at === 'string' ? row.expires_at : null,
    confirmedAt: typeof row.confirmedAt === 'string' ? row.confirmedAt : typeof row.confirmed_at === 'string' ? row.confirmed_at : null,
    cancelledAt: typeof row.cancelledAt === 'string' ? row.cancelledAt : typeof row.cancelled_at === 'string' ? row.cancelled_at : null,
    convertedAt: typeof row.convertedAt === 'string' ? row.convertedAt : typeof row.converted_at === 'string' ? row.converted_at : null,
    linkedRecordId: typeof row.linkedRecordId === 'string' ? row.linkedRecordId : typeof row.linked_record_id === 'string' ? row.linked_record_id : typeof (parsed as any)?.linkedRecordId === 'string' ? (parsed as any).linkedRecordId : null,
    linkedRecordType: row.linkedRecordType === 'lead' || row.linkedRecordType === 'task' || row.linkedRecordType === 'event' || row.linkedRecordType === 'note'
      ? row.linkedRecordType
      : row.linked_record_type === 'lead' || row.linked_record_type === 'task' || row.linked_record_type === 'event' || row.linked_record_type === 'note'
        ? row.linked_record_type as any
        : (parsed as any)?.linkedRecordType === 'lead' || (parsed as any)?.linkedRecordType === 'task' || (parsed as any)?.linkedRecordType === 'event' || (parsed as any)?.linkedRecordType === 'note'
          ? (parsed as any).linkedRecordType
          : null,
    remoteSynced: true,
  };
}

function readLocalAiDraftsUnsafe() {
  if (!canUseStorage()) return [] as AiLeadDraft[];

  try {
    const raw = window.localStorage.getItem(getStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map(normalizeDraft).filter(Boolean) as AiLeadDraft[]
      : [];
  } catch {
    return [] as AiLeadDraft[];
  }
}

function sanitizeDraftForLocalCache(draft: AiLeadDraft): AiLeadDraft {
  const sanitized = {
    ...draft,
    parsedData: draft.parsedDraft || draft.parsedData || null,
  };

  if (sanitized.status !== 'draft') {
    return {
      ...sanitized,
      rawText: '',
      parsedDraft: {
        ...(sanitized.parsedDraft || {}),
        rawTextRemoved: true,
      },
      parsedData: {
        ...(sanitized.parsedData || {}),
        rawTextRemoved: true,
      },
    };
  }

  return sanitized;
}

function persistAiLeadDrafts(drafts: AiLeadDraft[]) {
  if (!canUseDevLocalDraftFallback() || !canUseStorage()) return;
  const sanitized = drafts.map(sanitizeDraftForLocalCache).slice(0, 300);
  window.localStorage.setItem(getStorageKey(), JSON.stringify(sanitized));
}

function removeAiDraftFromLocalCache(id: string) {
  if (!canUseStorage()) return;
  const next = readLocalAiDraftsUnsafe().filter((draft) => draft.id !== id);
  if (!canUseDevLocalDraftFallback()) {
    window.localStorage.setItem(getStorageKey(), JSON.stringify(next.map((draft) => ({ ...draft, rawText: '' }))));
    return;
  }
  persistAiLeadDrafts(next);
}

function replaceAiDraftInLocalCache(draft: AiLeadDraft) {
  if (!canUseDevLocalDraftFallback() || !canUseStorage()) return;
  const current = readLocalAiDraftsUnsafe().filter((entry) => entry.id !== draft.id);
  persistAiLeadDrafts([draft, ...current]);
}

function clearAiDraftLocalRawText(id: string) {
  if (!canUseStorage()) return;
  const next = readLocalAiDraftsUnsafe().map((draft) => draft.id === id ? sanitizeDraftForLocalCache({ ...draft, rawText: '', status: draft.status }) : draft);
  window.localStorage.setItem(getStorageKey(), JSON.stringify(next));
}

function clearProductionLocalDrafts() {
  if (!canUseStorage() || canUseDevLocalDraftFallback()) return;
  window.localStorage.removeItem(getStorageKey());
}

function dedupeDrafts(drafts: AiLeadDraft[]) {
  const seen = new Set<string>();
  const result: AiLeadDraft[] = [];

  for (const draft of drafts) {
    const key = draft.id || `${draft.createdAt}:${draft.rawText}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(draft);
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function tryFetchRemoteDrafts() {
  const rows = await fetchAiDraftsFromSupabase({ limit: 300 });
  return Array.isArray(rows)
    ? rows.map(normalizeDraft).filter(Boolean) as AiLeadDraft[]
    : [];
}

function createLocalAiLeadDraft(input: { rawText: string; parsedDraft?: Record<string, unknown> | null; source?: AiLeadDraftSource; type?: AiLeadDraft['type']; }) {
  const rawText = String(input.rawText || '').trim();
  if (!rawText) throw new Error('AI_DRAFT_RAW_TEXT_REQUIRED');

  const now = new Date().toISOString();
  return {
    id: makeId(),
    kind: 'lead_capture' as const,
    type: input.type || 'lead',
    rawText,
    parsedDraft: input.parsedDraft || null,
    parsedData: input.parsedDraft || null,
    provider: 'local_dev_fallback',
    source: input.source || 'manual',
    status: 'draft' as const,
    createdAt: now,
    updatedAt: now,
    convertedAt: null,
    remoteSynced: false,
  };
}

async function createAiLeadDraftInSupabaseRequired(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
  type?: AiLeadDraft['type'];
  status?: AiLeadDraftStatus;
}) {
  const rawText = String(input.rawText || '').trim();
  if (!rawText) throw new Error('AI_DRAFT_RAW_TEXT_REQUIRED');

  const remote = await createAiDraftInSupabase({
    rawText,
    parsedDraft: input.parsedDraft || null,
    source: input.source || 'manual',
    provider: 'supabase',
    type: input.type || 'lead',
    status: input.status || 'draft',
  });

  const normalized = normalizeDraft(remote);
  if (!normalized) throw new Error('AI_DRAFT_SUPABASE_RESPONSE_INVALID');

  replaceAiDraftInLocalCache(normalized);
  return normalized;
}

export function getAiLeadDrafts() {
  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return [] as AiLeadDraft[];
  }
  return dedupeDrafts(readLocalAiDraftsUnsafe()).slice(0, 300);
}

export async function syncLocalAiDraftsToSupabase() {
  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return [] as AiLeadDraft[];
  }

  const localDrafts = readLocalAiDraftsUnsafe().filter((draft) => draft.status === 'draft' && draft.rawText && !draft.remoteSynced);
  if (!localDrafts.length) return [] as AiLeadDraft[];

  const synced: AiLeadDraft[] = [];
  for (const draft of localDrafts) {
    const remote = await createAiLeadDraftInSupabaseRequired({
      rawText: draft.rawText,
      parsedDraft: draft.parsedDraft || null,
      source: draft.source,
      type: draft.type || 'lead',
      status: draft.status,
    });
    synced.push(remote);
  }

  const syncedIds = new Set(localDrafts.map((draft) => draft.id));
  const remaining = readLocalAiDraftsUnsafe().filter((draft) => !syncedIds.has(draft.id));
  persistAiLeadDrafts(dedupeDrafts([...synced, ...remaining]));
  return synced;
}

export async function getAiLeadDraftsAsync() {
  const remoteDrafts = await tryFetchRemoteDrafts();

  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return remoteDrafts;
  }

  const localDrafts = readLocalAiDraftsUnsafe();
  const unsyncedLocalDrafts = localDrafts.filter((draft) => draft.status === 'draft' && draft.rawText && !draft.remoteSynced);

  if (unsyncedLocalDrafts.length) {
    const synced = await syncLocalAiDraftsToSupabase().catch(() => []);
    const latestLocalDrafts = readLocalAiDraftsUnsafe().filter((draft) => !unsyncedLocalDrafts.some((entry) => entry.id === draft.id));
    const merged = dedupeDrafts([...remoteDrafts, ...synced, ...latestLocalDrafts]).slice(0, 300);
    persistAiLeadDrafts(merged);
    return merged;
  }

  const remoteKeys = new Set(remoteDrafts.map((draft) => draft.id));
  const localOnly = localDrafts.filter((draft) => !remoteKeys.has(draft.id) && !draft.remoteSynced);
  const merged = dedupeDrafts([...remoteDrafts, ...localOnly]).slice(0, 300);
  persistAiLeadDrafts(merged);
  return merged;
}

export function saveAiLeadDraft(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
  type?: AiLeadDraft['type'];
}) {
  if (!canUseDevLocalDraftFallback()) {
    throw new Error('AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC');
  }

  const draft = createLocalAiLeadDraft(input);
  persistAiLeadDrafts([draft, ...readLocalAiDraftsUnsafe()]);
  void createAiLeadDraftInSupabaseRequired({ ...input, status: 'draft' })
    .then((remote) => replaceAiDraftInLocalCache(remote))
    .catch(() => null);

  return draft;
}

export async function saveAiLeadDraftAsync(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
  type?: AiLeadDraft['type'];
}) {
  try {
    return await createAiLeadDraftInSupabaseRequired({ ...input, status: 'draft' });
  } catch (error) {
    if (canUseDevLocalDraftFallback()) {
      const draft = createLocalAiLeadDraft(input);
      persistAiLeadDrafts([draft, ...readLocalAiDraftsUnsafe()]);
      return draft;
    }
    throw error;
  }
}

export function updateAiLeadDraft(id: string, patch: Partial<AiLeadDraft>) {
  if (!canUseDevLocalDraftFallback()) {
    throw new Error('AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC');
  }

  const drafts = readLocalAiDraftsUnsafe();
  const now = new Date().toISOString();
  const nextDrafts = drafts.map((draft) => draft.id === id
    ? sanitizeDraftForLocalCache({
        ...draft,
        ...patch,
        rawText: typeof patch.rawText === 'string' ? patch.rawText.trim() : draft.rawText,
        updatedAt: now,
      })
    : draft);
  persistAiLeadDrafts(nextDrafts);
  return nextDrafts.find((draft) => draft.id === id) || null;
}

export async function updateAiLeadDraftAsync(id: string, patch: Partial<AiLeadDraft>) {
  try {
    const remote = await updateAiDraftInSupabase({
      id,
      rawText: patch.rawText,
      parsedDraft: patch.parsedDraft,
      status: patch.status,
      convertedAt: patch.convertedAt,
      confirmedAt: patch.confirmedAt,
      cancelledAt: patch.cancelledAt,
      linkedRecordId: patch.linkedRecordId,
      linkedRecordType: patch.linkedRecordType,
    } as any);

    const normalized = normalizeDraft(remote);
    if (normalized) {
      if (normalized.status !== 'draft') clearAiDraftLocalRawText(id);
      replaceAiDraftInLocalCache(normalized);
    } else if (patch.status === 'converted' || patch.status === 'archived' || patch.rawText === '') {
      clearAiDraftLocalRawText(id);
    }

    return normalized;
  } catch (error) {
    if (canUseDevLocalDraftFallback()) {
      return updateAiLeadDraft(id, patch);
    }
    throw error;
  }
}

export function markAiLeadDraftConverted(id: string) {
  return updateAiLeadDraft(id, {
    status: 'converted',
    convertedAt: new Date().toISOString(),
    rawText: '',
  });
}

export async function markAiLeadDraftConvertedAsync(id: string, metadata?: { linkedRecordId?: string | null; linkedRecordType?: AiLeadDraft['linkedRecordType']; parsedDraft?: Record<string, unknown> | null }) {
  const convertedAt = new Date().toISOString();
  const result = await updateAiLeadDraftAsync(id, {
    status: 'converted',
    convertedAt,
    confirmedAt: convertedAt,
    rawText: '',
    parsedDraft: metadata?.parsedDraft || undefined,
    parsedData: metadata?.parsedDraft || undefined,
    linkedRecordId: metadata?.linkedRecordId || null,
    linkedRecordType: metadata?.linkedRecordType || null,
  } as any);

  clearAiDraftLocalRawText(id);
  return result;
}

export function archiveAiLeadDraft(id: string) {
  return updateAiLeadDraft(id, { status: 'archived', rawText: '', cancelledAt: new Date().toISOString() });
}

export async function archiveAiLeadDraftAsync(id: string) {
  const cancelledAt = new Date().toISOString();
  const result = await updateAiLeadDraftAsync(id, { status: 'archived', rawText: '', cancelledAt, action: 'archive' } as any);
  clearAiDraftLocalRawText(id);
  return result;
}

export function deleteAiLeadDraft(id: string) {
  if (!canUseDevLocalDraftFallback()) {
    throw new Error('AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC');
  }
  removeAiDraftFromLocalCache(id);
}

export async function deleteAiLeadDraftAsync(id: string) {
  await deleteAiDraftFromSupabase(id);
  removeAiDraftFromLocalCache(id);
}

export function countAiLeadDrafts(status: AiLeadDraftStatus = 'draft') {
  if (!canUseDevLocalDraftFallback()) return 0;
  return getAiLeadDrafts().filter((draft) => draft.status === status).length;
}

export async function countAiLeadDraftsAsync(status: AiLeadDraftStatus = 'draft') {
  const drafts = await getAiLeadDraftsAsync();
  return drafts.filter((draft) => draft.status === status).length;
}

void AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11;
