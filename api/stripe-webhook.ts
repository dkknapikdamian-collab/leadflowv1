import { updateWhere } from './_supabase.js';
import { asNullableText, buildNextBillingDate, getStripeConfig, readRawBody, verifyStripeSignature } from './_stripe.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const STRIPE_WEBHOOK_ENDPOINT = 'stripe-webhook';

function resolveWorkspaceId(session: Record<string, any>) {
  return (
    asNullableText(session.client_reference_id)
    || asNullableText(session.metadata?.workspace_id)
    || asNullableText(session.payment_intent?.metadata?.workspace_id)
  );
}

async function markWorkspacePaidFromCheckout(session: Record<string, any>) {
  const workspaceId = resolveWorkspaceId(session);
  const paymentStatus = String(session.payment_status || '').toLowerCase();

  if (!workspaceId) return { skipped: true, reason: 'WORKSPACE_ID_MISSING' };

  if (paymentStatus && paymentStatus !== 'paid') {
    return { skipped: true, reason: 'CHECKOUT_NOT_PAID', paymentStatus };
  }

  await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
    plan_id: 'closeflow_pro',
    subscription_status: 'paid_active',
    billing_provider: 'stripe_blik',
    provider_customer_id: asNullableText(session.customer),
    provider_subscription_id: asNullableText(session.payment_intent || session.id),
    next_billing_at: buildNextBillingDate(30),
    cancel_at_period_end: false,
  });

  return { ok: true, workspaceId };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const stripeConfig = getStripeConfig();

    if (!stripeConfig.webhookSecret) {
      res.status(501).json({ error: 'STRIPE_WEBHOOK_SECRET_MISSING' });
      return;
    }

    const signatureHeader = asNullableText(req?.headers?.['stripe-signature']);

    if (!signatureHeader) {
      res.status(400).json({ error: 'STRIPE_SIGNATURE_MISSING' });
      return;
    }

    const rawBody = await readRawBody(req);

    if (!verifyStripeSignature(rawBody, signatureHeader, stripeConfig.webhookSecret)) {
      res.status(400).json({ error: 'STRIPE_SIGNATURE_INVALID' });
      return;
    }

    const event = JSON.parse(rawBody);
    const type = String(event?.type || '');
    const object = event?.data?.object || {};
    let result: Record<string, unknown> = { ignored: true, type };

    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      result = await markWorkspacePaidFromCheckout(object);
    }

    if (type === 'checkout.session.async_payment_failed') {
      result = { ok: true, paymentFailed: true };
    }

    res.status(200).json({
      ok: true,
      provider: 'stripe_blik',
      endpoint: STRIPE_WEBHOOK_ENDPOINT,
      type,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'STRIPE_WEBHOOK_FAILED' });
  }
}
