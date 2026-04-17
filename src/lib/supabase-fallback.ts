type SupabaseInsertResult = {
  table: string;
  payload: Record<string, unknown>;
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
  const serviceRole = (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string | undefined)?.trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  const key = serviceRole || anonKey;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/+$/, ''),
    key,
  };
}

function nowIso() {
  return new Date().toISOString();
}

async function insertIntoTable(table: string, payload: Record<string, unknown>) {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const response = await fetch(`${cfg.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return true;
  }

  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    bodyText = '';
  }

  throw new Error(`${response.status}:${bodyText}`);
}

async function insertWithVariants(
  tables: string[],
  payloads: Record<string, unknown>[]
): Promise<SupabaseInsertResult> {
  let lastError: Error | null = null;

  for (const table of tables) {
    for (const payload of payloads) {
      try {
        await insertIntoTable(table, payload);
        return { table, payload };
      } catch (error) {
        lastError = error as Error;
      }
    }
  }

  throw lastError || new Error('SUPABASE_INSERT_FAILED');
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function insertLeadToSupabase(input: LeadInsertInput) {
  const source = input.source || 'other';
  const amount = Number(input.dealValue) || 0;
  const dueAt = input.nextActionAt ? new Date(input.nextActionAt).toISOString() : null;
  const createdAt = nowIso();

  const payloads: Record<string, unknown>[] = [
    { name: input.name },
    { title: input.name },
    {
      name: input.name,
      status: 'new',
    },
    {
      title: input.name,
      person_name: input.name,
      company_name: input.company || '',
      email: input.email || '',
      phone: input.phone || '',
      source_type: source,
      source_label: source,
      status: 'new',
      next_step: input.nextStep || '',
      next_step_due_at: dueAt,
      organization_id: input.workspaceId || null,
      assigned_user_id: input.ownerId || null,
      created_by: input.ownerId || null,
      created_at: createdAt,
      updated_at: createdAt,
    },
    {
      workspace_id: input.workspaceId || null,
      owner_id: input.ownerId || null,
      name: input.name,
      company: input.company || '',
      email: input.email || '',
      phone: input.phone || '',
      source,
      status: 'new',
      value: amount,
      next_step: input.nextStep || '',
      next_step_due_at: dueAt,
      created_at: createdAt,
      updated_at: createdAt,
    },
    {
      workspace_id: input.workspaceId || null,
      owner_id: input.ownerId || null,
      name: input.name,
      company: input.company || '',
      email: input.email || '',
      phone: input.phone || '',
      source,
      status: 'new',
      deal_value: amount,
      next_step: input.nextStep || '',
      next_step_due_at: dueAt,
      created_at: createdAt,
      updated_at: createdAt,
    },
  ];

  return insertWithVariants(['leads'], payloads);
}

export async function insertTaskToSupabase(input: TaskInsertInput) {
  const createdAt = nowIso();
  const dueAt = input.date ? new Date(`${input.date}T09:00:00`).toISOString() : null;

  const payloads: Record<string, unknown>[] = [
    { title: input.title },
    {
      title: input.title,
      status: input.status || 'todo',
      type: input.type || 'follow_up',
      date: input.date || null,
      priority: input.priority || 'medium',
    },
    {
      organization_id: input.workspaceId || null,
      assigned_user_id: input.ownerId || null,
      task_type: input.type || 'follow_up',
      title: input.title,
      due_at: dueAt,
      status: 'open',
      created_by: input.ownerId || null,
      created_at: createdAt,
      updated_at: createdAt,
    },
    {
      workspace_id: input.workspaceId || null,
      owner_id: input.ownerId || null,
      title: input.title,
      type: input.type || 'follow_up',
      status: input.status || 'todo',
      due_at: dueAt,
      created_at: createdAt,
      updated_at: createdAt,
    },
  ];

  return insertWithVariants(['tasks', 'work_items', 'lead_tasks'], payloads);
}
