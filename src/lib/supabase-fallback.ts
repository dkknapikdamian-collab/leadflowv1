import { getClientAuthSnapshot } from './client-auth';

type SupabaseInsertResult = { [key: string]: unknown };
type LeadInsertInput = { name: string; email?: string; phone?: string; company?: string; source?: string; dealValue?: number; partialPayments?: Array<{ id: string; amount: number; paidAt?: string; createdAt: string }>; nextActionAt?: string; ownerId?: string; workspaceId?: string };
type ClientUpsertInput = { id?: string; name?: string; company?: string; email?: string; phone?: string; notes?: string; tags?: string[]; sourcePrimary?: string; lastActivityAt?: string | null; archivedAt?: string | null; workspaceId?: string };
type ServiceProfileUpsertInput = { id?: string; name?: string; description?: string; startRule?: string; winRule?: string; billingModel?: string; caseCreationMode?: string; isDefault?: boolean; isArchived?: boolean; workspaceId?: string };
type PaymentUpsertInput = { id?: string; clientId?: string | null; leadId?: string | null; caseId?: string | null; type?: string; status?: string; amount?: number; currency?: string; paidAt?: string | null; dueAt?: string | null; note?: string; workspaceId?: string };
type ProfileSettingsUpdate = { fullName?: string; companyName?: string; email?: string; appearanceSkin?: string; planningConflictWarningsEnabled?: boolean; browserNotificationsEnabled?: boolean; forceLogoutAfter?: string | null; workspaceId?: string | null };
type WorkspaceSettingsUpdate = { workspaceId: string; planId?: string; subscriptionStatus?: string; trialEndsAt?: string | null; billingProvider?: string | null; providerCustomerId?: string | null; providerSubscriptionId?: string | null; nextBillingAt?: string | null; cancelAtPeriodEnd?: boolean; dailyDigestEnabled?: boolean; dailyDigestHour?: number; dailyDigestTimezone?: string | null; dailyDigestRecipientEmail?: string | null; timezone?: string | null };
type TaskInsertInput = { title: string; type?: string; date?: string; scheduledAt?: string; priority?: string; status?: string; leadId?: string | null; reminderAt?: string | null; recurrenceRule?: string; caseId?: string | null; ownerId?: string; workspaceId?: string };
type EventInsertInput = { title: string; type?: string; startAt: string; endAt?: string; reminderAt?: string; recurrenceRule?: string; status?: string; leadId?: string | null; caseId?: string | null; workspaceId?: string };
type CaseUpsertInput = { id?: string; title?: string; clientName?: string; clientId?: string | null; clientEmail?: string; clientPhone?: string; status?: string; billingStatus?: string; billingModelSnapshot?: string; serviceProfileId?: string | null; startedAt?: string | null; completedAt?: string | null; lastActivityAt?: string | null; serviceStartedAt?: string | null; completenessPercent?: number; leadId?: string | null; createdFromLead?: boolean; portalReady?: boolean; workspaceId?: string };
type CaseItemInput = { id?: string; caseId: string; title?: string; description?: string; type?: string; status?: string; isRequired?: boolean; dueDate?: string | null; order?: number; response?: string | null; fileUrl?: string | null; fileName?: string | null; approvedAt?: string | null };
type ActivityInput = { id?: string; caseId?: string | null; leadId?: string | null; ownerId?: string | null; actorId?: string | null; actorType?: string; eventType?: string; payload?: Record<string, unknown>; workspaceId?: string };
type MeResponse = { workspace: { id: string; ownerId?: string | null; planId?: string | null; subscriptionStatus?: string | null; trialEndsAt?: string | null; billingProvider?: string | null; providerCustomerId?: string | null; providerSubscriptionId?: string | null; nextBillingAt?: string | null; cancelAtPeriodEnd?: boolean; dailyDigestEnabled?: boolean; dailyDigestHour?: number; dailyDigestTimezone?: string | null; dailyDigestRecipientEmail?: string | null; timezone?: string | null }; profile: { id: string; fullName?: string; companyName?: string; email?: string; role?: string; isAdmin?: boolean; appearanceSkin?: string; planningConflictWarningsEnabled?: boolean; browserNotificationsEnabled?: boolean; forceLogoutAfter?: string | null }; access: { hasAccess: boolean; status: string; isTrialActive: boolean; isPaidActive: boolean } };
type ApiCacheEntry = { expiresAt: number; data?: unknown; promise?: Promise<unknown> };

