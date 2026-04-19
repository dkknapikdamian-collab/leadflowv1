import { findWorkspaceId, insertWithVariants, selectFirstAvailable } from './_supabase.js';

function normalizeActivity(row) {
  return {
    id: String(row.id || crypto.randomUUID()),
    caseId: row.case_id ? String(row.case_id) : undefined,
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    ownerId: row.owner_id ? String(row.owner_id) : undefined,
    actorId: row.actor_id ? String(row.actor_id) : undefined,
    actorType: String(row.actor_type || 'operator'),
    eventType: String(row.event_type || 'activity'),
    payload: typeof row.payload === 'object' && row.payload ? row.payload : {},
    createdAt: row.created_at || null,
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      const leadId = String(req.query?.leadId || '').trim();
      const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 100));

      const filters = [];
      if (caseId) filters.push(`case_id=eq.${encodeURIComponent(caseId)}`);
      if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
      const filterQuery = filters.length ? `&${filters.join('&')}` : '';

      const result = await selectFirstAvailable([
        `activities?select=*&order=created_at.desc&limit=${limit}${filterQuery}`,
      ]);

      res.status(200).json((result.data || []).map(normalizeActivity));
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await findWorkspaceId(body.workspaceId);
    const payload = {
      workspace_id: workspaceId || null,
      case_id: body.caseId || null,
      lead_id: body.leadId || null,
      owner_id: body.ownerId || null,
      actor_id: body.actorId || null,
      actor_type: body.actorType || 'operator',
      event_type: body.eventType || 'activity',
      payload: body.payload || {},
      created_at: new Date().toISOString(),
    };

    const result = await insertWithVariants(['activities'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    res.status(200).json(normalizeActivity(inserted));
  } catch (error) {
    res.status(500).json({ error: error?.message || 'ACTIVITY_API_FAILED' });
  }
}
