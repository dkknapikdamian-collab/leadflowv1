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
  ownerId?: string;
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

export async function fetchTasksFromSupabase() {
  return callApi<Record<string, unknown>[]>('/api/tasks');
}
