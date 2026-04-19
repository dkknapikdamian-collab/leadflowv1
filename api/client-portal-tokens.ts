import { insertWithVariants, selectFirstAvailable, supabaseRequest } from './_supabase.js';

function createToken() {
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

async function bestEffortPatchCase(caseId: string) {
  try {
    await supabaseRequest(`cases?id=eq.${encodeURIComponent(caseId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        portal_ready: true,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // best effort only
  }
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

      const path = token
        ? `client_portal_tokens?select=*&case_id=eq.${encodeURIComponent(caseId)}&token=eq.${encodeURIComponent(token)}&order=created_at.desc&limit=1`
        : `client_portal_tokens?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.desc&limit=1`;

      const result = await selectFirstAvailable([path]);
      const rows = result.data as Record<string, unknown>[];
      const row = rows[0] || null;

      if (!row) {
        res.status(token ? 404 : 200).json(token ? { error: 'PORTAL_TOKEN_NOT_FOUND' } : {});
        return;
      }

      res.status(200).json({
        id: String(row.id || crypto.randomUUID()),
        caseId: String(row.case_id || caseId),
        token: String(row.token || ''),
        createdAt: row.created_at || null,
        isValid: token ? true : undefined,
      });
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const caseId = String(body.caseId || '').trim();
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      await supabaseRequest(`client_portal_tokens?case_id=eq.${encodeURIComponent(caseId)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=representation' },
      });

      const nowIso = new Date().toISOString();
      const payload = {
        case_id: caseId,
        token: createToken(),
        created_at: nowIso,
      };

      const result = await insertWithVariants(['client_portal_tokens'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;

      await bestEffortPatchCase(caseId);

      res.status(200).json({
        id: String((inserted as Record<string, unknown>).id || crypto.randomUUID()),
        caseId,
        token: String((inserted as Record<string, unknown>).token || payload.token),
        createdAt: (inserted as Record<string, unknown>).created_at || nowIso,
      });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CLIENT_PORTAL_TOKEN_API_FAILED' });
  }
}
