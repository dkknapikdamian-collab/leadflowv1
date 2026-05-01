import { deleteById, insertWithVariants, selectFirstAvailable, updateById } from '../src/server/_supabase.js';
import { readPortalSession, requireOperatorCaseAccess, requirePortalSessionContext } from '../src/server/_portal-token.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';
import { normalizeActivityContract } from '../src/lib/data-contract.js';

const A26_ACTIVITY_DELETE_NOTE_LOCK = 'activities endpoint supports PATCH and DELETE for voice note cleanup';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

const SENSITIVE_TEXT_PATTERN = /\b(haslo|hasło|password|passcode|secret|credential|login|api[_ -]?key|token)\b/i;

function sanitizeActivityPayloadValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return SENSITIVE_TEXT_PATTERN.test(value) ? '[REDACTED_SENSITIVE_TEXT]' : value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeActivityPayloadValue(entry));
  }
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      next[key] = sanitizeActivityPayloadValue(nested);
    });
    return next;
  }
  return value;
}

function normalizeActivity(row: any) {
  return normalizeActivityContract(row);
}

function getActivityId(req: any, body: Record<string, unknown>) {
  return asText(req.query?.id || body.id);
}

export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const caseId = asText(req.query?.caseId || body.caseId);
    const leadId = asText(req.query?.leadId || body.leadId);
    const portalSession = readPortalSession(req, body);
    const portalMode = Boolean(portalSession);

    if (req.method === 'GET') {
      const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 80));
      if (portalMode) {
        if (!caseId) {
          res.status(400).json({ error: 'CASE_ID_REQUIRED' });
          return;
        }
        await requirePortalSessionContext(caseId, portalSession);
        const result = await selectFirstAvailable([`activities?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.desc&limit=${limit}`]);
        const rows = Array.isArray(result.data) ? result.data : [];
        res.status(200).json(rows.map(normalizeActivity));
        return;
      }

      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
      const filters = [];
      if (caseId) filters.push(`case_id=eq.${encodeURIComponent(caseId)}`);
      if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);
      const filterQuery = filters.length ? `&${filters.join('&')}` : '';
      const result = await selectFirstAvailable([withWorkspaceFilter(`activities?select=*&order=created_at.desc&limit=${limit}${filterQuery}`, workspaceId)]);
      const rows = Array.isArray(result.data) ? result.data : [];
      res.status(200).json(rows.map(normalizeActivity));
      return;
    }

    if (req.method === 'POST') {
      let workspaceId: string | null = null;
      if (portalMode) {
        if (!caseId) {
          res.status(400).json({ error: 'CASE_ID_REQUIRED' });
          return;
        }
        const ctx = await requirePortalSessionContext(caseId, portalSession);
        workspaceId = ctx.workspaceId || null;
      } else {
        workspaceId = await resolveRequestWorkspaceId(req);
        if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
        if (caseId) await requireOperatorCaseAccess(req, caseId);
      }

      const payload = {
        workspace_id: workspaceId,
        case_id: caseId || null,
        lead_id: leadId || null,
        owner_id: asText(body.ownerId) || null,
        actor_id: asText(body.actorId) || null,
        actor_type: portalMode ? 'client' : (asText(body.actorType) || 'operator'),
        event_type: asText(body.eventType) || 'activity',
        payload: body.payload && typeof body.payload === 'object' ? sanitizeActivityPayloadValue(body.payload) : {},
        created_at: new Date().toISOString(),
      };
      const inserted = await insertWithVariants(['activities'], [payload]);
      const row = Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] : payload;
      res.status(200).json(normalizeActivity(row));
      return;
    }

    if (req.method === 'PATCH') {
      if (portalMode) {
        res.status(403).json({ error: 'PORTAL_ACTIVITY_UPDATE_FORBIDDEN' });
        return;
      }

      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
      const id = getActivityId(req, body);
      if (!id) {
        res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('activities', id, workspaceId, 'ACTIVITY_NOT_FOUND');

      const patch: Record<string, unknown> = {};
      if (body.caseId !== undefined) patch.case_id = asText(body.caseId) || null;
      if (body.leadId !== undefined) patch.lead_id = asText(body.leadId) || null;
      if (body.ownerId !== undefined) patch.owner_id = asText(body.ownerId) || null;
      if (body.actorId !== undefined) patch.actor_id = asText(body.actorId) || null;
      if (body.actorType !== undefined) patch.actor_type = asText(body.actorType) || 'operator';
      if (body.eventType !== undefined) patch.event_type = asText(body.eventType) || 'activity';
      if (body.payload !== undefined) patch.payload = body.payload && typeof body.payload === 'object' ? sanitizeActivityPayloadValue(body.payload) : {};

      if (Object.keys(patch).length === 0) {
        res.status(400).json({ error: 'ACTIVITY_PATCH_EMPTY' });
        return;
      }

      const updated = await updateById('activities', id, patch);
      const row = Array.isArray(updated) && updated[0] ? updated[0] : { id, workspace_id: workspaceId, ...patch };
      res.status(200).json(normalizeActivity(row));
      return;
    }

    if (req.method === 'DELETE') {
      if (portalMode) {
        res.status(403).json({ error: 'PORTAL_ACTIVITY_DELETE_FORBIDDEN' });
        return;
      }

      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
      const id = getActivityId(req, body);
      if (!id) {
        res.status(400).json({ error: 'ACTIVITY_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('activities', id, workspaceId, 'ACTIVITY_NOT_FOUND');
      await deleteById('activities', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = String(error?.message || 'ACTIVITIES_API_FAILED');
    const status = message.includes('PORTAL_TOKEN') ? 403 : 500;
    res.status(status).json({ error: message });
  }
}
