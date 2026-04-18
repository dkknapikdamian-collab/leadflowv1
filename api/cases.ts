import { deleteById, selectFirstAvailable, supabaseRequest } from './_supabase.js';

type AnyRow = Record<string, unknown>;

function asIso(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item));
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeCase(row: AnyRow) {
  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || row.name || 'Sprawa bez tytułu'),
    clientName: String(row.client_name || row.clientName || ''),
    clientId: row.client_id ? String(row.client_id) : undefined,
    status: String(row.status || 'in_progress'),
    completenessPercent: Number(row.completeness_percent || row.completenessPercent || 0),
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    portalReady: Boolean(row.portal_ready || row.portalReady || false),
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

async function safeGet(path: string) {
  try {
    const data = await supabaseRequest(path, {
      method: 'GET',
      headers: { Prefer: 'return=representation' },
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function safePatch(path: string, payload: Record<string, unknown>) {
  try {
    await supabaseRequest(path, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  } catch {
    // etap przejściowy: jeżeli kolumna lub tabela jeszcze nie istnieje, nie wysadzamy całego delete
  }
}

async function safeDelete(path: string) {
  try {
    await supabaseRequest(path, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
  } catch {
    // etap przejściowy: ignorujemy brak tabeli / brak rekordów
  }
}

async function cleanupClients(caseId: string) {
  const clients = await safeGet('clients?select=id,primary_case_id,linked_case_ids&limit=500');

  for (const raw of clients as AnyRow[]) {
    const currentPrimary = raw.primary_case_id ? String(raw.primary_case_id) : null;
    const linked = asArray(raw.linked_case_ids).filter((value) => value !== caseId);
    const shouldTouch = currentPrimary === caseId || linked.length !== asArray(raw.linked_case_ids).length;

    if (!shouldTouch || !raw.id) continue;

    await safePatch(`clients?id=eq.${encodeURIComponent(String(raw.id))}`, {
      primary_case_id: currentPrimary === caseId ? null : currentPrimary,
      linked_case_ids: linked,
      updated_at: new Date().toISOString(),
    });
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'cases?select=*&order=updated_at.desc.nullslast&limit=200',
        'cases?select=*&order=created_at.desc.nullslast&limit=200',
      ]);

      res.status(200).json((result.data as AnyRow[]).map(normalizeCase));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '').trim();
      if (!id) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      await safePatch(`work_items?case_id=eq.${encodeURIComponent(id)}`, {
        case_id: null,
        case_title: null,
        updated_at: new Date().toISOString(),
      });

      await safePatch(`leads?linked_case_id=eq.${encodeURIComponent(id)}`, {
        linked_case_id: null,
        updated_at: new Date().toISOString(),
      });

      await cleanupClients(id);
      await safeDelete(`client_portal_tokens?case_id=eq.${encodeURIComponent(id)}`);
      await safeDelete(`client_portal_tokens?id=eq.${encodeURIComponent(id)}`);
      await safeDelete(`case_items?case_id=eq.${encodeURIComponent(id)}`);
      await safeDelete(`case_activity?case_id=eq.${encodeURIComponent(id)}`);
      await safeDelete(`activities?case_id=eq.${encodeURIComponent(id)}`);
      await deleteById('cases', id);

      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CASE_MUTATION_FAILED' });
  }
}
