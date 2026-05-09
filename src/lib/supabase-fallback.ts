// AI_DRAFT_CONFIRM_RECORDS_STAGE25_SUPABASE
import { getClientAuthSnapshot } from './client-auth';
import { getSupabaseAccessToken } from './supabase-auth';
import { applyGoogleCalendarReminderPreferenceToEventPayload } from './google-calendar-reminder-preferences';
import { normalizeActivityListContract, normalizeAiDraftListContract, normalizeCaseContract, normalizeCaseItemListContract, normalizeCaseListContract, normalizeClientContract, normalizeClientListContract, normalizeEventListContract, normalizeLeadContract, normalizeLeadListContract, normalizePaymentListContract, normalizeTaskListContract } from './data-contract';

type SupabaseInsertResult = { [key: string]: unknown };
type CaseTemplateItemInput = {
  title: string;
  description?: string;
  type?: string;
  isRequired?: boolean;
  order?: number;
};
type LeadInsertInput = { name: string; email?: string; phone?: string; company?: string; source?: string; dealValue?: number; partialPayments?: Array<{ id: string; amount: number; paidAt?: string; createdAt: string }>; nextActionAt?: string; ownerId?: string; workspaceId?: string; allowDuplicate?: boolean };
type ClientUpsertInput = { id?: string; name?: string; company?: string; email?: string; phone?: string; notes?: string; tags?: string[]; sourcePrimary?: string; lastActivityAt?: string | null; archivedAt?: string | null; workspaceId?: string; allowDuplicate?: boolean };
type ServiceProfileUpsertInput = { id?: string; name?: string; description?: string; startRule?: string; winRule?: string; billingModel?: string; caseCreationMode?: string; isDefault?: boolean; isArchived?: boolean; workspaceId?: string };
type PaymentUpsertInput = { id?: string; clientId?: string | null; leadId?: string | null; caseId?: string | null; type?: string; status?: string; amount?: number; currency?: string; paidAt?: string | null; dueAt?: string | null; note?: string; workspaceId?: string };
type ProfileSettingsUpdate = { fullName?: string; companyName?: string; email?: string; appearanceSkin?: string; planningConflictWarningsEnabled?: boolean; browserNotificationsEnabled?: boolean; forceLogoutAfter?: string | null; workspaceId?: string | null };
type WorkspaceSettingsUpdate = { workspaceId: string; planId?: string; subscriptionStatus?: string; trialEndsAt?: string | null; billingProvider?: string | null; providerCustomerId?: string | null; providerSubscriptionId?: string | null; nextBillingAt?: string | null; cancelAtPeriodEnd?: boolean; dailyDigestEnabled?: boolean; dailyDigestEmailEnabled?: boolean; lastDigestSentAt?: string | null; dailyDigestHour?: number; dailyDigestTimezone?: string | null; dailyDigestRecipientEmail?: string | null; timezone?: string | null };
type TaskInsertInput = { title: string; type?: string; date?: string; scheduledAt?: string;
  dueAt?: string; priority?: string; status?: string; leadId?: string | null; reminderAt?: string | null; recurrenceRule?: string; caseId?: string | null;
  clientId?: string | null; ownerId?: string; workspaceId?: string };
type EventInsertInput = { title: string; type?: string; startAt: string;
  scheduledAt?: string; endAt?: string; reminderAt?: string; recurrenceRule?: string; status?: string; leadId?: string | null; caseId?: string | null;
  clientId?: string | null; workspaceId?: string };
type CaseUpsertInput = { id?: string; title?: string; clientName?: string; clientId?: string | null; clientEmail?: string; clientPhone?: string; status?: string; billingStatus?: string; billingModelSnapshot?: string; serviceProfileId?: string | null; startedAt?: string | null; completedAt?: string | null; lastActivityAt?: string | null; serviceStartedAt?: string | null; completenessPercent?: number; leadId?: string | null; createdFromLead?: boolean; portalReady?: boolean; paidAmount?: number; remainingAmount?: number; workspaceId?: string };
type CaseItemInput = { id?: string; caseId: string; title?: string; description?: string; type?: string; status?: string; isRequired?: boolean; dueDate?: string | null; order?: number; response?: string | null; fileUrl?: string | null; fileName?: string | null; approvedAt?: string | null };
type ActivityInput = { id?: string; caseId?: string | null; leadId?: string | null; ownerId?: string | null; actorId?: string | null; actorType?: string; eventType?: string; payload?: Record<string, unknown>; workspaceId?: string };
type MeResponse = { workspace: { id: string; ownerId?: string | null; planId?: string | null; subscriptionStatus?: string | null; trialEndsAt?: string | null; billingProvider?: string | null; providerCustomerId?: string | null; providerSubscriptionId?: string | null; nextBillingAt?: string | null; cancelAtPeriodEnd?: boolean; dailyDigestEnabled?: boolean; dailyDigestHour?: number; dailyDigestTimezone?: string | null; dailyDigestRecipientEmail?: string | null; timezone?: string | null }; profile: { id: string; fullName?: string; companyName?: string; email?: string; role?: string; isAdmin?: boolean; isAppOwner?: boolean; appRole?: string; appearanceSkin?: string; planningConflictWarningsEnabled?: boolean; browserNotificationsEnabled?: boolean; forceLogoutAfter?: string | null }; access: { hasAccess: boolean; status: string; isTrialActive: boolean; isPaidActive: boolean } };

