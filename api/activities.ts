import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';

function isUuid(value) { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function asNullableString(value) { if (typeof value !== 'string') return null; const trimmed = value.trim(); return trimmed ? trimmed : null; }
function asNullableUuid(value) { const normalized = asNullableString(value); return normalized && isUuid(normalized) ? normalized : null; }
function normalizeActivity(row) { return { id: String(row.id || crypto.randomUUID()), caseId: row.case_id ? String(row.case_id) : undefined, leadId: row.lead_id ? String(row.lead_id) : undefined, ownerId: row.owner_id ? String(row.owner_id) : undefined, actorId: row.actor_id ? String(row.actor_id) : undefined, actorType: String(row.actor_type || 'operator'), eventType: String(row.event_type || 'activity'), payload: typeof row.payload === 'object' && row.payload ? row.payload : {}, createdAt: row.created_at || null, updatedAt: row.updated_at || row.updatedAt || row.created_at || null }; }

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (req.method === 'GET') {
      if (!workspaceId) { res.status(401).json({ error: 'ACTIVITY_WORKSPACE_REQUIRED' }); return; }
      const caseId = String(req.query?.caseId || '').trim();
      const leadId = String(req.query?.leadId || '').trim();
      const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 100));
      const filters = []; if (caseId) filters.push(`case_id=eq.${encodeURIComponent(caseId)}`); if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
      const filterQuery = filters.length ? `&${filters.join('&')}` : '';
      const result = await selectFirstAvailable([withWorkspaceFilter(`activities?select=*&order=created_at.desc&limit=${limit}${filterQuery}`, workspaceId)]);
      res.status(200).json((result.data || []).map(normalizeActivity)); return;
    }
    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) { res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' }); return; }
      await requireScopedRow('activities', String(body.id), workspaceId, 'ACTIVITY_NOT_FOUND');
      const payload = { updated_at: new Date().toISOString() };
      if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
      if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
      if (body.ownerId !== undefined) payload.owner_id = asNullableUuid(body.ownerId);
      if (body.actorId !== undefined) payload.actor_id = asNullableUuid(body.actorId);
      if (body.actorType !== undefined) payload.actor_type = body.actorType || 'operator';
      if (body.eventType !== undefined) payload.event_type = body.eventType || 'activity';
      if (body.payload !== undefined) payload.payload = body.payload || {};
      const result = await updateById('activities', String(body.id), payload);
      const updated = Array.isArray(result) && result[0] ? result[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeActivity(updated)); return;
    }
    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '').trim();
      if (!id || !workspaceId) { res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' }); return; }
      await requireScopedRow('activities', id, workspaceId, 'ACTIVITY_NOT_FOUND');
      await deleteById('activities', id);
      res.status(200).json({ ok: true, id }); return;
    }
    if (req.method !== 'POST') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }
    const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
    const payload = { workspace_id: finalWorkspaceId || null, case_id: asNullableUuid(body.caseId), lead_id: asNullableUuid(body.leadId), owner_id: asNullableUuid(body.ownerId), actor_id: asNullableUuid(body.actorId), actor_type: body.actorType || 'operator', event_type: body.eventType || 'activity', payload: body.payload || {}, created_at: new Date().toISOString() };
    const result = await insertWithVariants(['activities'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    res.status(200).json(normalizeActivity(inserted));
  } catch (error) {
    const message = error?.message || 'ACTIVITY_API_FAILED';
    res.status(message === 'ACTIVITY_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
