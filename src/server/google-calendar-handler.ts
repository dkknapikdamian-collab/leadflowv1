import { assertWorkspaceWriteAccess } from './_access-gate.js';
import { requireRequestIdentity, resolveRequestWorkspaceId } from './_request-scope.js';
import {
  buildGoogleCalendarOAuthUrl,
  disconnectGoogleCalendarConnection,
  exchangeGoogleCalendarCode,
  getGoogleCalendarConfigStatus,
  verifyGoogleOAuthState,
} from './google-calendar-sync.js';
import {
  getGoogleCalendarLegacyWorkspaceConnection,
  getGoogleCalendarUserConnection,
  upsertGoogleCalendarUserConnection,
} from './google-calendar-user-scope.js';
import { syncGoogleCalendarInbound } from './google-calendar-inbound.js';
import { syncGoogleCalendarOutbound } from './google-calendar-outbound.js';

function getUserId(req: any) {
  const raw =
    req.headers?.['x-user-id']
    || req.headers?.['x-auth-uid']
    || req.headers?.['x-firebase-uid']
    || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
}

function getUserEmail(req: any) {
  const raw = req.headers?.['x-user-email'] || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
}

function parseBody(req: any) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body;
}

function route(req: any, body: any) {
  const raw = req.query?.route || req.query?.action || body?.route || body?.action || 'status';
  return String(Array.isArray(raw) ? raw[0] : raw || 'status').trim().toLowerCase();
}

function decodeGoogleAccountEmailFromIdToken(idToken?: string) {
  if (!idToken) return null;
  try {
    const [, payload] = String(idToken).split('.');
    if (!payload) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof data?.email === 'string' && data.email.trim() ? data.email.trim() : null;
  } catch {
    return null;
  }
}

function legacyConnectionSummary(connection: any) {
  if (!connection) return null;
  return {
    googleCalendarId: connection.google_calendar_id || 'primary',
    googleAccountEmail: connection.google_account_email || '',
    syncEnabled: connection.sync_enabled !== false,
    userId: connection.user_id || '',
  };
}

