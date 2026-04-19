import { deleteById, selectFirstAvailable, supabaseRequest } from './_supabase.js';

function isMissingCasesTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.cases'");
}

function normalizeCase(row: Record<string, unknown>) {
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

async function bestEffortPatch(path: string, payload: Record<string, unknown>) {
  try {
    await supabaseRequest(path, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  } catch {
    // best effort only during cutover
  }
}

async function bestEffortDelete(path: string) {
  try {
    await supabaseRequest(path, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
  } catch {
    // optional cleanup only
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const requestedId = String(req.query?.id || '').trim();
      let rows: Record<string, unknown>[] = [];
      try {
        const result = await selectFirstAvailable([
          'cases?select=*&order=updated_at.desc.nullslast&limit=200',
          'cases?select=*&order=created_at.desc.nullslast&limit=200',
        ]);
        rows = result.data as Record<string, unknown>[];
      } catch (error) {
        if (!isMissingCasesTableError(error)) throw error;
        rows = [];
      }
      const normalized = rows.map(normalizeCase);

      if (requestedId) {
        const match = normalized.find((item) => item.id === requestedId);
        if (!match) {
          res.status(404).json({ error: 'CASE_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }

      res.status(200).json(normalized);
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '').trim();
      if (!id) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      await bestEffortPatch(`work_items?case_id=eq.${encodeURIComponent(id)}`, {
        case_id: null,
        case_title: null,
        updated_at: new Date().toISOString(),
      });

      await bestEffortPatch(`leads?id=eq.${encodeURIComponent(id)}`, {
        linked_case_id: null,
        updated_at: new Date().toISOString(),
      });

      await bestEffortDelete(`client_portal_tokens?case_id=eq.${encodeURIComponent(id)}`);
      await deleteById('cases', id);

      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CASE_API_FAILED' });
  }
}
