// AI_DRAFT_CONFIRM_BRIDGE_STAGE4
// Shared AI Drafts pipeline. Supabase is the source of truth in normal runtime.
// Local storage is only a dev fallback and compatibility layer for older assistant components.

import { getClientAuthSnapshot } from "./client-auth";
import { normalizeDraftStatus as normalizeAppDraftStatus } from "./drafts";
import {
  createAiDraftInSupabase,
  deleteAiDraftFromSupabase,
  fetchAiDraftsFromSupabase,
  updateAiDraftInSupabase,
} from "./supabase-fallback";

export type AiLeadDraftStatus = "draft" | "converted" | "archived";
export type AiLeadDraftSource = "quick_capture" | "today_assistant" | "manual";
export type AiLeadDraftType = "lead" | "task" | "event" | "note";

export type AiLeadDraft = {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  type?: AiLeadDraftType;
  kind: "lead_capture";
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
  linkedRecordType?: "lead" | "task" | "event" | "note" | null;
  remoteSynced?: boolean;
};

export type AiDraftStatus = "pending_review" | "confirmed" | "cancelled" | "expired" | "failed";
export type AiDraftType = "lead" | "task" | "event" | "note" | "reply_draft";
export type AiDraft = {
  id: string;
  draftType: AiDraftType;
  title: string;
  rawText?: string | null;
  status: AiDraftStatus;
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  parsedData?: Record<string, unknown>;
  warnings?: string[];
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
};

const STORAGE_PREFIX = "closeflow:ai-lead-drafts:v1";
const LEGACY_STAGE3_STORAGE_KEY = "closeflow.aiDrafts.pendingReview.v1";
export const AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11 = true;
export const AI_DRAFT_CONFIRM_BRIDGE_STAGE4 = true;

