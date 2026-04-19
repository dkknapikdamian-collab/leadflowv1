import { findWorkspaceId, insertWithVariants, selectFirstAvailable } from './_supabase.js';

function normalizeActivity(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    workspaceId: row.workspace_id ? String(row.workspace_id) : null,
    caseId: row.case_id ? String(row.case_id) : null,
    leadId: row.lead_id ? String(row.lead_id) : null,
    ownerId: row.owner_id ? String(row.owner_id) : null,
    actorId: row.actor_id ? String(row.actor_id) : null,
    actorType: String(row.actor_type || 'operator'),
    eventType: String(row.event_type || 'unknown'),
    payload: typeof row.payload === 'object' && row.payload ? row.payload : {},
    createdAt: row.created_at || null,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      const leadId = String(req.query?.leadId || '').trim();
      const limit = Math.max(1, Math.min(500, Number(req.query?.limit || 50)));

      const parts = ['activities?select=*'];
      if (caseId) parts.push(`case_id=eq.${encodeURIComponent(caseId)}`);
      if (leadId) parts.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
      parts.push(`order=created_at.desc`);
      parts.push(`limit=${limit}`);

      const result = await selectFirstAvailable([parts.join('&')]);
      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeActivity));
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const workspaceId = await findWorkspaceId(body.workspaceId);
      const nowIso = new Date().toISOString();

      const payload = {
        workspace_id: workspaceId,
        case_id: body.caseId || null,
        lead_id: body.leadId || null,
        owner_id: body.ownerId || null,
        actor_id: body.actorId || null,
        actor_type: body.actorType || 'operator',
        event_type: body.eventType || 'unknown',
        payload: body.payload && typeof body.payload === 'object' ? body.payload : {},
        created_at: nowIso,
      };

      const result = await insertWithVariants(['activities'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeActivity(inserted as Record<string, unknown>));
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ACTIVITY_API_FAILED' });
  }
}
