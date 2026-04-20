type SupabaseInsertResult = {
  [key: string]: unknown;
};

type LeadInsertInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  dealValue?: number;
  partialPayments?: Array<{ id: string; amount: number; paidAt?: string; createdAt: string }>;
  nextStep?: string;
  nextActionAt?: string;
  ownerId?: string;
  workspaceId?: string;
};

type TaskInsertInput = {
  title: string;
  type?: string;
  date?: string;
  scheduledAt?: string;
  priority?: string;
  status?: string;
  leadId?: string | null;
  reminderAt?: string | null;
  recurrenceRule?: string;
  caseId?: string | null;
  ownerId?: string;
  workspaceId?: string;
};

type EventInsertInput = {
  title: string;
  type?: string;
  startAt: string;
  endAt?: string;
  reminderAt?: string;
  recurrenceRule?: string;
  status?: string;
  leadId?: string | null;
  caseId?: string | null;
  workspaceId?: string;
};

type CaseUpsertInput = {
  id?: string;
  title?: string;
  clientName?: string;
  clientId?: string | null;
  status?: string;
  completenessPercent?: number;
  leadId?: string | null;
  portalReady?: boolean;
  workspaceId?: string;
};

type CaseItemInput = {
  id?: string;
  caseId: string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  isRequired?: boolean;
  dueDate?: string | null;
  order?: number;
  response?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  approvedAt?: string | null;
};

type ActivityInput = {
  id?: string;
  caseId?: string | null;
  leadId?: string | null;
  ownerId?: string | null;
  actorId?: string | null;
  actorType?: string;
  eventType?: string;
  payload?: Record<string, unknown>;
  workspaceId?: string;
};

type MeResponse = {
  workspace: {
    id: string;
    ownerId?: string | null;
    planId?: string | null;
    subscriptionStatus?: string | null;
    trialEndsAt?: string | null;
  };
  profile: {
    id: string;
    fullName?: string;
    email?: string;
    role?: string;
    isAdmin?: boolean;
  };
  access: {
    hasAccess: boolean;
    status: string;
    isTrialActive: boolean;
    isPaidActive: boolean;
  };
};

function getSupabaseConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  return url ? { url } : null;
}

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : `${response.status}:REQUEST_FAILED:${text.slice(0, 180)}`;
    throw new Error(message);
  }

  if (data && typeof data === 'object' && 'raw' in (data as Record<string, unknown>)) {
    throw new Error(`INVALID_API_RESPONSE:${String((data as Record<string, unknown>).raw).slice(0, 180)}`);
  }

  return data as T;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function insertLeadToSupabase(input: LeadInsertInput) {
  return callApi<SupabaseInsertResult>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function insertTaskToSupabase(input: TaskInsertInput) {
  return callApi<SupabaseInsertResult>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function insertEventToSupabase(input: EventInsertInput) {
  return callApi<SupabaseInsertResult>('/api/events', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function fetchLeadsFromSupabase() {
  return callApi<Record<string, unknown>[]>('/api/leads');
}

export async function fetchLeadByIdFromSupabase(id: string) {
  return callApi<Record<string, unknown>>(`/api/leads?id=${encodeURIComponent(id)}`);
}

export async function fetchTasksFromSupabase() {
  return callApi<Record<string, unknown>[]>('/api/tasks');
}

export async function fetchEventsFromSupabase() {
  return callApi<Record<string, unknown>[]>('/api/events');
}

export async function fetchCasesFromSupabase() {
  return callApi<Record<string, unknown>[]>('/api/cases');
}

export async function fetchCaseByIdFromSupabase(id: string) {
  return callApi<Record<string, unknown>>(`/api/cases?id=${encodeURIComponent(id)}`);
}

export async function createCaseInSupabase(input: CaseUpsertInput) {
  return callApi<SupabaseInsertResult>('/api/cases', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCaseInSupabase(input: CaseUpsertInput & { id: string }) {
  return callApi<SupabaseInsertResult>('/api/cases', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteCaseFromSupabase(id: string) {
  return callApi<SupabaseInsertResult>(`/api/cases?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function fetchCaseItemsFromSupabase(caseId: string) {
  return callApi<Record<string, unknown>[]>(`/api/case-items?caseId=${encodeURIComponent(caseId)}`);
}

export async function insertCaseItemToSupabase(input: CaseItemInput) {
  return callApi<SupabaseInsertResult>('/api/case-items', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCaseItemInSupabase(input: CaseItemInput & { id: string }) {
  return callApi<SupabaseInsertResult>('/api/case-items', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteCaseItemFromSupabase(id: string) {
  return callApi<SupabaseInsertResult>(`/api/case-items?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function fetchActivitiesFromSupabase(params?: {
  caseId?: string;
  leadId?: string;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.caseId) query.set('caseId', params.caseId);
  if (params?.leadId) query.set('leadId', params.leadId);
  if (params?.limit) query.set('limit', String(params.limit));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return callApi<Record<string, unknown>[]>(`/api/activities${suffix}`);
}

export async function insertActivityToSupabase(input: ActivityInput) {
  return callApi<SupabaseInsertResult>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function fetchClientPortalTokenFromSupabase(caseId: string) {
  return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}`);
}

export async function validateClientPortalTokenFromSupabase(caseId: string, token: string) {
  return callApi<Record<string, unknown>>(`/api/client-portal-tokens?caseId=${encodeURIComponent(caseId)}&token=${encodeURIComponent(token)}`);
}

export async function createClientPortalTokenInSupabase(caseId: string) {
  return callApi<Record<string, unknown>>('/api/client-portal-tokens', {
    method: 'POST',
    body: JSON.stringify({ caseId }),
  });
}

export async function updateLeadInSupabase(input: Record<string, unknown> & { id: string }) {
  return callApi<SupabaseInsertResult>('/api/leads', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteLeadFromSupabase(id: string) {
  return callApi<SupabaseInsertResult>(`/api/leads?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function updateTaskInSupabase(input: Record<string, unknown> & { id: string }) {
  return callApi<SupabaseInsertResult>('/api/tasks', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteTaskFromSupabase(id: string) {
  return callApi<SupabaseInsertResult>(`/api/tasks?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function updateEventInSupabase(input: Record<string, unknown> & { id: string }) {
  return callApi<SupabaseInsertResult>('/api/events', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteEventFromSupabase(id: string) {
  return callApi<SupabaseInsertResult>(`/api/events?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function fetchMeFromSupabase(input: { uid?: string; email?: string; fullName?: string }) {
  const query = new URLSearchParams();
  if (input.uid) query.set('uid', input.uid);
  if (input.email) query.set('email', input.email);
  if (input.fullName) query.set('fullName', input.fullName);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return callApi<MeResponse>(`/api/me${suffix}`);
}

export async function updateWorkspaceSubscriptionInSupabase(input: {
  workspaceId: string;
  planId?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string | null;
}) {
  return callApi<SupabaseInsertResult>('/api/workspace-subscription', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