// GOOGLE_CALENDAR_SYSTEM_ROUTE_CONSOLIDATION_2026_05_03
export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const action = route(req, body);

    if (action === 'callback') {
      const code = String(req.query?.code || body.code || '');
      const state = String(req.query?.state || body.state || '');
      if (!code || !state) {
        res.status(400).json({ error: 'GOOGLE_CALENDAR_CALLBACK_REQUIRED' });
        return;
      }

      const verified = verifyGoogleOAuthState(state);
      const tokens = await exchangeGoogleCalendarCode(code);
      await upsertGoogleCalendarUserConnection({
        workspaceId: verified.workspaceId,
        userId: verified.userId,
        tokens,
        googleAccountEmail: decodeGoogleAccountEmailFromIdToken(tokens.id_token),
      });

      const returnTo = verified.returnTo || '/settings?googleCalendar=connected';
      res.status(302).setHeader('Location', returnTo.includes('?') ? `${returnTo}&googleCalendar=connected` : `${returnTo}?googleCalendar=connected`).end();
      return;
    }

    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (!workspaceId) {
      res.status(401).json({ error: 'GOOGLE_CALENDAR_WORKSPACE_REQUIRED' });
      return;
    }

    let requestIdentity: any = null;
    try {
      requestIdentity = await requireRequestIdentity(req, body);
    } catch (error) {
      if (!getUserId(req)) throw error;
    }

    const userId = String(requestIdentity?.userId || requestIdentity?.uid || getUserId(req) || '').trim();
    const userEmail = String(requestIdentity?.email || getUserEmail(req) || '').trim();
    if (!userId) {
      res.status(401).json({ error: 'GOOGLE_CALENDAR_USER_REQUIRED' });
      return;
    }

    if (req.method === 'POST' && action === 'sync-inbound') {
      // GOOGLE_CALENDAR_STAGE10K_SYNC_INBOUND_ROUTE
      // STAGE231F: ordinary user sync must use only that user's workspaceId + userId connection.
      const cfg = getGoogleCalendarConfigStatus();
      if (!cfg.configured) {
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing, reason: 'app_not_configured' });
        return;
      }
      await assertWorkspaceWriteAccess(workspaceId, req);
      const userConnection = await getGoogleCalendarUserConnection(workspaceId, userId);
      if (!userConnection || userConnection.sync_enabled === false) {
        res.status(200).json({ ok: true, connected: false, connectionScope: 'none', reason: 'user_not_connected', scanned: 0, created: 0, updated: 0, deleted: 0, conflicts: [] });
        return;
      }
      const result = await syncGoogleCalendarInbound({
        workspaceId,
        userId,
        daysBack: body.daysBack,
        daysForward: body.daysForward,
        updatedMin: body.updatedMin || null,
      });
      res.status(200).json({ ...result, connectionScope: 'user', googleAccountEmail: userConnection.google_account_email || null });
      return;
    }

    if (req.method === 'POST' && (action === 'sync-outbound' || action === 'sync-now')) {
      // GOOGLE_CALENDAR_STAGE12_SYNC_OUTBOUND_ROUTE
      // STAGE231F: no silent workspace fallback; CloseFlow must not sync a member through Damian's token.
      const cfg = getGoogleCalendarConfigStatus();
      if (!cfg.configured) {
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing, reason: 'app_not_configured' });
        return;
      }
      await assertWorkspaceWriteAccess(workspaceId, req);
      const userConnection = await getGoogleCalendarUserConnection(workspaceId, userId);
      if (!userConnection || userConnection.sync_enabled === false) {
        res.status(200).json({ ok: true, connected: false, connectionScope: 'none', reason: 'user_not_connected', scanned: 0, created: 0, updated: 0, deleted: 0, skipped: 0, failed: 0, errors: [] });
        return;
      }
      const result = await syncGoogleCalendarOutbound({
        workspaceId,
        userId,
        mode: body.mode,
        limit: body.limit,
        daysBack: body.daysBack,
        daysForward: body.daysForward,
      });
      res.status(200).json({ ...result, connectionScope: 'user', googleAccountEmail: userConnection.google_account_email || null });
      return;
    }

    if (req.method === 'GET' && action === 'status') {
      const cfg = getGoogleCalendarConfigStatus();
      const connection = await getGoogleCalendarUserConnection(workspaceId, userId).catch(() => null);
      const legacyConnection = connection ? null : await getGoogleCalendarLegacyWorkspaceConnection(workspaceId, userId).catch(() => null);
      const reason = !cfg.configured
        ? 'app_not_configured'
        : connection
          ? 'connected'
          : legacyConnection
            ? 'legacy_workspace_connection'
            : 'user_not_connected';
      res.status(200).json({
        ok: true,
        configured: cfg.configured,
        featureAllowed: true,
        missing: cfg.missing,
        connected: Boolean(connection),
        connectionScope: connection ? 'user' : legacyConnection ? 'workspace_legacy' : 'none',
        reason,
        legacyWorkspaceConnection: legacyConnectionSummary(legacyConnection),
        connection: connection
          ? {
              googleCalendarId: connection.google_calendar_id || 'primary',
              googleAccountEmail: connection.google_account_email || '',
              syncEnabled: connection.sync_enabled !== false,
            }
          : null,
      });
      return;
    }

    if (req.method === 'POST' && action === 'connect') {
      await assertWorkspaceWriteAccess(workspaceId, req);
      const cfg = getGoogleCalendarConfigStatus();
      if (!cfg.configured) {
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing, reason: 'app_not_configured' });
        return;
      }
      const authUrl = buildGoogleCalendarOAuthUrl({
        workspaceId,
        userId,
        returnTo: body.returnTo || '/settings',
      });
      res.status(200).json({ ok: true, authUrl, configured: true, connectionScope: 'user', userEmail });
      return;
    }

    if ((req.method === 'DELETE' || req.method === 'POST') && action === 'disconnect') {
      await assertWorkspaceWriteAccess(workspaceId, req);
      await disconnectGoogleCalendarConnection(workspaceId, userId);
      res.status(200).json({ ok: true, disconnected: true, connectionScope: 'user' });
      return;
    }

    res.status(405).json({ error: 'GOOGLE_CALENDAR_ROUTE_NOT_ALLOWED' });
  } catch (error: any) {
    const message = String(error?.message || 'GOOGLE_CALENDAR_API_FAILED');
    const status = message.includes('CONFIG_REQUIRED') ? 409
      : message.includes('REQUIRED') ? 400
      : message.includes('INVALID') || message.includes('EXPIRED') ? 400
      : 500;
    res.status(status).json({ error: message });
  }
}
