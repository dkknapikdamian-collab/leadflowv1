import { findWorkspaceId, insertWithVariants, supabaseRequest } from './_supabase.js';

function isMissingTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.activities'");
}

function normalizeActivity(row: Record<string, unknown>) {
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

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      const leadId = String(req.query?.leadId || '').trim();
      const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 50)));
      const filters = [] as string[];
      if (caseId) filters.push(`case_id=eq.${encodeURIComponent(caseId)}`);
      if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
      const query = `activities?select=*&${filters.join('&')}${filters.length ? '&' : ''}order=created_at.desc.nullslast&limit=${limit}`;

      try {
        const data = await supabaseRequest(query, {
          method: 'GET',
          headers: { Prefer: 'return=representation' },
        });
        res.status(200).json((data as Record<string, unknown>[]).map(normalizeActivity));
      } catch (error) {
        if (isMissingTableError(error)) {
          res.status(200).json([]);
          return;
        }
        throw error;
      }
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
        event_type: body.eventType || 'activity',
        payload: body.payload || {},
        created_at: nowIso,
      };

      const result = await insertWithVariants(['activities'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeActivity(inserted as Record<string, unknown>));
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ACTIVITIES_API_FAILED' });
  }
}