export type EntityConflictCandidate = {
  id: string;
  entityType: 'lead' | 'client';
  label: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  visibility?: string | null;
  state: 'active' | 'hidden' | 'moved_to_service';
  canRestore?: boolean;
  route?: string;
  matches: Array<'email' | 'phone' | 'name' | 'company'>;
  reason: string;
};

type EntityConflictCheckInput = {
  targetType: 'lead' | 'client';
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  include?: Array<'leads' | 'clients'>;
  limit?: number;
  workspaceId?: string;
};

type ApiCacheEntry = { expiresAt: number; data?: unknown; promise?: Promise<unknown> };

const API_GET_CACHE_TTL_MS = 10_000;
export const CLOSEFLOW_DATA_MUTATED_EVENT = 'closeflow:data-mutated';
const DEV_PREVIEW_DATA_FLAG = 'closeflow:dev-preview-data';

function shouldUseDevNoAuthMocks() {
  // Only for local dev UI preview when Supabase is not configured.
  return import.meta.env.DEV && !isSupabaseConfigured();
}

function isDevPreviewDataEnabled() {
  if (!shouldUseDevNoAuthMocks()) return false;
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(DEV_PREVIEW_DATA_FLAG) !== '0';
  } catch {
    return true;
  }
}

function getDevPreviewData() {
  const now = Date.now();
  const iso = (offsetHours: number) => new Date(now + offsetHours * 3_600_000).toISOString();
  const dateOnly = (offsetDays: number) => new Date(now + offsetDays * 86_400_000).toISOString().slice(0, 10);

  const clients = [
    { id: 'dev-client-1', name: 'Anna Kowalska', company: 'Nova Home Studio', email: 'anna@novahome.pl', phone: '+48 600 111 222', notes: 'Klient premium, długie opisy i dużo kontekstu.', archivedAt: null },
    { id: 'dev-client-2', name: 'Michał Zieliński', company: 'M&Z Nieruchomości', email: 'michal@mz.com', phone: '+48 602 333 444', archivedAt: null },
    { id: 'dev-client-3', name: 'Katarzyna Wrona', company: 'K&W Legal Support', email: 'kontakt@kwlegal.pl', phone: '+48 603 555 666', archivedAt: null },
  ];

  const leads = [
    { id: 'dev-lead-1', name: 'Anna Kowalska', company: 'Nova Home Studio', email: 'anna@novahome.pl', phone: '+48 600 111 222', source: 'instagram', status: 'new', dealValue: 12000, isAtRisk: false, leadVisibility: 'active', nextActionAt: iso(3), clientId: 'dev-client-1' },
    { id: 'dev-lead-2', name: 'Michał Zieliński', company: 'M&Z Nieruchomości', email: 'michal@mz.com', phone: '+48 602 333 444', source: 'referral', status: 'waiting_response', dealValue: 4500, isAtRisk: true, leadVisibility: 'active', nextActionAt: iso(-8), clientId: 'dev-client-2' },
    { id: 'dev-lead-3', name: 'Fundacja "Lepsze Jutro"', company: 'Fundacja Lepsze Jutro', email: 'zarzad@fundacja.pl', phone: '+48 605 777 888', source: 'email', status: 'proposal_sent', dealValue: 7800, isAtRisk: false, leadVisibility: 'active', nextActionAt: iso(24) },
  ];

  const cases = [
    { id: 'dev-case-1', title: 'Wdrożenie strony sprzedażowej + automatyzacja formularzy i follow-up', clientName: 'Anna Kowalska', clientId: 'dev-client-1', leadId: 'dev-lead-1', status: 'in_progress', completenessPercent: 42, updatedAt: iso(-2) },
    { id: 'dev-case-2', title: 'Pakiet dokumentów i onboarding klienta korporacyjnego', clientName: 'Michał Zieliński', clientId: 'dev-client-2', leadId: 'dev-lead-2', status: 'waiting_on_client', completenessPercent: 68, updatedAt: iso(-26) },
  ];

  const tasks = [
    { id: 'dev-task-1', title: 'Przygotować propozycję harmonogramu i zakresu prac', status: 'todo', date: dateOnly(0), time: '13:30', leadId: 'dev-lead-1', caseId: 'dev-case-1', clientId: 'dev-client-1' },
    { id: 'dev-task-2', title: 'Follow-up po ofercie (wiadomość + telefon)', status: 'todo', date: dateOnly(1), time: '09:15', leadId: 'dev-lead-2', caseId: 'dev-case-2', clientId: 'dev-client-2' },
    { id: 'dev-task-3', title: 'Sprawdzić komplet dokumentów od klienta', status: 'in_progress', date: dateOnly(-1), time: '16:40', clientId: 'dev-client-3' },
  ];

  const events = [
    { id: 'dev-event-1', title: 'Call kickoff - Nova Home Studio', startAt: iso(4), type: 'call', leadId: 'dev-lead-1', caseId: 'dev-case-1', clientId: 'dev-client-1' },
    { id: 'dev-event-2', title: 'Przegląd umowy i checklisty', startAt: iso(30), type: 'meeting', caseId: 'dev-case-2', clientId: 'dev-client-2' },
  ];

  const payments = [
    { id: 'dev-pay-1', clientId: 'dev-client-1', leadId: 'dev-lead-1', caseId: 'dev-case-1', amount: 6000, currency: 'PLN', status: 'paid', paidAt: iso(-48) },
    { id: 'dev-pay-2', clientId: 'dev-client-2', leadId: 'dev-lead-2', caseId: 'dev-case-2', amount: 2500, currency: 'PLN', status: 'pending', dueAt: iso(72) },
  ];

  return { leads, clients, cases, tasks, events, payments };
}

