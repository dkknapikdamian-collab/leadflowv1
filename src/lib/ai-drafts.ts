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
  remoteSynced?: boolean;
};

const STORAGE_PREFIX = 'closeflow:ai-lead-drafts:v1';
export const AI_DRAFTS_SUPABASE_SYNC_STAGE13_MARKER = 'AI_DRAFTS_SUPABASE_SYNC_STAGE13';

function getStorageKey() {
  const auth = getClientAuthSnapshot();
  const userKey = auth.uid || auth.email || 'anonymous';
  return STORAGE_PREFIX + ':' + userKey;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
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
    provider: typeof row.provider === 'string' ? row.provider : 'local',
    source: normalizeSource(row.source),
    status,
    createdAt,
    updatedAt,
    expiresAt: typeof row.expiresAt === 'string' ? row.expiresAt : typeof row.expires_at === 'string' ? row.expires_at : null,
    confirmedAt: typeof row.confirmedAt === 'string' ? row.confirmedAt : typeof row.confirmed_at === 'string' ? row.confirmed_at : null,
    cancelledAt: typeof row.cancelledAt === 'string' ? row.cancelledAt : typeof row.cancelled_at === 'string' ? row.cancelled_at : null,
    convertedAt: typeof row.convertedAt === 'string' ? row.convertedAt : typeof row.converted_at === 'string' ? row.converted_at : null,
    remoteSynced: Boolean(row.remoteSynced || row.workspaceId || row.workspace_id),
  };
}

export function getAiLeadDrafts() {
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

function persistAiLeadDrafts(drafts: AiLeadDraft[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(), JSON.stringify(drafts));
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

function mergeRemoteAndLocalDrafts(remoteDrafts: AiLeadDraft[], localDrafts: AiLeadDraft[]) {
  const remoteKeys = new Set(remoteDrafts.map((draft) => draft.id));
  const localOnlyDrafts = localDrafts.filter((draft) => {
    if (!draft.rawText && draft.status === 'draft') return false;
    if (remoteKeys.has(draft.id)) return false;
    return !draft.remoteSynced;
  });

  return dedupeDrafts([...remoteDrafts, ...localOnlyDrafts]).slice(0, 300);
}

async function pushAiLeadDraftToSupabase(draft: AiLeadDraft) {
  const remote = await createAiDraftInSupabase({
    rawText: draft.rawText,
    parsedDraft: draft.parsedDraft || null,
    source: draft.source,
    provider: draft.provider || 'local',
    type: draft.type || 'lead',
    status: draft.status,
  });

  const normalized = normalizeDraft(remote);
  if (!normalized) return draft;

  const current = getAiLeadDrafts().filter((entry) => entry.id !== draft.id);
  persistAiLeadDrafts(dedupeDrafts([normalized, ...current]).slice(0, 300));
  return normalized;
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
    provider: 'local',
    source: input.source || 'manual',
    status: 'draft' as const,
    createdAt: now,
    updatedAt: now,
    convertedAt: null,
    remoteSynced: false,
  };
}

export async function syncLocalAiDraftsToSupabase() {
  const localDrafts = getAiLeadDrafts().filter((draft) => draft.status === 'draft' && draft.rawText && !draft.remoteSynced);
  if (!localDrafts.length) return [] as AiLeadDraft[];

  const synced: AiLeadDraft[] = [];
  for (const draft of localDrafts) {
    try {
      const remote = await createAiDraftInSupabase({
        rawText: draft.rawText,
        parsedDraft: draft.parsedDraft || null,
        source: draft.source,
        provider: draft.provider || 'local',
        type: draft.type || 'lead',
        status: draft.status,
      });
      const normalized = normalizeDraft(remote);
      if (normalized) synced.push(normalized);
    } catch {
      // Supabase may be unavailable locally. Local fallback remains the safety net.
    }
  }

  if (synced.length) {
    const localIds = new Set(localDrafts.map((draft) => draft.id));
    const remaining = getAiLeadDrafts().filter((draft) => !localIds.has(draft.id));
    persistAiLeadDrafts(dedupeDrafts([...synced, ...remaining]));
  }

  return synced;
}

export async function getAiLeadDraftsAsync() {
  const localDrafts = getAiLeadDrafts();

  try {
    if (localDrafts.some((draft) => draft.status === 'draft' && draft.rawText && !draft.remoteSynced)) {
      await syncLocalAiDraftsToSupabase();
    }

    const latestLocalDrafts = getAiLeadDrafts();
    const remoteDrafts = await tryFetchRemoteDrafts();
    const mergedDrafts = mergeRemoteAndLocalDrafts(remoteDrafts, latestLocalDrafts);

    if (mergedDrafts.length) {
      persistAiLeadDrafts(mergedDrafts);
      return mergedDrafts;
    }
  } catch {
    // Keep local mode for offline/demo/dev.
  }

  return localDrafts;
}

export function saveAiLeadDraft(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
}) {
  const draft = createLocalAiLeadDraft(input);
  const drafts = getAiLeadDrafts();
  persistAiLeadDrafts([draft, ...drafts].slice(0, 300));

  void pushAiLeadDraftToSupabase(draft).catch(() => null);

  return draft;
}

