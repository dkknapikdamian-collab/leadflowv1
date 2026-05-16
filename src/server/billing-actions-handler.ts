import { selectFirstAvailable, updateWhere } from './_supabase.js';
import { resolveRequestWorkspaceId } from './_request-scope.js';
import { getStripeSubscription, updateStripeSubscription } from './_stripe.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';

const BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K = 'billing actions resolve workspace through verified request scope';

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

function asNullableText(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

async function fetchWorkspace(workspaceId: string) {
  try {
    const result = await selectFirstAvailable([
      `workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=id,billing_provider,provider_subscription_id,cancel_at_period_end&limit=1`,
    ]);
    const rows = Array.isArray(result.data) ? result.data : [];
    return rows[0] && typeof rows[0] === 'object' ? rows[0] as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const workspaceId = asText(await resolveRequestWorkspaceId(req, body));
    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    const action = asText(body.action).toLowerCase();
    const nowIso = new Date().toISOString();
    const workspace = await fetchWorkspace(workspaceId);
    const provider = asNullableText(workspace?.billing_provider);
    const providerSubscriptionId = asNullableText(workspace?.provider_subscription_id);

    if (action === 'cancel') {
      if (provider === 'stripe_blik') {
        if (!providerSubscriptionId) {
          res.status(409).json({ error: 'STRIPE_SUBSCRIPTION_REQUIRED' });
          return;
        }
        const subscription = await updateStripeSubscription(providerSubscriptionId, { cancel_at_period_end: true });
        await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
          cancel_at_period_end: true,
          subscription_status: 'paid_active',
          next_billing_at: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: nowIso,
        });
        res.status(200).json({
          ok: true,
          action: 'cancel',
          cancelAtPeriodEnd: true,
          note: 'Anulowanie ustawione w Stripe na koniec okresu.',
        });
        return;
      }

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
      if (provider === 'stripe_blik') {
        if (!providerSubscriptionId) {
          res.status(409).json({ error: 'STRIPE_SUBSCRIPTION_REQUIRED' });
          return;
        }
        const subscription = await updateStripeSubscription(providerSubscriptionId, { cancel_at_period_end: false });
        const refreshed = await getStripeSubscription(providerSubscriptionId);
        await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
          cancel_at_period_end: false,
          subscription_status: String(refreshed.status || '').toLowerCase() === 'active' ? 'paid_active' : 'inactive',
          next_billing_at: refreshed.current_period_end ? new Date(refreshed.current_period_end * 1000).toISOString() : null,
          updated_at: nowIso,
        });
        res.status(200).json({
          ok: true,
          action: 'resume',
          cancelAtPeriodEnd: false,
          note: 'Odnowienie wznowione w Stripe.',
          stripeSubscriptionId: subscription.id,
        });
        return;
      }

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