export type CloseflowDataMutationDetail = {
  path: string;
  method: string;
  entity: string;
  occurredAt: string;
};

function resolveCloseflowMutationEntity(path: string) {
  const normalized = String(path || '').toLowerCase();
  if (normalized.includes('/api/tasks') || normalized.includes('kind=tasks')) return 'task';
  if (normalized.includes('/api/events') || normalized.includes('kind=events')) return 'event';
  if (normalized.includes('/api/leads')) return 'lead';
  if (normalized.includes('/api/cases')) return 'case';
  if (normalized.includes('/api/clients')) return 'client';
  if (normalized.includes('/api/system?kind=ai-drafts')) return 'aiDraft';
  if (normalized.includes('/api/activities')) return 'activity';
  if (normalized.includes('/api/payments')) return 'payment';
  return 'unknown';
}

export function emitCloseflowDataMutation(path: string, method: string) {
  if (typeof window === 'undefined') return;
  if (String(method || '').toUpperCase() === 'GET') return;

  const detail: CloseflowDataMutationDetail = {
    path,
    method: String(method || '').toUpperCase(),
    entity: resolveCloseflowMutationEntity(path),
    occurredAt: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent(CLOSEFLOW_DATA_MUTATED_EVENT, { detail }));
}

export function subscribeCloseflowDataMutations(handler: (detail: CloseflowDataMutationDetail) => void) {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    handler((event as CustomEvent<CloseflowDataMutationDetail>).detail);
  };

  window.addEventListener(CLOSEFLOW_DATA_MUTATED_EVENT, listener);
  return () => window.removeEventListener(CLOSEFLOW_DATA_MUTATED_EVENT, listener);
}

const apiGetCache = new Map<string, ApiCacheEntry>();
const WORKSPACE_CONTEXT_STORAGE_KEY = 'closeflow:workspace-id';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeWorkspaceContextId(value?: string | null) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return UUID_REGEX.test(normalized) ? normalized : '';
}

function getSupabaseConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  return url ? { url } : null;
}

