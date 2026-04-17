type RecordMap = Record<string, unknown>;

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

async function supabaseRequest(path: string, init?: RequestInit) {
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

export async function findWorkspaceId() {
  try {
    const rows = await supabaseRequest('workspaces?select=id&order=created_at.asc&limit=1', {
      method: 'GET',
      headers: { Prefer: 'return=minimal' },
    });
    return Array.isArray(rows) && rows[0]?.id ? String(rows[0].id) : null;
  } catch {
    return null;
  }
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
