import { updateWhere } from '../src/server/_supabase.js';
import { requireAuthContext } from '../src/server/_request-scope.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const auth = await requireAuthContext(req);
    const workspaceId = asText(auth.workspaceId);
    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    const body = parseBody(req);
    const action = asText(body.action).toLowerCase();
    const nowIso = new Date().toISOString();

    if (action === 'cancel') {
      await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
        cancel_at_period_end: true,
        updated_at: nowIso,
      });
      res.status(200).json({
        ok: true,
        action: 'cancel',
        cancelAtPeriodEnd: true,
        note: 'Plan nie odnawia się po bieżącym okresie. Aktywacja/dezaktywacja dostępu jest liczona przez webhook + next_billing_at.',
      });
      return;
    }

    if (action === 'resume') {
      await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
        cancel_at_period_end: false,
        updated_at: nowIso,
      });
      res.status(200).json({
        ok: true,
        action: 'resume',
        cancelAtPeriodEnd: false,
        note: 'Wznowiono odnowienie planu dla kolejnego okresu.',
      });
      return;
    }

    res.status(400).json({ error: 'BILLING_ACTION_REQUIRED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    res.status(500).json({ error: error?.message || 'BILLING_ACTIONS_FAILED' });
  }
}