function clearApiGetCache() { apiGetCache.clear(); }
function getAuthContext() {
  const ctx = getClientAuthSnapshot();
  return {
    uid: ctx.uid || '',
    email: ctx.email || '',
    fullName: ctx.fullName || '',
  };
}
function canUseStorage() { return typeof window !== 'undefined' && !!window.localStorage; }
export function getStoredWorkspaceId() {
  if (!canUseStorage()) return '';
  const storedValue = window.localStorage.getItem(WORKSPACE_CONTEXT_STORAGE_KEY) || '';
  const normalized = normalizeWorkspaceContextId(storedValue);
  if (!normalized && storedValue) {
    window.localStorage.removeItem(WORKSPACE_CONTEXT_STORAGE_KEY);
  }
  return normalized;
}
export function hasStoredWorkspaceContext() {
  return Boolean(getStoredWorkspaceId());
}
export function persistWorkspaceId(workspaceId?: string | null) {
  if (!canUseStorage()) return;
  const normalized = normalizeWorkspaceContextId(workspaceId);
  if (normalized) {
    window.localStorage.setItem(WORKSPACE_CONTEXT_STORAGE_KEY, normalized);
    return;
  }
  window.localStorage.removeItem(WORKSPACE_CONTEXT_STORAGE_KEY);
}
async function getAuthHeaders() {
  const accessToken = await getSupabaseAccessToken();
  const authContext = getAuthContext();
  const workspaceId = getStoredWorkspaceId();
  const headers: Record<string, string> = {};

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (authContext.uid) {
    headers['x-user-id'] = authContext.uid;
    headers['x-firebase-uid'] = authContext.uid;
    headers['x-auth-uid'] = authContext.uid;
  }
  if (authContext.email) headers['x-user-email'] = authContext.email;
  if (authContext.fullName) headers['x-user-full-name'] = authContext.fullName;
  if (workspaceId) {
    headers['x-workspace-id'] = workspaceId;
    headers['x-closeflow-workspace-id'] = workspaceId;
  }

  return headers;
}
function getCacheScope() { const ctx = getAuthContext(); return `${ctx.uid || 'anon'}:${ctx.email || 'anon'}:${getStoredWorkspaceId() || 'no-workspace'}`; }

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || 'GET').toUpperCase();
  const useCache = method === 'GET';
  const cacheKey = `${method}:${getCacheScope()}:${path}`;

  if (useCache) {
    const cached = apiGetCache.get(cacheKey);
    if (cached && 'data' in cached && cached.expiresAt > Date.now()) return cached.data as T;
    if (cached?.promise) return cached.promise as Promise<T>;
  }

  const requestPromise = (async () => {
    const response = await fetch(path, { ...init, headers: { ...(await getAuthHeaders()), 'Content-Type': 'application/json', ...(init?.headers || {}) } });
    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
    }
    if (!response.ok) {
      const message = typeof data === 'object' && data && 'error' in (data as Record<string, unknown>) ? String((data as Record<string, unknown>).error) : `${response.status}:REQUEST_FAILED:${text.slice(0, 180)}`;
      throw new Error(message);
    }
    if (data && typeof data === 'object' && 'raw' in (data as Record<string, unknown>)) throw new Error(`INVALID_API_RESPONSE:${String((data as Record<string, unknown>).raw).slice(0, 180)}`);
    return data as T;
  })();

  if (useCache) apiGetCache.set(cacheKey, { expiresAt: Date.now() + API_GET_CACHE_TTL_MS, promise: requestPromise });
  try {
    const result = await requestPromise;
    if (useCache) apiGetCache.set(cacheKey, { expiresAt: Date.now() + API_GET_CACHE_TTL_MS, data: result }); else { clearApiGetCache(); emitCloseflowDataMutation(path, method); }
    return result;
  } catch (error) {
    if (useCache) apiGetCache.delete(cacheKey);
    throw error;
  }
}

