import {
  asNullableText,
  buildNextBillingDate,
  getStripeConfig,
  readRawBody,
  verifyStripeSignature,
} from '../src/server/_stripe.js';

export const config = { api: { bodyParser: false } };

const STRIPE_WEBHOOK_ENDPOINT = 'stripe-webhook';

function parseStripeEvent(rawBody: string) {
  try { return JSON.parse(rawBody || '{}'); } catch { return {}; }
}

function resolveWorkspaceId(session: any) {
  return asNullableText(session?.metadata?.workspace_id || session?.client_reference_id);
}

function resolvePlanId(session: any) {
  return asNullableText(session?.metadata?.plan_id) || 'closeflow_pro';
}

function resolveAccessDays(session: any) {
  const parsed = Number(session?.metadata?.access_days || 30);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 30;
}

async function markWorkspacePaid(session: any) {
  const workspaceId = resolveWorkspaceId(session);
  if (!workspaceId) return { ok: false, error: 'WORKSPACE_ID_MISSING' };

  const update = {
    subscription_status: 'paid_active',
    billing_provider: 'stripe_blik',
    stripe_checkout_session_id: asNullableText(session?.id),
    stripe_subscription_id: asNullableText(session?.subscription),
    plan_id: resolvePlanId(session),
    next_billing_at: buildNextBillingDate(resolveAccessDays(session)),
  };

  // updateWhere('workspaces?id=eq.' + encodeURIComponent(workspaceId), update)
  return { ok: true, workspaceId, update };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const rawBody = await readRawBody(req);
    const config = getStripeConfig();
    const signature = asNullableText(req?.headers?.['stripe-signature']);

    if (config.webhookSecret && signature && !verifyStripeSignature(rawBody, signature, config.webhookSecret)) {
      res.status(401).json({ error: 'STRIPE_WEBHOOK_SIGNATURE_INVALID' });
      return;
    }

    const event = parseStripeEvent(rawBody);
    const session = event?.data?.object || {};

    if (event?.type === 'checkout.session.completed' || event?.type === 'checkout.session.async_payment_succeeded') {
      const result = await markWorkspacePaid(session);
      res.status(200).json({ ok: true, endpoint: STRIPE_WEBHOOK_ENDPOINT, handled: event.type, result });
      return;
    }

    res.status(200).json({ ok: true, endpoint: STRIPE_WEBHOOK_ENDPOINT, ignored: event?.type || null });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'STRIPE_WEBHOOK_FAILED' });
  }
}
