import { assertWorkspaceWriteAccess } from './_access-gate.js';
import { resolveRequestWorkspaceId } from './_request-scope.js';
import {
  buildGoogleCalendarOAuthUrl,
  disconnectGoogleCalendarConnection,
  exchangeGoogleCalendarCode,
  getGoogleCalendarConfigStatus,
  getGoogleCalendarConnection,
  upsertGoogleCalendarConnection,
  verifyGoogleOAuthState,
} from './google-calendar-sync.js';
import { syncGoogleCalendarInbound } from './google-calendar-inbound.js';

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
      await upsertGoogleCalendarConnection({
        workspaceId: verified.workspaceId,
        userId: verified.userId,
        tokens,
        googleAccountEmail: null,
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

    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'GOOGLE_CALENDAR_USER_REQUIRED' });
      return;
    }

    if (req.method === 'POST' && action === 'sync-inbound') {
      // GOOGLE_CALENDAR_STAGE10K_SYNC_INBOUND_ROUTE
      await assertWorkspaceWriteAccess(workspaceId, req);
      const result = await syncGoogleCalendarInbound({
        workspaceId,
        userId,
        daysBack: body.daysBack,
        daysForward: body.daysForward,
        updatedMin: body.updatedMin || null,
      });
      res.status(200).json(result);
      return;
    }

    if (req.method === 'GET' && action === 'status') {
      const cfg = getGoogleCalendarConfigStatus();
      const connection = await getGoogleCalendarConnection(workspaceId, userId).catch(() => null);
      res.status(200).json({
        ok: true,
        configured: cfg.configured,
        missing: cfg.missing,
        connected: Boolean(connection),
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
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing });
        return;
      }
      const authUrl = buildGoogleCalendarOAuthUrl({
        workspaceId,
        userId,
        returnTo: body.returnTo || '/settings',
      });
      res.status(200).json({ ok: true, authUrl, configured: true, userEmail: getUserEmail(req) });
      return;
    }

    if ((req.method === 'DELETE' || req.method === 'POST') && action === 'disconnect') {
      await assertWorkspaceWriteAccess(workspaceId, req);
      await disconnectGoogleCalendarConnection(workspaceId, userId);
      res.status(200).json({ ok: true, disconnected: true });
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