export function isSupabaseConfigured() { return Boolean(getSupabaseConfig()); }
export async function findEntityConflictsInSupabase(input: EntityConflictCheckInput) { return callApi<{ ok: boolean; marker?: string; targetType: 'lead' | 'client'; conflicts: EntityConflictCandidate[] }>('/api/system?kind=entity-conflicts', { method: 'POST', body: JSON.stringify(input) }); }
export async function insertLeadToSupabase(input: LeadInsertInput) { return callApi<SupabaseInsertResult>('/api/leads', { method: 'POST', body: JSON.stringify(input) }); }
export const createLeadFromAiDraftApprovalInSupabase = insertLeadToSupabase;
export async function startLeadServiceInSupabase(input: { id: string; title: string; caseStatus?: string; clientName?: string; clientEmail?: string; clientPhone?: string; workspaceId?: string }) {
  return callApi<Record<string, unknown>>('/api/leads', { method: 'POST', body: JSON.stringify({ action: 'start_service', ...input }) });
}
export async function fetchClientsFromSupabase() {
  if (isDevPreviewDataEnabled()) return getDevPreviewData().clients as Record<string, unknown>[];
  return callApi<Record<string, unknown>[]>('/api/clients').then(normalizeClientListContract);
}
export async function fetchClientByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/clients?id=${encodeURIComponent(id)}`).then((row) => normalizeClientContract(row)); }
export async function createClientInSupabase(input: ClientUpsertInput) { return callApi<SupabaseInsertResult>('/api/clients', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateClientInSupabase(input: ClientUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/clients', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteClientFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/clients?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchServiceProfilesFromSupabase(params?: { includeArchived?: boolean }) {
  const query = new URLSearchParams();
  if (params?.includeArchived) query.set('includeArchived', '1');
  return callApi<Record<string, unknown>[]>(`/api/service-profiles${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function createServiceProfileInSupabase(input: ServiceProfileUpsertInput) { return callApi<SupabaseInsertResult>('/api/service-profiles', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateServiceProfileInSupabase(input: ServiceProfileUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/service-profiles', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function fetchPaymentsFromSupabase(params?: { leadId?: string; caseId?: string; clientId?: string; status?: string }) {
  if (isDevPreviewDataEnabled()) {
    const all = getDevPreviewData().payments as Record<string, unknown>[];
    return normalizePaymentListContract(all.filter((row) => {
      if (params?.leadId && String((row as any).leadId || '') !== params.leadId) return false;
      if (params?.caseId && String((row as any).caseId || '') !== params.caseId) return false;
      if (params?.clientId && String((row as any).clientId || '') !== params.clientId) return false;
      if (params?.status && String((row as any).status || '') !== params.status) return false;
      return true;
    }));
  }
  const query = new URLSearchParams();
  if (params?.leadId) query.set('leadId', params.leadId);
  if (params?.caseId) query.set('caseId', params.caseId);
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.status) query.set('status', params.status);
  return callApi<Record<string, unknown>[]>(`/api/payments${query.toString() ? `?${query.toString()}` : ''}`).then(normalizePaymentListContract);
}
export async function createPaymentInSupabase(input: PaymentUpsertInput) { return callApi<SupabaseInsertResult>('/api/payments', { method: 'POST', body: JSON.stringify(input) }); }
export async function updatePaymentInSupabase(input: PaymentUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/payments', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deletePaymentFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/payments?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function insertTaskToSupabase(input: TaskInsertInput) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }); }
export async function insertEventToSupabase(input: EventInsertInput) { return callApi<SupabaseInsertResult>('/api/events', { method: 'POST', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input as unknown as Record<string, unknown>)) }); }

export type AiDraftApiInput = {
  id?: string;
  rawText?: string | null;
  parsedDraft?: Record<string, unknown> | null;
  parsedData?: Record<string, unknown> | null;
  source?: string;
  provider?: string;
  type?: string;
  status?: string;
  workspaceId?: string;
  convertedAt?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  linkedRecordId?: string | null;
  linkedRecordType?: string | null;
};

export async function fetchAiDraftsFromSupabase(params?: { status?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.limit) query.set('limit', String(params.limit));
  return callApi<Record<string, unknown>[]>(`/api/system?kind=ai-drafts${query.toString() ? `&${query.toString()}` : ''}`).then(normalizeAiDraftListContract);
}

export async function createAiDraftInSupabase(input: AiDraftApiInput) {
  return callApi<Record<string, unknown>>('/api/system?kind=ai-drafts', { method: 'POST', body: JSON.stringify(input) });
}

export async function updateAiDraftInSupabase(input: AiDraftApiInput & { id: string; action?: string }) {
  return callApi<Record<string, unknown>>('/api/system?kind=ai-drafts', { method: 'PATCH', body: JSON.stringify(input) });
}

export async function deleteAiDraftFromSupabase(id: string) {
  return callApi<Record<string, unknown>>(`/api/system?kind=ai-drafts&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function fetchAssistantContextFromSupabase() {
  return callApi<{
    ok: boolean;
    workspaceId: string;
    now: string;
    leads: Record<string, unknown>[];
    tasks: Record<string, unknown>[];
    events: Record<string, unknown>[];
    cases: Record<string, unknown>[];
    clients: Record<string, unknown>[];
    drafts: Record<string, unknown>[];
  }>('/api/system?kind=assistant-context').then((context) => ({
    ...context,
    leads: normalizeLeadListContract(context.leads),
    tasks: normalizeTaskListContract(context.tasks),
    events: normalizeEventListContract(context.events),
    cases: normalizeCaseListContract(context.cases),
  }));
}

export async function fetchLeadsFromSupabase(params?: { clientId?: string; linkedCaseId?: string; caseId?: string; status?: string; visibility?: string }) {
  if (isDevPreviewDataEnabled()) {
    const all = getDevPreviewData().leads as Record<string, unknown>[];
    return normalizeLeadListContract(all.filter((row) => {
      if (params?.clientId && String((row as any).clientId || '') !== params.clientId) return false;
      if (params?.caseId && String((row as any).caseId || '') !== params.caseId) return false;
      if (params?.status && String((row as any).status || '') !== params.status) return false;
      if (params?.visibility && String((row as any).leadVisibility || '') !== params.visibility) return false;
      return true;
    }));
  }
  if (shouldUseDevNoAuthMocks()) return [];
  const query = new URLSearchParams();
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.linkedCaseId) query.set('linkedCaseId', params.linkedCaseId);
  if (params?.caseId) query.set('caseId', params.caseId);
  if (params?.status) query.set('status', params.status);
  if (params?.visibility) query.set('visibility', params.visibility);
  return callApi<Record<string, unknown>[]>(`/api/leads${query.toString() ? `?${query.toString()}` : ''}`).then(normalizeLeadListContract);
}
export async function fetchLeadByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/leads?id=${encodeURIComponent(id)}`).then((row) => normalizeLeadContract(row)); }
export async function fetchTasksFromSupabase() {
  if (isDevPreviewDataEnabled()) return normalizeTaskListContract(getDevPreviewData().tasks as Record<string, unknown>[]);
  if (shouldUseDevNoAuthMocks()) return [];
  return callApi<Record<string, unknown>[]>('/api/tasks').then(normalizeTaskListContract);
}
export async function fetchEventsFromSupabase() {
  if (isDevPreviewDataEnabled()) return normalizeEventListContract(getDevPreviewData().events as Record<string, unknown>[]);
  if (shouldUseDevNoAuthMocks()) return [];
  return callApi<Record<string, unknown>[]>('/api/events').then(normalizeEventListContract);
}
export async function fetchCasesFromSupabase(params?: { clientId?: string; leadId?: string; status?: string }) {
  if (isDevPreviewDataEnabled()) {
    const all = getDevPreviewData().cases as Record<string, unknown>[];
    return normalizeCaseListContract(all.filter((row) => {
      if (params?.clientId && String((row as any).clientId || '') !== params.clientId) return false;
      if (params?.leadId && String((row as any).leadId || '') !== params.leadId) return false;
      if (params?.status && String((row as any).status || '') !== params.status) return false;
      return true;
    }));
  }
  if (shouldUseDevNoAuthMocks()) return [];
  const query = new URLSearchParams();
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.leadId) query.set('leadId', params.leadId);
  if (params?.status) query.set('status', params.status);
  return callApi<Record<string, unknown>[]>(`/api/cases${query.toString() ? `?${query.toString()}` : ''}`).then(normalizeCaseListContract);
}
export async function fetchCaseByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/cases?id=${encodeURIComponent(id)}`).then((row) => normalizeCaseContract(row)); }
export async function createCaseInSupabase(input: CaseUpsertInput) { return callApi<SupabaseInsertResult>('/api/cases', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateCaseInSupabase(input: CaseUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/cases', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteCaseFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/cases?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchCaseItemsFromSupabase(caseId: string) { return callApi<Record<string, unknown>[]>(`/api/case-items?caseId=${encodeURIComponent(caseId)}`).then(normalizeCaseItemListContract); }
export async function insertCaseItemToSupabase(input: CaseItemInput) { return callApi<SupabaseInsertResult>('/api/case-items', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateCaseItemInSupabase(input: CaseItemInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/case-items', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteCaseItemFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/case-items?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchActivitiesFromSupabase(params?: { caseId?: string; leadId?: string; limit?: number }) {
  const query = new URLSearchParams(); if (params?.caseId) query.set('caseId', params.caseId); if (params?.leadId) query.set('leadId', params.leadId); if (params?.limit) query.set('limit', String(params.limit));
  return callApi<Record<string, unknown>[]>(`/api/activities${query.toString() ? `?${query.toString()}` : ''}`).then(normalizeActivityListContract);
}
export async function insertActivityToSupabase(input: ActivityInput) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateActivityInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteActivityFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchClientPortalTokenFromSupabase(caseId: string) { return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}`); }
export async function createPortalSessionFromSupabase(caseId: string, token: string) {
  return callApi<{ ok: boolean; caseId: string; portalSession: string; expiresAt: string }>('/api/client-portal-session', {
    method: 'POST',
    body: JSON.stringify({ caseId, token }),
  });
}
export async function createClientPortalTokenInSupabase(caseId: string) { return callApi<Record<string, unknown>>('/api/client-portal-tokens', { method: 'POST', body: JSON.stringify({ caseId }) }); }
export async function fetchPortalCaseBundleFromSupabase(caseId: string, portalSession: string) {
  const [caseRow, items] = await Promise.all([
    callApi<Record<string, unknown>>(`/api/cases?id=${encodeURIComponent(caseId)}&portalSession=${encodeURIComponent(portalSession)}`),
    callApi<Record<string, unknown>[]>(`/api/case-items?caseId=${encodeURIComponent(caseId)}&portalSession=${encodeURIComponent(portalSession)}`),
  ]);
  return { caseRow: normalizeCaseContract(caseRow), items: normalizeCaseItemListContract(items) };
}
export async function uploadPortalFileInSupabase(input: { caseId: string; itemId: string; portalSession: string; file: { name: string; type: string; size: number; dataBase64: string } }) {
  return callApi<{ ok: boolean; filePath: string; fileName: string }>('/api/storage-upload', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
export async function submitPortalCaseItemInSupabase(input: { caseId: string; portalSession: string; id: string; status?: string; response?: string | null; filePath?: string | null; fileName?: string | null }) {
  return callApi<Record<string, unknown>>('/api/case-items', { method: 'PATCH', body: JSON.stringify({ caseId: input.caseId, portalSession: input.portalSession, id: input.id, status: input.status, response: input.response, fileUrl: input.filePath || undefined, fileName: input.fileName || undefined }) });
}
export async function insertPortalActivityToSupabase(input: { caseId: string; portalSession: string; eventType: string; payload?: Record<string, unknown> }) {
  return callApi<Record<string, unknown>>('/api/activities', { method: 'POST', body: JSON.stringify({ caseId: input.caseId, portalSession: input.portalSession, actorType: 'client', eventType: input.eventType, payload: input.payload || {} }) });
}
export async function updateLeadInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/leads', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteLeadFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteTaskFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function updateEventInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/events', { method: 'PATCH', body: JSON.stringify(applyGoogleCalendarReminderPreferenceToEventPayload(input)) }); }
export async function deleteEventFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchMeFromSupabase(input?: { uid?: string; email?: string; fullName?: string }) {
  const headers: Record<string, string> = {};
  if (input?.uid) {
    headers['x-user-id'] = input.uid;
    headers['x-firebase-uid'] = input.uid;
    headers['x-auth-uid'] = input.uid;
  }
  if (input?.email) headers['x-user-email'] = input.email;
  if (input?.fullName) headers['x-user-full-name'] = input.fullName;
  return callApi<MeResponse>('/api/me', { headers });
}
export async function updateProfileSettingsInSupabase(input: ProfileSettingsUpdate) { return callApi<SupabaseInsertResult>('/api/system?kind=profile-settings', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function updateWorkspaceSettingsInSupabase(input: WorkspaceSettingsUpdate) { return callApi<SupabaseInsertResult>('/api/workspace-settings', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function updateWorkspaceSubscriptionInSupabase(input: { workspaceId: string; planId?: string; subscriptionStatus?: string; trialEndsAt?: string | null }) { return updateWorkspaceSettingsInSupabase(input); }
export async function fetchSupportRequestsFromSupabase(params?: { ownerId?: string; ownerEmail?: string; workspaceId?: string; limit?: number; includeAll?: boolean; status?: string; kind?: string; query?: string }) {
  const query = new URLSearchParams(); if (params?.ownerId) query.set('ownerId', params.ownerId); if (params?.ownerEmail) query.set('ownerEmail', params.ownerEmail); if (params?.workspaceId) query.set('workspaceId', params.workspaceId); if (params?.limit) query.set('limit', String(params.limit)); if (params?.includeAll) query.set('includeAll', '1'); if (params?.status) query.set('status', params.status); if (params?.kind) query.set('kind', params.kind); if (params?.query) query.set('query', params.query);
  return callApi<Record<string, unknown>[]>(`/api/support-requests${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function createSupportRequestInSupabase(input: { ownerId: string; ownerEmail?: string | null; workspaceId?: string | null; kind: string; subject: string; message: string }) { return callApi<Record<string, unknown>>('/api/support-requests', { method: 'POST', body: JSON.stringify(input) }); }
export async function appendSupportReplyInSupabase(input: { id: string; message: string; actorType?: string; authorType?: string; authorLabel?: string; ownerId?: string; status?: string; workspaceId?: string }) {
  return callApi<Record<string, unknown>>('/api/support-requests', { method: 'PATCH', body: JSON.stringify({ id: input.id, action: 'reply', message: input.message, actorType: input.actorType || input.authorType, authorLabel: input.authorLabel, ownerId: input.ownerId, status: input.status, workspaceId: input.workspaceId }) });
}
export const addSupportReplyInSupabase = appendSupportReplyInSupabase;
export const replyToSupportRequestInSupabase = appendSupportReplyInSupabase;
export async function updateSupportRequestStatusInSupabase(input: { id: string; status: string; ownerId?: string; workspaceId?: string }) {
  return callApi<Record<string, unknown>>('/api/support-requests', { method: 'PATCH', body: JSON.stringify({ id: input.id, action: 'status', status: input.status, ownerId: input.ownerId, workspaceId: input.workspaceId }) });
}
export async function updateSupportRequestInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<Record<string, unknown>>('/api/support-requests', { method: 'PATCH', body: JSON.stringify(input) }); }

export async function createBillingCheckoutSessionInSupabase(input: { workspaceId: string; customerEmail?: string | null; planKey?: string | null; billingPeriod?: string | null; dryRun?: boolean }) {
  return callApi<{ ok: boolean; provider?: string; url?: string; sessionId?: string | null; error?: string; missing?: Record<string, boolean>; dryRun?: boolean; checkoutConfigured?: boolean; webhookConfigured?: boolean; appUrl?: string; planId?: string; planKey?: string; billingPeriod?: string; amount?: number; amountPln?: number; currency?: string; accessDays?: number }>('/api/billing-checkout', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
export async function billingActionInSupabase(action: 'cancel' | 'resume') {
  return callApi<{ ok: boolean; action: 'cancel' | 'resume'; cancelAtPeriodEnd: boolean; note?: string }>('/api/billing-actions', {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}
export type ResponseTemplateInput = {
  id?: string;
  name: string;
  category?: string;
  tags?: string[];
  body: string;
  variables?: string[];
  archivedAt?: string | null;
};
export async function fetchResponseTemplatesFromSupabase(params?: { includeArchived?: boolean }) {
  const query = new URLSearchParams();
  if (params?.includeArchived) query.set('includeArchived', '1');
  return callApi<Record<string, unknown>[]>(`/api/response-templates${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function createResponseTemplateInSupabase(input: ResponseTemplateInput) {
  return callApi<Record<string, unknown>>('/api/response-templates', { method: 'POST', body: JSON.stringify(input) });
}
export async function updateResponseTemplateInSupabase(input: ResponseTemplateInput & { id: string }) {
  return callApi<Record<string, unknown>>('/api/response-templates', { method: 'PATCH', body: JSON.stringify(input) });
}
export async function deleteResponseTemplateFromSupabase(id: string) {
  return callApi<Record<string, unknown>>(`/api/response-templates?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function fetchCaseTemplatesFromSupabase(params?: { includeArchived?: boolean }) {
  const query = new URLSearchParams();
  if (params?.includeArchived) query.set('includeArchived', '1');
  return callApi<Record<string, unknown>[]>(`/api/case-templates${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function createCaseTemplateInSupabase(input: { name: string; items: CaseTemplateItemInput[]; archivedAt?: string | null }) {
  return callApi<Record<string, unknown>>('/api/case-templates', { method: 'POST', body: JSON.stringify(input) });
}
export async function updateCaseTemplateInSupabase(input: { id: string; name?: string; items?: any[]; archivedAt?: string | null }) {
  return callApi<Record<string, unknown>>('/api/case-templates', { method: 'PATCH', body: JSON.stringify(input) });
}
export async function deleteCaseTemplateFromSupabase(id: string) {
  return callApi<Record<string, unknown>>(`/api/case-templates?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function syncGoogleCalendarOutboundInSupabase(input?: { mode?: 'pending' | 'failed' | 'all'; limit?: number; daysBack?: number; daysForward?: number }) {
  // GOOGLE_CALENDAR_STAGE12_CLIENT_OUTBOUND_SYNC_HELPER
  return callApi<{
    ok: boolean;
    connected?: boolean;
    mode?: string;
    connectedCalendarId?: string;
    scanned?: number;
    created?: number;
    updated?: number;
    skipped?: number;
    failed?: number;
    errors?: Array<{ id?: string; title?: string; error?: string }>;
  }>('/api/google-calendar?route=sync-outbound', { method: 'POST', body: JSON.stringify(input || {}) });
}

export async function syncGoogleCalendarInboundInSupabase(input?: { daysBack?: number; daysForward?: number; updatedMin?: string | null }) {
  // GOOGLE_CALENDAR_STAGE10L_CLIENT_INBOUND_SYNC_HELPER_REPAIR
  // GOOGLE_CALENDAR_STAGE10K_CLIENT_INBOUND_SYNC_HELPER
  return callApi<{
    ok: boolean;
    connected?: boolean;
    scanned?: number;
    created?: number;
    updated?: number;
    deleted?: number;
    conflicts?: Array<{
      googleEventId?: string;
      title?: string;
      startAt?: string | null;
      endAt?: string | null;
      conflictCount?: number;
      message?: string | null;
    }>;
  }>('/api/system?kind=google-calendar&route=sync-inbound', {
    method: 'POST',
    body: JSON.stringify(input || {}),
  });
}
