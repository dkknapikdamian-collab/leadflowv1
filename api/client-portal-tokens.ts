import { insertWithVariants, supabaseRequest } from './_supabase.js';

function isMissingTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.client_portal_tokens'");
}

function normalizeToken(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    caseId: String(row.case_id || row.caseId || ''),
    token: String(row.token || ''),
    createdAt: row.created_at || null,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      const token = String(req.query?.token || '').trim();
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      try {
        const filters = [`case_id=eq.${encodeURIComponent(caseId)}`];
        if (token) filters.push(`token=eq.${encodeURIComponent(token)}`);
        const data = await supabaseRequest(`client_portal_tokens?select=*&${filters.join('&')}&order=created_at.desc.nullslast&limit=1`, {
          method: 'GET',
          headers: { Prefer: 'return=representation' },
        });
        const row = Array.isArray(data) && data[0] ? data[0] : null;
        if (!row) {
          res.status(404).json({ error: token ? 'PORTAL_TOKEN_INVALID' : 'PORTAL_TOKEN_NOT_FOUND' });
          return;
        }
        res.status(200).json(normalizeToken(row as Record<string, unknown>));
      } catch (error) {
        if (isMissingTableError(error)) {
          res.status(404).json({ error: 'PORTAL_TOKEN_NOT_FOUND' });
          return;
        }
        throw error;
      }
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const caseId = String(body.caseId || '').trim();
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const token = Math.random().toString(36).slice(2, 15);
      try {
        await supabaseRequest(`client_portal_tokens?case_id=eq.${encodeURIComponent(caseId)}`, {
          method: 'DELETE',
          headers: { Prefer: 'return=representation' },
        });
      } catch {
        // best effort cleanup
      }

      const payload = {
        case_id: caseId,
        token,
        created_at: new Date().toISOString(),
      };
      const result = await insertWithVariants(['client_portal_tokens'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      try {
        await supabaseRequest(`cases?id=eq.${encodeURIComponent(caseId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ portal_ready: true, updated_at: new Date().toISOString() }),
        });
      } catch {
        // best effort only
      }
      res.status(200).json(normalizeToken(inserted as Record<string, unknown>));
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'PORTAL_TOKEN_API_FAILED' });
  }
}
