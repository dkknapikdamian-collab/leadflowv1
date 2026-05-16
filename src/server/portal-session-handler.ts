import { createPortalSession, requirePortalContext, requirePortalSessionContext, readPortalSession, readPortalToken } from './_portal-token.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';

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

export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const caseId = asText(req.query?.caseId || body.caseId);
    if (!caseId) {
      res.status(400).json({ error: 'CASE_ID_REQUIRED' });
      return;
    }

    if (req.method === 'POST') {
      const token = readPortalToken(req, body);
      if (!token) {
        res.status(400).json({ error: 'PORTAL_TOKEN_REQUIRED' });
        return;
      }
      const context = await requirePortalContext(caseId, token);
      const tokenId = asText((context.tokenRow as Record<string, unknown>).id);
      const session = createPortalSession({ caseId, workspaceId: context.workspaceId, tokenId }, 900);
      const expiresAt = new Date(Date.now() + 900_000).toISOString();
      res.status(200).json({ ok: true, caseId, portalSession: session, expiresAt });
      return;
    }

    if (req.method === 'GET') {
      const session = readPortalSession(req, body);
      if (!session) {
        res.status(400).json({ error: 'PORTAL_SESSION_REQUIRED' });
        return;
      }
      await requirePortalSessionContext(caseId, session);
      res.status(200).json({ ok: true, caseId });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = String(error?.message || 'CLIENT_PORTAL_SESSION_API_FAILED');
    const status = message.includes('PORTAL_') ? 403 : message === 'CASE_NOT_FOUND' ? 404 : 500;
    res.status(status).json({ error: message });
  }
}
