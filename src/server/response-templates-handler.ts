import { insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { assertWorkspaceWriteAccess } from './_access-gate.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';

const A27_RESPONSE_TEMPLATES_SUPABASE_CONTRACT_LOCK = 'response_templates are workspace scoped user data with archived_at soft archive';

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

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => asText(item)).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRow(row: Record<string, unknown>) {
  return {
    id: asText(row.id),
    workspaceId: asText(row.workspace_id || row.workspaceId),
    name: asText(row.name),
    category: asText(row.category),
    tags: Array.isArray(row.tags) ? row.tags.map(asText).filter(Boolean) : [],
    body: asText(row.body),
    variables: Array.isArray(row.variables) ? row.variables.map(asText).filter(Boolean) : [],
    archivedAt: row.archived_at || row.archivedAt || null,
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

function matchesSearch(row: ReturnType<typeof normalizeRow>, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    row.name,
    row.category,
    row.body,
    ...(row.tags || []),
    ...(row.variables || []),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

function buildPayload(body: Record<string, unknown>, workspaceId: string, nowIso: string, includeRequiredFields = false) {
  const payload: Record<string, unknown> = {
    workspace_id: workspaceId,
    updated_at: nowIso,
  };

  if (includeRequiredFields) {
    payload.created_at = nowIso;
    payload.name = asText(body.name);
    payload.body = asText(body.body);
    payload.category = asText(body.category);
    payload.tags = asStringArray(body.tags);
    payload.variables = asStringArray(body.variables);
    payload.archived_at = body.archivedAt || body.archived_at || null;
    return payload;
  }

  if (body.name !== undefined) payload.name = asText(body.name);
  if (body.category !== undefined) payload.category = asText(body.category);
  if (body.tags !== undefined) payload.tags = asStringArray(body.tags);
  if (body.body !== undefined) payload.body = asText(body.body);
  if (body.variables !== undefined) payload.variables = asStringArray(body.variables);
  if (body.archivedAt !== undefined || body.archived_at !== undefined) {
    payload.archived_at = body.archivedAt || body.archived_at || null;
  }

  return payload;
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
      const includeArchived = String(req.query?.includeArchived || '').toLowerCase() === '1'
        || String(req.query?.includeArchived || '').toLowerCase() === 'true';
      const searchQuery = asText(req.query?.q || req.query?.search);
      const filters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        includeArchived ? '' : 'archived_at=is.null&',
      ].join('');
      const limit = requestedId ? 1 : 500;

      const result = await selectFirstAvailable([
        withWorkspaceFilter(`response_templates?select=*&${filters}order=updated_at.desc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`response_templates?select=*&${filters}order=created_at.desc.nullslast&limit=${limit}`, workspaceId),
      ]);

      const rows = Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
      const mapped = rows.map(normalizeRow).filter((row) => matchesSearch(row, searchQuery));

      if (requestedId) {
        const row = mapped.find((item) => item.id === requestedId);
        if (!row) {
          res.status(404).json({ error: 'RESPONSE_TEMPLATE_NOT_FOUND' });
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
      const payload = buildPayload(body, workspaceId, nowIso, true);

      if (!asText(payload.name) || !asText(payload.body)) {
        res.status(400).json({ error: 'RESPONSE_TEMPLATE_NAME_BODY_REQUIRED' });
        return;
      }

      const inserted = await insertWithVariants(['response_templates'], [payload]);
      const row = Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] as Record<string, unknown> : payload;
      res.status(200).json(normalizeRow(row));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id || req.query?.id);
      if (!id) {
        res.status(400).json({ error: 'RESPONSE_TEMPLATE_ID_REQUIRED' });
        return;
      }

      await requireScopedRow('response_templates', id, workspaceId, 'RESPONSE_TEMPLATE_NOT_FOUND');

      const action = asText(body.action || req.query?.action).toLowerCase();
      const nowIso = new Date().toISOString();
      const payload = buildPayload(body, workspaceId, nowIso, false);

      if (action === 'archive') {
        payload.archived_at = nowIso;
      }
      if (action === 'restore') {
        payload.archived_at = null;
      }

      const updated = await updateById('response_templates', id, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] as Record<string, unknown> : { id, workspace_id: workspaceId, ...payload };
      res.status(200).json(normalizeRow(row));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id || body.id);
      if (!id) {
        res.status(400).json({ error: 'RESPONSE_TEMPLATE_ID_REQUIRED' });
        return;
      }

      await requireScopedRow('response_templates', id, workspaceId, 'RESPONSE_TEMPLATE_NOT_FOUND');

      const archivedAt = new Date().toISOString();
      const updated = await updateById('response_templates', id, {
        archived_at: archivedAt,
        updated_at: archivedAt,
      });
      const row = Array.isArray(updated) && updated[0] ? updated[0] as Record<string, unknown> : { id, workspace_id: workspaceId, archived_at: archivedAt };
      res.status(200).json({ ok: true, id, archivedAt, template: normalizeRow(row) });
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

    res.status(500).json({ error: error?.message || 'RESPONSE_TEMPLATES_API_FAILED' });
  }
}
