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
  priority?: string;
  status?: string;
  leadId?: string | null;
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
  workspaceId?: string;
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
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `${response.status}:REQUEST_FAILED`);
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

export async function insertEventToSupabase(input: EventInsertInput) {
  return callApi<SupabaseInsertResult>('/api/events', {
    method: 'POST',
    body: JSON.stringify(input),
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