export async function saveAiLeadDraftAsync(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
}) {
  const draft = createLocalAiLeadDraft(input);
  const drafts = getAiLeadDrafts();
  persistAiLeadDrafts([draft, ...drafts].slice(0, 300));

  try {
    return await pushAiLeadDraftToSupabase(draft);
  } catch {
    return draft;
  }
}

export function updateAiLeadDraft(id: string, patch: Partial<Pick<AiLeadDraft, 'rawText' | 'parsedDraft' | 'status' | 'convertedAt'>>) {
  const drafts = getAiLeadDrafts();
  const now = new Date().toISOString();
  const nextDrafts = drafts.map((draft) => draft.id === id
    ? {
        ...draft,
        ...patch,
        rawText: typeof patch.rawText === 'string' ? patch.rawText.trim() : draft.rawText,
        updatedAt: now,
      }
    : draft);
  persistAiLeadDrafts(nextDrafts);
  return nextDrafts.find((draft) => draft.id === id) || null;
}

export async function updateAiLeadDraftAsync(id: string, patch: Partial<Pick<AiLeadDraft, 'rawText' | 'parsedDraft' | 'status' | 'convertedAt'>>) {
  const local = updateAiLeadDraft(id, patch);
  try {
    const remote = await updateAiDraftInSupabase({
      id,
      rawText: patch.rawText,
      parsedDraft: patch.parsedDraft,
      status: patch.status,
      convertedAt: patch.convertedAt,
    });
    return normalizeDraft(remote) || local;
  } catch {
    return local;
  }
}

export function markAiLeadDraftConverted(id: string) {
  return updateAiLeadDraft(id, {
    status: 'converted',
    convertedAt: new Date().toISOString(),
  });
}

export async function markAiLeadDraftConvertedAsync(id: string) {
  const convertedAt = new Date().toISOString();
  const local = updateAiLeadDraft(id, { status: 'converted', convertedAt, rawText: '' });
  try {
    const remote = await updateAiDraftInSupabase({ id, status: 'converted', convertedAt, action: 'convert' } as any);
    return normalizeDraft(remote) || local;
  } catch {
    return local;
  }
}

export function archiveAiLeadDraft(id: string) {
  return updateAiLeadDraft(id, { status: 'archived' });
}

export async function archiveAiLeadDraftAsync(id: string) {
  const local = archiveAiLeadDraft(id);
  try {
    const remote = await updateAiDraftInSupabase({ id, status: 'archived', action: 'archive' } as any);
    return normalizeDraft(remote) || local;
  } catch {
    return local;
  }
}

export function deleteAiLeadDraft(id: string) {
  const drafts = getAiLeadDrafts();
  const nextDrafts = drafts.filter((draft) => draft.id !== id);
  persistAiLeadDrafts(nextDrafts);
}

export async function deleteAiLeadDraftAsync(id: string) {
  deleteAiLeadDraft(id);
  try {
    await deleteAiDraftFromSupabase(id);
  } catch {
    // Local fallback already removed it from the visible inbox.
  }
}

export function countAiLeadDrafts(status: AiLeadDraftStatus = 'draft') {
  return getAiLeadDrafts().filter((draft) => draft.status === status).length;
}

export async function countAiLeadDraftsAsync(status: AiLeadDraftStatus = 'draft') {
  const drafts = await getAiLeadDraftsAsync();
  return drafts.filter((draft) => draft.status === status).length;
}
