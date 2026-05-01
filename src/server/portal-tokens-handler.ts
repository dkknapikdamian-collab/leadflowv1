import { createPortalToken, readPortalToken, requireOperatorCaseAccess, requirePortalContext, upsertPortalTokenForCase } from './_portal-token.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';
import { supabaseRequest } from './_supabase.js';
import { requireAuthContext } from './_request-scope.js';

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

export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const caseId = asText(req.query?.caseId || body.caseId);

    if (!caseId) {
      res.status(400).json({ error: 'CASE_ID_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const token = readPortalToken(req, body);
      if (!token) {
        await requireOperatorCaseAccess(req, caseId);
        res.status(200).json({ ok: true, caseId });
        return;
      }
      await requirePortalContext(caseId, token);
      res.status(200).json({ ok: true, caseId });
      return;
    }

    if (req.method === 'POST') {
      await requireOperatorCaseAccess(req, caseId);
      const auth = await requireAuthContext(req);
      const token = createPortalToken();
      const expiresAt = body.expiresAt ? String(body.expiresAt) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
      await upsertPortalTokenForCase(caseId, token, expiresAt);
      await supabaseRequest(`client_portal_tokens?case_id=eq.${encodeURIComponent(caseId)}&revoked_at=is.null`, {
        method: 'PATCH',
        body: JSON.stringify({ created_by_user_id: asText(auth.userId) || null }),
      }).catch(() => null);
      res.status(200).json({ ok: true, caseId, expiresAt, token });
      return;
    }

    if (req.method === 'DELETE') {
      await requireOperatorCaseAccess(req, caseId);
      const token = readPortalToken(req, body);
      if (!token) {
        res.status(400).json({ error: 'PORTAL_TOKEN_REQUIRED' });
        return;
      }
      const ctx = await requirePortalContext(caseId, token);
      const now = new Date().toISOString();
      const tokenId = String((ctx as any)?.tokenRow?.id || '');
      if (!tokenId) {
        res.status(404).json({ error: 'PORTAL_TOKEN_NOT_FOUND' });
        return;
      }
      await supabaseRequest(`client_portal_tokens?id=eq.${encodeURIComponent(tokenId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ revoked_at: now, updated_at: now }),
      });
      res.status(200).json({ ok: true, caseId, revokedAt: now });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = String(error?.message || 'CLIENT_PORTAL_TOKEN_API_FAILED');
    const code = message.includes('EXPIRED') || message.includes('INVALID') || message.includes('REVOKED') ? 403 : message === 'CASE_NOT_FOUND' ? 404 : 500;
    res.status(code).json({ error: message });
  }
}