const API_GET_CACHE_TTL_MS = 10_000;
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
function getAuthHeaders() {
  const ctx = getAuthContext();
  const workspaceId = getStoredWorkspaceId();
  return Object.fromEntries(
    Object.entries({
      'x-user-id': ctx.uid,
      'x-user-email': ctx.email,
      'x-user-name': ctx.fullName,
      'x-workspace-id': workspaceId,
    }).filter(([, value]) => !!value),
  );
}
function getCacheScope() { const ctx = getAuthContext(); return `${ctx.uid || 'anon'}:${ctx.email || 'anon'}`; }

function normalizeApiErrorMessage(statusCode: number, message: string) {
  if (statusCode === 402 || message.startsWith('WORKSPACE_WRITE_ACCESS_REQUIRED')) {
    return 'Twój plan wygasł albo nie jest aktywny. Odnów plan, aby tworzyć i edytować rekordy.';
  }

  return message;
}

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
    const response = await fetch(path, { ...init, headers: { ...getAuthHeaders(), 'Content-Type': 'application/json', ...(init?.headers || {}) } });
    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
    }
    if (!response.ok) {
      const message = typeof data === 'object' && data && 'error' in (data as Record<string, unknown>) ? String((data as Record<string, unknown>).error) : `${response.status}:REQUEST_FAILED:${text.slice(0, 180)}`;
      throw new Error(normalizeApiErrorMessage(response.status, message));
    }
    if (data && typeof data === 'object' && 'raw' in (data as Record<string, unknown>)) throw new Error(`INVALID_API_RESPONSE:${String((data as Record<string, unknown>).raw).slice(0, 180)}`);
    return data as T;
  })();

  if (useCache) apiGetCache.set(cacheKey, { expiresAt: Date.now() + API_GET_CACHE_TTL_MS, promise: requestPromise });
  try {
    const result = await requestPromise;
    if (useCache) apiGetCache.set(cacheKey, { expiresAt: Date.now() + API_GET_CACHE_TTL_MS, data: result }); else clearApiGetCache();
    return result;
  } catch (error) {
    if (useCache) apiGetCache.delete(cacheKey);
    throw error;
  }
}

