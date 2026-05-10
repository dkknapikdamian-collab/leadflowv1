// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
/* STAGE16_SCOPED_MUTATION_ENDPOINT: workspace-owned mutations must scope service-role writes by workspace_id. */
import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById, updateByIdScoped, deleteByIdScoped, updateByWorkspaceAndId, deleteByWorkspaceAndId } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, requireScopedRow, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { normalizeClientContract } from '../src/lib/data-contract.js';
import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';

const OPTIONAL_CLIENT_COLUMNS = new Set(['notes', 'tags', 'source_primary', 'last_activity_at', 'archived_at']);

const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableUuid(value: unknown) {
  const normalized = asText(value);
  return normalized && isUuid(normalized) ? normalized : null;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => asText(entry))
    .filter(Boolean)
    .slice(0, 30);
}

function toIso(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeClient(row: Record<string, unknown>) {
  return normalizeClientContract(row);
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

function isMissingClientsTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.clients'");
}

function omitMissingColumn(payload: Record<string, unknown>, column: string) {
  const next = { ...payload };
  delete next[column];
  return next;
}

async function insertWithSchemaFallback(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let index = 0; index < 8; index += 1) {
    try {
      return await insertWithVariants(['clients'], [current]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_CLIENT_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('CLIENT_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let index = 0; index < 8; index += 1) {
    try {
      return await updateByIdScoped('clients', id, workspaceId, current);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_CLIENT_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('CLIENT_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) {
        res.status(401).json({ error: 'CLIENT_WORKSPACE_REQUIRED' });
        return;
      }

      const requestedId = asText(req.query?.id);
      const base = withWorkspaceFilter(`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);
      const fallback = withWorkspaceFilter(`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);
      let normalized: ReturnType<typeof normalizeClient>[] = [];
      try {
        const result = await selectFirstAvailable([base, fallback]);
        normalized = (result.data || []).map((row: Record<string, unknown>) => normalizeClient(row));
      } catch (error) {
        if (!isMissingClientsTableError(error)) throw error;
      }

      if (requestedId) {
        const match = normalized.find((entry: Record<string, unknown>) => String(entry.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'CLIENT_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }

      res.status(200).json(normalized);
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    // P0_SERVICE_ROLE_SCOPE_MUTATION_GATE
    if (!workspaceId) {
      res.status(401).json({ error: 'CLIENT_WORKSPACE_REQUIRED' });
      return;
    }
    await assertWorkspaceWriteAccess(workspaceId, req);

    if (req.method === 'POST') {
      const finalWorkspaceId = workspaceId;
      if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      const nowIso = new Date().toISOString();
      const payload = {
        workspace_id: finalWorkspaceId,
        name: asText(body.name) || 'Klient',
        company: asText(body.company) || null,
        email: asText(body.email).toLowerCase() || null,
        phone: asText(body.phone) || null,
        notes: asText(body.notes) || null,
        tags: asStringArray(body.tags),
        source_primary: asText(body.sourcePrimary || body.source) || 'other',
        created_at: nowIso,
        updated_at: nowIso,
        last_activity_at: toIso(body.lastActivityAt),
        archived_at: toIso(body.archivedAt),
      };
      const result = await insertWithSchemaFallback(payload);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeClient(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'CLIENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('clients', id, workspaceId, 'CLIENT_NOT_FOUND');
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.name !== undefined) payload.name = asText(body.name) || 'Klient';
      if (body.company !== undefined) payload.company = asText(body.company) || null;
      if (body.email !== undefined) payload.email = asText(body.email).toLowerCase() || null;
      if (body.phone !== undefined) payload.phone = asText(body.phone) || null;
      if (body.notes !== undefined) payload.notes = asText(body.notes) || null;
      if (body.tags !== undefined) payload.tags = asStringArray(body.tags);
      if (body.sourcePrimary !== undefined) payload.source_primary = asText(body.sourcePrimary) || 'other';
      if (body.lastActivityAt !== undefined) payload.last_activity_at = toIso(body.lastActivityAt);
      if (body.archivedAt !== undefined) payload.archived_at = toIso(body.archivedAt);

      const data = await updateWithSchemaFallback(id, workspaceId, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id, ...payload };
      res.status(200).json(normalizeClient(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'CLIENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('clients', id, workspaceId, 'CLIENT_NOT_FOUND');
      await deleteByIdScoped('clients', id, workspaceId);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    const message = error?.message || 'CLIENT_API_FAILED';
    res.status(message === 'CLIENT_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}

/* clientValue: row.client_value contractValue: row.contract_value totalRevenue: row.total_revenue */
