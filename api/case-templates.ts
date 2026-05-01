import { deleteById, insertWithVariants, selectFirstAvailable, updateById } from '../src/server/_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row) => row && typeof row === 'object')
    .map((row: any) => ({
      title: asText(row.title),
      description: asText(row.description),
      type: asText(row.type) || 'file',
      isRequired: row.isRequired !== false,
    }))
    .filter((row) => row.title);
}

function normalizeRow(row: Record<string, unknown>) {
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    id: asText(row.id),
    workspaceId: asText(row.workspace_id || row.workspaceId),
    name: asText(row.name),
    items,
    archivedAt: row.archived_at || row.archivedAt || null,
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

export default async function handler(req: any, res: any) {
  let workspaceId: string | null = null;
  try {
    workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'AUTH_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const requestedId = asText(req.query?.id);
      const includeArchived = String(req.query?.includeArchived || '').toLowerCase() === '1' || String(req.query?.includeArchived || '').toLowerCase() === 'true';
      const filters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        includeArchived ? '' : 'archived_at=is.null&',
      ].join('');
      const limit = requestedId ? 1 : 500;
      const result = await selectFirstAvailable([
        withWorkspaceFilter(`case_templates?select=*&${filters}order=updated_at.desc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`case_templates?select=*&${filters}order=created_at.desc.nullslast&limit=${limit}`, workspaceId),
      ]);
      const rows = Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
      const mapped = rows.map(normalizeRow);
      if (requestedId) {
        const row = mapped.find((item) => item.id === requestedId);
        if (!row) {
          res.status(404).json({ error: 'CASE_TEMPLATE_NOT_FOUND' });
          return;
        }
        res.status(200).json(row);
        return;
      }
      res.status(200).json(mapped);
      return;
    }

    await assertWorkspaceWriteAccess(workspaceId);
    const body = parseBody(req);

    if (req.method === 'POST') {
      const nowIso = new Date().toISOString();
      const payload = {
        workspace_id: workspaceId,
        name: asText(body.name),
        items: normalizeItems(body.items),
        archived_at: body.archivedAt || null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      if (!payload.name || !payload.items.length) {
        res.status(400).json({ error: 'CASE_TEMPLATE_NAME_ITEMS_REQUIRED' });
        return;
      }
      const inserted = await insertWithVariants(['case_templates'], [payload]);
      const row = Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] as Record<string, unknown> : payload;
      res.status(200).json(normalizeRow(row));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id) {
        res.status(400).json({ error: 'CASE_TEMPLATE_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('case_templates', id, workspaceId, 'CASE_TEMPLATE_NOT_FOUND');
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.name !== undefined) payload.name = asText(body.name);
      if (body.items !== undefined) payload.items = normalizeItems(body.items);
      if (body.archivedAt !== undefined) payload.archived_at = body.archivedAt || null;
      const updated = await updateById('case_templates', id, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] as Record<string, unknown> : { id, workspace_id: workspaceId, ...payload };
      res.status(200).json(normalizeRow(row));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id || body.id);
      if (!id) {
        res.status(400).json({ error: 'CASE_TEMPLATE_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('case_templates', id, workspaceId, 'CASE_TEMPLATE_NOT_FOUND');
      await deleteById('case_templates', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    if (String(error?.message || '').startsWith('WORKSPACE_WRITE_ACCESS_REQUIRED')) {
      res.status(402).json({ error: 'WORKSPACE_WRITE_ACCESS_REQUIRED' });
      return;
    }
    res.status(500).json({ error: error?.message || 'CASE_TEMPLATES_API_FAILED' });
  }
}

