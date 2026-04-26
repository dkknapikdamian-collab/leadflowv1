import { getClientAuthSnapshot } from './client-auth';

export type AiLeadDraftStatus = 'draft' | 'converted' | 'archived';
export type AiLeadDraftSource = 'quick_capture' | 'today_assistant' | 'manual';

export type AiLeadDraft = {
  id: string;
  kind: 'lead_capture';
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source: AiLeadDraftSource;
  status: AiLeadDraftStatus;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string | null;
};

const STORAGE_PREFIX = 'closeflow:ai-lead-drafts:v1';

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

function normalizeDraft(input: unknown): AiLeadDraft | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Partial<AiLeadDraft>;
  const rawText = String(row.rawText || '').trim();
  if (!rawText) return null;

  const createdAt = String(row.createdAt || new Date().toISOString());
  const updatedAt = String(row.updatedAt || createdAt);
  const status = row.status === 'converted' || row.status === 'archived' ? row.status : 'draft';
  const source = row.source === 'today_assistant' || row.source === 'manual' ? row.source : 'quick_capture';

  return {
    id: String(row.id || makeId()),
    kind: 'lead_capture',
    rawText,
    parsedDraft: row.parsedDraft && typeof row.parsedDraft === 'object' ? row.parsedDraft as Record<string, unknown> : null,
    source,
    status,
    createdAt,
    updatedAt,
    convertedAt: row.convertedAt || null,
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

export function saveAiLeadDraft(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
}) {
  const rawText = String(input.rawText || '').trim();
  if (!rawText) throw new Error('AI_DRAFT_RAW_TEXT_REQUIRED');

  const now = new Date().toISOString();
  const draft: AiLeadDraft = {
    id: makeId(),
    kind: 'lead_capture',
    rawText,
    parsedDraft: input.parsedDraft || null,
    source: input.source || 'manual',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    convertedAt: null,
  };

  const drafts = getAiLeadDrafts();
  persistAiLeadDrafts([draft, ...drafts].slice(0, 100));
  return draft;
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

export function markAiLeadDraftConverted(id: string) {
  return updateAiLeadDraft(id, {
    status: 'converted',
    convertedAt: new Date().toISOString(),
  });
}

export function archiveAiLeadDraft(id: string) {
  return updateAiLeadDraft(id, { status: 'archived' });
}

export function deleteAiLeadDraft(id: string) {
  const drafts = getAiLeadDrafts();
  const nextDrafts = drafts.filter((draft) => draft.id !== id);
  persistAiLeadDrafts(nextDrafts);
}

export function countAiLeadDrafts(status: AiLeadDraftStatus = 'draft') {
  return getAiLeadDrafts().filter((draft) => draft.status === status).length;
}