export function isSupabaseConfigured() { return Boolean(getSupabaseConfig()); }
export async function insertLeadToSupabase(input: LeadInsertInput) { return callApi<SupabaseInsertResult>('/api/leads', { method: 'POST', body: JSON.stringify(input) }); }
export async function startLeadServiceInSupabase(input: { id: string; title: string; caseStatus?: string; clientName?: string; clientEmail?: string; clientPhone?: string; workspaceId?: string }) {
  return callApi<Record<string, unknown>>('/api/leads', { method: 'POST', body: JSON.stringify({ action: 'start_service', ...input }) });
}
export async function fetchClientsFromSupabase() { return callApi<Record<string, unknown>[]>('/api/clients'); }
export async function fetchClientByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/clients?id=${encodeURIComponent(id)}`); }
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
  const query = new URLSearchParams();
  if (params?.leadId) query.set('leadId', params.leadId);
  if (params?.caseId) query.set('caseId', params.caseId);
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.status) query.set('status', params.status);
  return callApi<Record<string, unknown>[]>(`/api/payments${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function createPaymentInSupabase(input: PaymentUpsertInput) { return callApi<SupabaseInsertResult>('/api/payments', { method: 'POST', body: JSON.stringify(input) }); }
export async function updatePaymentInSupabase(input: PaymentUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/payments', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deletePaymentFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/payments?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function insertTaskToSupabase(input: TaskInsertInput) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }); }
export async function insertEventToSupabase(input: EventInsertInput) { return callApi<SupabaseInsertResult>('/api/events', { method: 'POST', body: JSON.stringify(input) }); }
export async function fetchLeadsFromSupabase(params?: { clientId?: string; linkedCaseId?: string; caseId?: string; status?: string; visibility?: string }) {
  const query = new URLSearchParams();
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.linkedCaseId) query.set('linkedCaseId', params.linkedCaseId);
  if (params?.caseId) query.set('caseId', params.caseId);
  if (params?.status) query.set('status', params.status);
  if (params?.visibility) query.set('visibility', params.visibility);
  return callApi<Record<string, unknown>[]>(`/api/leads${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function fetchLeadByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/leads?id=${encodeURIComponent(id)}`); }
export async function fetchTasksFromSupabase() { return callApi<Record<string, unknown>[]>('/api/tasks'); }
export async function fetchEventsFromSupabase() { return callApi<Record<string, unknown>[]>('/api/events'); }
export async function fetchCasesFromSupabase(params?: { clientId?: string; leadId?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.clientId) query.set('clientId', params.clientId);
  if (params?.leadId) query.set('leadId', params.leadId);
  if (params?.status) query.set('status', params.status);
  return callApi<Record<string, unknown>[]>(`/api/cases${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function fetchCaseByIdFromSupabase(id: string) { return callApi<Record<string, unknown>>(`/api/cases?id=${encodeURIComponent(id)}`); }
export async function createCaseInSupabase(input: CaseUpsertInput) { return callApi<SupabaseInsertResult>('/api/cases', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateCaseInSupabase(input: CaseUpsertInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/cases', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteCaseFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/cases?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchCaseItemsFromSupabase(caseId: string) { return callApi<Record<string, unknown>[]>(`/api/case-items?caseId=${encodeURIComponent(caseId)}`); }
export async function insertCaseItemToSupabase(input: CaseItemInput) { return callApi<SupabaseInsertResult>('/api/case-items', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateCaseItemInSupabase(input: CaseItemInput & { id: string }) { return callApi<SupabaseInsertResult>('/api/case-items', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteCaseItemFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/case-items?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchActivitiesFromSupabase(params?: { caseId?: string; leadId?: string; limit?: number }) {
  const query = new URLSearchParams(); if (params?.caseId) query.set('caseId', params.caseId); if (params?.leadId) query.set('leadId', params.leadId); if (params?.limit) query.set('limit', String(params.limit));
  return callApi<Record<string, unknown>[]>(`/api/activities${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function insertActivityToSupabase(input: ActivityInput) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'POST', body: JSON.stringify(input) }); }
export async function updateActivityInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/activities', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteActivityFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchClientPortalTokenFromSupabase(caseId: string) { return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}`); }
export async function validateClientPortalTokenFromSupabase(caseId: string, token: string) { return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}&token=${encodeURIComponent(token)}`); }
export async function createClientPortalTokenInSupabase(caseId: string) { return callApi<Record<string, unknown>>('/api/client-portal-tokens', { method: 'POST', body: JSON.stringify({ caseId }) }); }
export async function updateLeadInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/leads', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteLeadFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/tasks', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteTaskFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function updateEventInSupabase(input: Record<string, unknown> & { id: string }) { return callApi<SupabaseInsertResult>('/api/events', { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteEventFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function fetchMeFromSupabase(input: { uid?: string; email?: string; fullName?: string }) {
  const query = new URLSearchParams(); if (input.uid) query.set('uid', input.uid); if (input.email) query.set('email', input.email); if (input.fullName) query.set('fullName', input.fullName);
  return callApi<MeResponse>(`/api/me${query.toString() ? `?${query.toString()}` : ''}`);
}
export async function updateProfileSettingsInSupabase(input: ProfileSettingsUpdate) { return callApi<SupabaseInsertResult>('/api/profile-settings', { method: 'PATCH', body: JSON.stringify(input) }); }
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