function getStorageKey() {
  try {
    const auth = getClientAuthSnapshot();
    const userKey = auth.uid || auth.email || "anonymous";
    return `${STORAGE_PREFIX}:${userKey}`;
  } catch {
    return `${STORAGE_PREFIX}:anonymous`;
  }
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function getViteEnv() {
  return ((((import.meta as any)?.env || {}) as Record<string, unknown>));
}

function isProductionRuntime() {
  const env = getViteEnv();
  return env.PROD === true || String(env.MODE || "").toLowerCase() === "production";
}

function canUseDevLocalDraftFallback() {
  const env = getViteEnv();
  if (isProductionRuntime()) return false;
  return env.DEV === true || String(env.VITE_AI_DRAFTS_DEV_LOCAL_FALLBACK || "").toLowerCase() === "true";
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `ai_draft_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function stringOrNull(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function normalizeStatus(value: unknown): AiLeadDraftStatus {
  const appStatus = normalizeAppDraftStatus(value);
  if (appStatus === "confirmed") return "converted";
  if (appStatus === "cancelled" || appStatus === "expired" || appStatus === "failed") return "archived";
  return "draft";
}

function normalizeSource(value: unknown): AiLeadDraftSource {
  if (value === "today_assistant") return "today_assistant";
  if (value === "manual") return "manual";
  return "quick_capture";
}

function normalizeType(value: unknown): AiLeadDraftType {
  if (value === "task" || value === "event" || value === "note") return value;
  return "lead";
}

function normalizeLinkedRecordType(value: unknown): AiLeadDraft["linkedRecordType"] {
  if (value === "lead" || value === "task" || value === "event" || value === "note") return value;
  return null;
}

function normalizeDraft(input: unknown): AiLeadDraft | null {
  const row = asObject(input);
  if (!row) return null;

  const parsed = asObject(row.parsedDraft ?? row.parsedData ?? row.parsed_data) || null;
  const status = normalizeStatus(row.status);
  const rawText = stringOrNull(row.rawText ?? row.raw_text) || "";
  const createdAt = stringOrNull(row.createdAt ?? row.created_at) || new Date().toISOString();
  const updatedAt = stringOrNull(row.updatedAt ?? row.updated_at) || createdAt;

  if (!rawText && status === "draft") return null;

  return {
    id: stringOrNull(row.id) || makeId(),
    workspaceId: stringOrNull(row.workspaceId ?? row.workspace_id),
    userId: stringOrNull(row.userId ?? row.user_id),
    type: normalizeType(row.type ?? row.draftType ?? row.draft_type ?? parsed?.draftType ?? parsed?.type),
    kind: "lead_capture",
    rawText,
    parsedDraft: parsed,
    parsedData: parsed,
    provider: stringOrNull(row.provider) || "supabase",
    source: normalizeSource(row.source),
    status,
    createdAt,
    updatedAt,
    expiresAt: stringOrNull(row.expiresAt ?? row.expires_at),
    confirmedAt: stringOrNull(row.confirmedAt ?? row.confirmed_at),
    cancelledAt: stringOrNull(row.cancelledAt ?? row.cancelled_at),
    convertedAt: stringOrNull(row.convertedAt ?? row.converted_at),
    linkedRecordId: stringOrNull(row.linkedRecordId ?? row.linked_record_id ?? parsed?.linkedRecordId),
    linkedRecordType: normalizeLinkedRecordType(row.linkedRecordType ?? row.linked_record_type ?? parsed?.linkedRecordType),
    remoteSynced: row.remoteSynced !== false,
  };
}

function sanitizeDraftForLocalCache(draft: AiLeadDraft): AiLeadDraft {
  const parsed = draft.parsedDraft || draft.parsedData || null;
  if (draft.status === "draft") return { ...draft, parsedDraft: parsed, parsedData: parsed };
  return {
    ...draft,
    rawText: "",
    parsedDraft: { ...(parsed || {}), rawTextRemoved: true },
    parsedData: { ...(parsed || {}), rawTextRemoved: true },
  };
}

function readLocalAiDraftsUnsafe(): AiLeadDraft[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed.map(normalizeDraft).filter(Boolean) as AiLeadDraft[]) : [];
  } catch {
    return [];
  }
}

function readLegacyStage3DraftsUnsafe(): AiLeadDraft[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_STAGE3_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        const row = asObject(entry);
        if (!row) return null;
        const rawText = stringOrNull(row.rawText) || stringOrNull(row.title) || "";
        if (!rawText) return null;
        const parsedDraft = asObject(row.parsedData) || {};
        return normalizeDraft({
          id: row.id,
          type: row.draftType,
          rawText,
          parsedDraft: {
            ...parsedDraft,
            title: stringOrNull(row.title) || parsedDraft.title || rawText,
            scheduledAt: row.scheduledAt ?? parsedDraft.scheduledAt ?? null,
            startAt: row.startAt ?? parsedDraft.startAt ?? null,
            endAt: row.endAt ?? parsedDraft.endAt ?? null,
            migratedFrom: "STAGE3_LOCAL_STORAGE",
          },
          source: "today_assistant",
          provider: "stage3_legacy_local_migration",
          status: row.status === "confirmed" ? "converted" : row.status === "cancelled" ? "archived" : "draft",
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          confirmedAt: row.confirmedAt,
          cancelledAt: row.cancelledAt,
          remoteSynced: false,
        });
      })
      .filter(Boolean) as AiLeadDraft[];
  } catch {
    return [];
  }
}

function persistAiLeadDrafts(drafts: AiLeadDraft[]) {
  if (!canUseDevLocalDraftFallback() || !canUseStorage()) return;
  window.localStorage.setItem(getStorageKey(), JSON.stringify(drafts.map(sanitizeDraftForLocalCache).slice(0, 300)));
}

function clearAiDraftLocalRawText(id: string) {
  if (!canUseStorage()) return;
  const next = readLocalAiDraftsUnsafe().map((draft) => (draft.id === id ? sanitizeDraftForLocalCache({ ...draft, rawText: "" }) : draft));
  window.localStorage.setItem(getStorageKey(), JSON.stringify(next));
}

function removeAiDraftFromLocalCache(id: string) {
  if (!canUseStorage()) return;
  const next = readLocalAiDraftsUnsafe().filter((draft) => draft.id !== id);
  window.localStorage.setItem(getStorageKey(), JSON.stringify(next.map(sanitizeDraftForLocalCache)));
}

function replaceAiDraftInLocalCache(draft: AiLeadDraft) {
  if (!canUseDevLocalDraftFallback() || !canUseStorage()) return;
  const current = readLocalAiDraftsUnsafe().filter((entry) => entry.id !== draft.id);
  persistAiLeadDrafts([draft, ...current]);
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

function clearProductionLocalDrafts() {
  if (!canUseStorage() || canUseDevLocalDraftFallback()) return;
  window.localStorage.removeItem(getStorageKey());
  window.localStorage.removeItem(LEGACY_STAGE3_STORAGE_KEY);
}

function createLocalAiLeadDraft(input: { rawText: string; parsedDraft?: Record<string, unknown> | null; source?: AiLeadDraftSource; type?: AiLeadDraftType }) {
  const rawText = String(input.rawText || "").trim();
  if (!rawText) throw new Error("AI_DRAFT_RAW_TEXT_REQUIRED");
  const now = new Date().toISOString();
  return {
    id: makeId(),
    kind: "lead_capture" as const,
    type: input.type || "lead",
    rawText,
    parsedDraft: input.parsedDraft || null,
    parsedData: input.parsedDraft || null,
    provider: "local_dev_fallback",
    source: input.source || "manual",
    status: "draft" as const,
    createdAt: now,
    updatedAt: now,
    convertedAt: null,
    remoteSynced: false,
  };
}

async function tryFetchRemoteDrafts() {
  const rows = await fetchAiDraftsFromSupabase({ limit: 300 });
  return Array.isArray(rows) ? (rows.map(normalizeDraft).filter(Boolean) as AiLeadDraft[]) : [];
}

async function createAiLeadDraftInSupabaseRequired(input: {
  rawText: string;
  parsedDraft?: Record<string, unknown> | null;
  source?: AiLeadDraftSource;
  type?: AiLeadDraftType;
  status?: AiLeadDraftStatus;
}) {
  const rawText = String(input.rawText || "").trim();
  if (!rawText) throw new Error("AI_DRAFT_RAW_TEXT_REQUIRED");

  const remote = await createAiDraftInSupabase({
    rawText,
    parsedDraft: input.parsedDraft || null,
    source: input.source || "manual",
    provider: input.source === "today_assistant" ? "assistant_query" : "supabase",
    type: input.type || "lead",
    status: input.status || "draft",
  });
  const normalized = normalizeDraft(remote);
  if (!normalized) throw new Error("AI_DRAFT_SUPABASE_RESPONSE_INVALID");
  replaceAiDraftInLocalCache(normalized);
  return normalized;
}

export function getAiLeadDrafts() {
  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return [] as AiLeadDraft[];
  }
  return dedupeDrafts([...readLocalAiDraftsUnsafe(), ...readLegacyStage3DraftsUnsafe()]).slice(0, 300);
}

export async function syncLocalAiDraftsToSupabase() {
  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return [] as AiLeadDraft[];
  }
  const localDrafts = dedupeDrafts([...readLocalAiDraftsUnsafe(), ...readLegacyStage3DraftsUnsafe()]).filter(
    (draft) => draft.status === "draft" && draft.rawText && !draft.remoteSynced,
  );
  const synced: AiLeadDraft[] = [];
  for (const draft of localDrafts) {
    const remote = await createAiLeadDraftInSupabaseRequired({
      rawText: draft.rawText,
      parsedDraft: draft.parsedDraft || draft.parsedData || null,
      source: draft.source,
      type: draft.type || "lead",
      status: "draft",
    });
    synced.push(remote);
  }
  persistAiLeadDrafts(dedupeDrafts([...synced, ...readLocalAiDraftsUnsafe()]));
  return synced;
}

export async function getAiLeadDraftsAsync() {
  const remoteDrafts = await tryFetchRemoteDrafts();
  if (!canUseDevLocalDraftFallback()) {
    clearProductionLocalDrafts();
    return remoteDrafts;
  }
  const localDrafts = dedupeDrafts([...readLocalAiDraftsUnsafe(), ...readLegacyStage3DraftsUnsafe()]);
  const unsynced = localDrafts.filter((draft) => draft.status === "draft" && draft.rawText && !draft.remoteSynced);
  if (unsynced.length) {
    const synced = await syncLocalAiDraftsToSupabase().catch(() => [] as AiLeadDraft[]);
    return dedupeDrafts([...remoteDrafts, ...synced, ...localDrafts]).slice(0, 300);
  }
  return dedupeDrafts([...remoteDrafts, ...localDrafts.filter((draft) => !draft.remoteSynced)]).slice(0, 300);
}

export function saveAiLeadDraft(input: { rawText: string; parsedDraft?: Record<string, unknown> | null; source?: AiLeadDraftSource; type?: AiLeadDraftType }) {
  if (!canUseDevLocalDraftFallback()) throw new Error("AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC");
  const draft = createLocalAiLeadDraft(input);
  persistAiLeadDrafts([draft, ...readLocalAiDraftsUnsafe()]);
  void createAiLeadDraftInSupabaseRequired({ ...input, status: "draft" })
    .then((remote) => replaceAiDraftInLocalCache(remote))
    .catch(() => null);
  return draft;
}

export async function saveAiLeadDraftAsync(input: { rawText: string; parsedDraft?: Record<string, unknown> | null; source?: AiLeadDraftSource; type?: AiLeadDraftType }) {
  try {
    return await createAiLeadDraftInSupabaseRequired({ ...input, status: "draft" });
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
  if (!canUseDevLocalDraftFallback()) throw new Error("AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC");
  const drafts = readLocalAiDraftsUnsafe();
  const now = new Date().toISOString();
  const nextDrafts = drafts.map((draft) =>
    draft.id === id
      ? sanitizeDraftForLocalCache({
          ...draft,
          ...patch,
          rawText: typeof patch.rawText === "string" ? patch.rawText.trim() : draft.rawText,
          updatedAt: now,
        })
      : draft,
  );
  persistAiLeadDrafts(nextDrafts);
  return nextDrafts.find((draft) => draft.id === id) || null;
}

export async function updateAiLeadDraftAsync(id: string, patch: Partial<AiLeadDraft>) {
  try {
    const remote = await updateAiDraftInSupabase({
      id,
      rawText: patch.rawText,
      parsedDraft: patch.parsedDraft || patch.parsedData,
      status: patch.status,
      convertedAt: patch.convertedAt,
      confirmedAt: patch.confirmedAt,
      cancelledAt: patch.cancelledAt,
      linkedRecordId: patch.linkedRecordId,
      linkedRecordType: patch.linkedRecordType,
      action: (patch as any).action,
    } as any);
    const normalized = normalizeDraft(remote);
    if (normalized) {
      if (normalized.status !== "draft") clearAiDraftLocalRawText(id);
      replaceAiDraftInLocalCache(normalized);
    } else if (patch.status === "converted" || patch.status === "archived" || patch.rawText === "") {
      clearAiDraftLocalRawText(id);
    }
    return normalized;
  } catch (error) {
    if (canUseDevLocalDraftFallback()) return updateAiLeadDraft(id, patch);
    throw error;
  }
}

export function markAiLeadDraftConverted(id: string) {
  return updateAiLeadDraft(id, { status: "converted", convertedAt: new Date().toISOString(), rawText: "" });
}

export async function markAiLeadDraftConvertedAsync(
  id: string,
  metadata?: { linkedRecordId?: string | null; linkedRecordType?: AiLeadDraft["linkedRecordType"]; parsedDraft?: Record<string, unknown> | null },
) {
  const convertedAt = new Date().toISOString();
  const result = await updateAiLeadDraftAsync(id, {
    status: "converted",
    convertedAt,
    confirmedAt: convertedAt,
    rawText: "",
    parsedDraft: metadata?.parsedDraft || undefined,
    parsedData: metadata?.parsedDraft || undefined,
    linkedRecordId: metadata?.linkedRecordId || null,
    linkedRecordType: metadata?.linkedRecordType || null,
  } as any);
  clearAiDraftLocalRawText(id);
  return result;
}

export function archiveAiLeadDraft(id: string) {
  return updateAiLeadDraft(id, { status: "archived", rawText: "", cancelledAt: new Date().toISOString() });
}

export async function archiveAiLeadDraftAsync(id: string) {
  const cancelledAt = new Date().toISOString();
  const result = await updateAiLeadDraftAsync(id, { status: "archived", rawText: "", cancelledAt, action: "archive" } as any);
  clearAiDraftLocalRawText(id);
  return result;
}

export function deleteAiLeadDraft(id: string) {
  if (!canUseDevLocalDraftFallback()) throw new Error("AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC");
  removeAiDraftFromLocalCache(id);
}

export async function deleteAiLeadDraftAsync(id: string) {
  await deleteAiDraftFromSupabase(id);
  removeAiDraftFromLocalCache(id);
}

export function countAiLeadDrafts(status: AiLeadDraftStatus = "draft") {
  if (!canUseDevLocalDraftFallback()) return 0;
  return getAiLeadDrafts().filter((draft) => draft.status === status).length;
}

export async function countAiLeadDraftsAsync(status: AiLeadDraftStatus = "draft") {
  const drafts = await getAiLeadDraftsAsync();
  return drafts.filter((draft) => draft.status === status).length;
}

function aiLeadDraftToLegacy(draft: AiLeadDraft): AiDraft {
  const parsed = draft.parsedDraft || draft.parsedData || {};
  const title = String(parsed.title || parsed.name || parsed.contactName || draft.rawText || "Szkic AI").trim();
  return {
    id: draft.id,
    draftType: draft.type === "lead" || draft.type === "task" || draft.type === "event" || draft.type === "note" ? draft.type : "task",
    title,
    rawText: draft.rawText,
    status: draft.status === "converted" ? "confirmed" : draft.status === "archived" ? "cancelled" : "pending_review",
    scheduledAt: typeof parsed.scheduledAt === "string" ? parsed.scheduledAt : null,
    startAt: typeof parsed.startAt === "string" ? parsed.startAt : null,
    endAt: typeof parsed.endAt === "string" ? parsed.endAt : null,
    parsedData: parsed,
    warnings: Array.isArray(parsed.warnings) ? (parsed.warnings as string[]) : [],
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    confirmedAt: draft.confirmedAt || null,
    cancelledAt: draft.cancelledAt || null,
  };
}

export function normalizeAiDraft(input: Partial<AiDraft> & { rawText?: string | null }): AiDraft {
  const now = new Date().toISOString();
  const title = String(input.title || input.parsedData?.title || input.rawText || "Szkic AI").trim();
  return {
    id: input.id || `ai_draft_${Date.now()}`,
    draftType: input.draftType || "task",
    title: title || "Szkic AI",
    rawText: input.rawText ?? null,
    status: input.status || "pending_review",
    scheduledAt: input.scheduledAt ?? null,
    startAt: input.startAt ?? null,
    endAt: input.endAt ?? null,
    parsedData: input.parsedData || {},
    warnings: Array.isArray(input.warnings) ? input.warnings : [],
    createdAt: input.createdAt || now,
    updatedAt: now,
    confirmedAt: input.confirmedAt ?? null,
    cancelledAt: input.cancelledAt ?? null,
  };
}

export function listLocalAiDrafts(): AiDraft[] {
  return getAiLeadDrafts().map(aiLeadDraftToLegacy);
}

export function saveLocalAiDraft(input: Partial<AiDraft> & { rawText?: string | null }): AiDraft {
  const normalized = normalizeAiDraft(input);
  const parsedDraft = {
    ...(normalized.parsedData || {}),
    title: normalized.title,
    draftType: normalized.draftType,
    scheduledAt: normalized.scheduledAt || null,
    startAt: normalized.startAt || null,
    endAt: normalized.endAt || null,
    source: "stage4_legacy_compat",
  };
  const saved = saveAiLeadDraft({
    rawText: normalized.rawText || normalized.title,
    parsedDraft,
    source: "today_assistant",
    type: normalizeType(normalized.draftType),
  });
  return aiLeadDraftToLegacy(saved);
}

export function cancelLocalAiDraft(id: string): AiDraft | null {
  const draft = archiveAiLeadDraft(id);
  return draft ? aiLeadDraftToLegacy(draft) : null;
}

export function markLocalAiDraftConfirmed(id: string): AiDraft | null {
  const draft = markAiLeadDraftConverted(id);
  return draft ? aiLeadDraftToLegacy(draft) : null;
}

export const AI_DRAFTS_STORAGE_KEY = STORAGE_PREFIX;
export const createLocalAiDraft = normalizeAiDraft;
export const createAiDraft = normalizeAiDraft;
export const saveAiDraft = saveLocalAiDraft;
export const listAiDrafts = listLocalAiDrafts;
export const getAiDrafts = listLocalAiDrafts;
export const getPendingAiDrafts = () => listLocalAiDrafts().filter((draft) => draft.status === "pending_review");
export const deleteAiDraft = cancelLocalAiDraft;
export const cancelAiDraft = cancelLocalAiDraft;
export const confirmAiDraft = markLocalAiDraftConfirmed;
export const markAiDraftConfirmed = markLocalAiDraftConfirmed;

void AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11;
void AI_DRAFT_CONFIRM_BRIDGE_STAGE4;
