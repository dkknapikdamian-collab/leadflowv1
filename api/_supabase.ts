type RecordMap = Record<string, unknown>;

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getSupabaseConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceRole =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error('SUPABASE_SERVER_CONFIG_MISSING');
  }

  return {
    url: url.replace(/\/+$/, ''),
    key: serviceRole,
  };
}

export async function supabaseRequest(path: string, init?: RequestInit) {
  const cfg = getSupabaseConfig();
  const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${response.status}:${JSON.stringify(data)}`);
  }

  return data;
}

async function readSingleValue(path: string, key: string) {
  const rows = await supabaseRequest(path, {
    method: 'GET',
    headers: { Prefer: 'return=representation' },
  });

  if (Array.isArray(rows) && rows[0] && typeof rows[0] === 'object') {
    const value = (rows[0] as Record<string, unknown>)[key];
    return value ? String(value) : null;
  }

  return null;
}

export async function findWorkspaceId(candidate?: unknown) {
  const normalized = typeof candidate === 'string' ? candidate.trim() : '';

  if (!normalized || !isUuid(normalized)) {
    return null;
  }

  try {
    const directId = await readSingleValue(
      `workspaces?id=eq.${encodeURIComponent(normalized)}&select=id&limit=1`,
      'id',
    );
    if (directId) {
      return directId;
    }
  } catch (error) {
    console.error('SUPABASE_WORKSPACE_DIRECT_LOOKUP_FAILED', {
      candidate: normalized,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const memberWorkspaceId = await readSingleValue(
      `workspace_members?workspace_id=eq.${encodeURIComponent(normalized)}&select=workspace_id&limit=1`,
      'workspace_id',
    );
    if (memberWorkspaceId) {
      return memberWorkspaceId;
    }
  } catch (error) {
    console.error('SUPABASE_WORKSPACE_MEMBER_LOOKUP_FAILED', {
      candidate: normalized,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return null;
}

export async function insertWithVariants(tables: string[], payloads: RecordMap[]) {
  let lastError: Error | null = null;

  for (const table of tables) {
    for (const payload of payloads) {
      try {
        const data = await supabaseRequest(table, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return { table, data, payload };
      } catch (error) {
        lastError = error as Error;
      }
    }
  }

  throw lastError || new Error('SUPABASE_INSERT_FAILED');
}

export async function selectFirstAvailable(tableQueries: string[]) {
  let lastError: Error | null = null;

  for (const tableQuery of tableQueries) {
    try {
      const data = await supabaseRequest(tableQuery, {
        method: 'GET',
        headers: { Prefer: 'return=representation' },
      });
      return { query: tableQuery, data };
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError || new Error('SUPABASE_SELECT_FAILED');
}

export async function updateById(table: string, id: string, payload: RecordMap) {
  const encodedId = encodeURIComponent(id);
  return supabaseRequest(`${table}?id=eq.${encodedId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteById(table: string, id: string) {
  const encodedId = encodeURIComponent(id);
  return supabaseRequest(`${table}?id=eq.${encodedId}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=representation',
    },
  });
}
