import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asNullableUuid(value: unknown) {
  const normalized = asNullableString(value);
  return normalized && isUuid(normalized) ? normalized : null;
}

function normalizeActivity(row: any) {
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
    updatedAt: row.updated_at || row.updatedAt || row.created_at || null,
  };
}

function normalizeCaseItem(row: any) {
  return {
    id: String(row.id || crypto.randomUUID()),
    caseId: String(row.case_id || row.caseId || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    type: String(row.type || 'file'),
    status: String(row.status || 'missing'),
    isRequired: Boolean(row.is_required ?? row.isRequired ?? true),
    dueDate: row.due_date ? String(row.due_date) : '',
    order: Number(row.item_order || row.order || 0),
    response: row.response ? String(row.response) : null,
    fileUrl: row.file_url ? String(row.file_url) : null,
    fileName: row.file_name ? String(row.file_name) : null,
    approvedAt: row.approved_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function routeKind(req: any, body: any) {
  const raw = req?.query?.kind ?? body?.kind ?? '';
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

export default async function handler(req: any, res: any) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const kind = routeKind(req, body);

    if (kind !== 'activities' && kind !== 'case-items') {
      res.status(400).json({ error: 'RECORDS_KIND_REQUIRED' });
      return;
    }

    if (kind === 'activities') {
      const workspaceId = await resolveRequestWorkspaceId(req, body);

      if (req.method === 'GET') {
        if (!workspaceId) { res.status(401).json({ error: 'ACTIVITY_WORKSPACE_REQUIRED' }); return; }
        const caseId = asString(req.query?.caseId);
        const leadId = asString(req.query?.leadId);
        const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 100));
        const filters: string[] = [];
        if (caseId) filters.push(`case_id=eq.${encodeURIComponent(caseId)}`);
        if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
        const filterQuery = filters.length ? `&${filters.join('&')}` : '';
        const result = await selectFirstAvailable([
          withWorkspaceFilter(`activities?select=*&order=created_at.desc&limit=${limit}${filterQuery}`, workspaceId),
        ]);
        res.status(200).json((result.data || []).map(normalizeActivity));
        return;
      }

      if (req.method === 'PATCH') {
        if (!body.id || !workspaceId) { res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' }); return; }
        await requireScopedRow('activities', String(body.id), workspaceId, 'ACTIVITY_NOT_FOUND');
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
        if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
        if (body.ownerId !== undefined) payload.owner_id = asNullableUuid(body.ownerId);
        if (body.actorId !== undefined) payload.actor_id = asNullableUuid(body.actorId);
        if (body.actorType !== undefined) payload.actor_type = body.actorType || 'operator';
        if (body.eventType !== undefined) payload.event_type = body.eventType || 'activity';
        if (body.payload !== undefined) payload.payload = body.payload || {};
        const result = await updateById('activities', String(body.id), payload);
        const updated = Array.isArray(result) && result[0] ? result[0] : { id: body.id, ...payload };
        res.status(200).json(normalizeActivity(updated));
        return;
      }

      if (req.method === 'DELETE') {
        const id = asString(req.query?.id);
        if (!id || !workspaceId) { res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' }); return; }
        await requireScopedRow('activities', id, workspaceId, 'ACTIVITY_NOT_FOUND');
        await deleteById('activities', id);
        res.status(200).json({ ok: true, id });
        return;
      }

      if (req.method !== 'POST') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }
      const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
      const payload = {
        workspace_id: finalWorkspaceId || null,
        case_id: asNullableUuid(body.caseId),
        lead_id: asNullableUuid(body.leadId),
        owner_id: asNullableUuid(body.ownerId),
        actor_id: asNullableUuid(body.actorId),
        actor_type: body.actorType || 'operator',
        event_type: body.eventType || 'activity',
        payload: body.payload || {},
        created_at: new Date().toISOString(),
      };
      const result = await insertWithVariants(['activities'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeActivity(inserted));
      return;
    }

    // kind === 'case-items'
    if (req.method === 'GET') {
      const caseId = asString(req.query?.caseId);
      if (!caseId) { res.status(400).json({ error: 'CASE_ID_REQUIRED' }); return; }

      const result = await selectFirstAvailable([
        `case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=item_order.asc,created_at.asc&limit=500`,
        `case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.asc&limit=500`,
      ]);
      res.status(200).json((result.data || []).map(normalizeCaseItem));
      return;
    }

    if (req.method === 'POST') {
      if (!body.caseId) { res.status(400).json({ error: 'CASE_ID_REQUIRED' }); return; }
      const nowIso = new Date().toISOString();
      const payload = {
        case_id: String(body.caseId),
        title: body.title || '',
        description: body.description || '',
        type: body.type || 'file',
        status: body.status || 'missing',
        is_required: body.isRequired !== undefined ? Boolean(body.isRequired) : true,
        due_date: body.dueDate || null,
        item_order: Number(body.order || 0),
        response: body.response || null,
        file_url: body.fileUrl || null,
        file_name: body.fileName || null,
        approved_at: body.approvedAt || null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      const result = await insertWithVariants(['case_items'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeCaseItem(inserted));
      return;
    }

    if (req.method === 'PATCH') {
      if (!body.id) { res.status(400).json({ error: 'CASE_ITEM_ID_REQUIRED' }); return; }
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) payload.title = body.title || '';
      if (body.description !== undefined) payload.description = body.description || '';
      if (body.type !== undefined) payload.type = body.type || 'file';
      if (body.status !== undefined) payload.status = body.status || 'missing';
      if (body.isRequired !== undefined) payload.is_required = Boolean(body.isRequired);
      if (body.dueDate !== undefined) payload.due_date = body.dueDate || null;
      if (body.order !== undefined) payload.item_order = Number(body.order || 0);
      if (body.response !== undefined) payload.response = body.response || null;
      if (body.fileUrl !== undefined) payload.file_url = body.fileUrl || null;
      if (body.fileName !== undefined) payload.file_name = body.fileName || null;
      if (body.approvedAt !== undefined) payload.approved_at = body.approvedAt || null;
      const data = await updateById('case_items', String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeCaseItem(updated));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asString(req.query?.id);
      if (!id) { res.status(400).json({ error: 'CASE_ITEM_ID_REQUIRED' }); return; }
      await deleteById('case_items', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'RECORDS_API_FAILED' });
  }
}

