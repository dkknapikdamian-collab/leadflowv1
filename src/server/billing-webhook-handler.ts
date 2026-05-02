import { insertWithVariants, updateWhere } from './_supabase.js';
import {
  asNullableText,
  buildNextBillingDate,
  getStripeConfig,
  getStripeSubscription,
  mapStripeSubscriptionStatus,
  readRawBody,
  unixToIso,
  verifyStripeSignature,
} from './_stripe.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function resolveWorkspaceId(session: Record<string, any>) {
  return (
    asNullableText(session.client_reference_id)
    || asNullableText(session.metadata?.workspace_id)
    || asNullableText(session.subscription_details?.metadata?.workspace_id)
    || asNullableText(session.payment_intent?.metadata?.workspace_id)
  );
}

function resolveAccessDays(session: Record<string, any>) {
  const raw = Number(session.metadata?.access_days || session.payment_intent?.metadata?.access_days || 30);
  if (!Number.isFinite(raw) || raw <= 0) return 30;
  return Math.min(730, Math.round(raw));
}

function resolvePlanId(session: Record<string, any>) {
  return asNullableText(
    session.metadata?.plan_id
    || session.subscription_details?.metadata?.plan_id
    || session.payment_intent?.metadata?.plan_id,
  ) || 'closeflow_basic';
}

async function registerWebhookEvent(eventId: string, eventType: string, workspaceId: string | null, payload: Record<string, unknown>) {
  try {
    await insertWithVariants(['billing_events', 'billing_webhook_events'], [{
      provider: 'stripe_blik',
      event_id: eventId,
      event_type: eventType,
      workspace_id: workspaceId,
      payload,
      received_at: new Date().toISOString(),
    }]);
    return { duplicate: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || '');
    if (message.includes('duplicate key') || message.includes('409')) {
      return { duplicate: true };
    }
    throw error;
  }
}

const BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14 = true;

async function markWorkspacePaidFromCheckout(session: Record<string, any>) {
  const workspaceId = resolveWorkspaceId(session);
  const paymentStatus = String(session.payment_status || '').toLowerCase();
  const subscriptionId = asNullableText(session.subscription);
  const eventPayload = {
    checkoutSessionId: asNullableText(session.id),
    paymentIntent: asNullableText(session.payment_intent),
    subscription: subscriptionId,
    paymentStatus,
  };

  if (!workspaceId) return { skipped: true, reason: 'WORKSPACE_ID_MISSING' };
  if (paymentStatus && paymentStatus !== 'paid') return { skipped: true, reason: 'CHECKOUT_NOT_PAID', paymentStatus };

  let currentPeriodEndIso = buildNextBillingDate(resolveAccessDays(session));
  let subscriptionStatus = 'paid_active';
  let cancelAtPeriodEnd = false;
  let providerCustomerId = asNullableText(session.customer);
  if (subscriptionId) {
    try {
      const subscription = await getStripeSubscription(subscriptionId);
      currentPeriodEndIso = unixToIso(subscription.current_period_end) || currentPeriodEndIso;
      subscriptionStatus = mapStripeSubscriptionStatus(subscription.status);
      cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);
      providerCustomerId = asNullableText(subscription.customer) || providerCustomerId;
    } catch {
      // best effort: keep session-derived fallback values
    }
  }

  await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
    plan_id: resolvePlanId(session),
    subscription_status: subscriptionStatus,
    billing_provider: 'stripe_blik',
    provider_customer_id: providerCustomerId,
    provider_subscription_id: asNullableText(subscriptionId || session.payment_intent || session.id),
    checkout_session_id: asNullableText(session.id),
    next_billing_at: currentPeriodEndIso,
    cancel_at_period_end: cancelAtPeriodEnd,
    updated_at: new Date().toISOString(),
  });

  return { ok: true, workspaceId, ...eventPayload };
}

async function patchWorkspaceBySubscription(subscriptionLike: Record<string, any>, forcedStatus?: string) {
  const workspaceId = asNullableText(subscriptionLike.metadata?.workspace_id);
  if (!workspaceId) return { skipped: true, reason: 'WORKSPACE_ID_MISSING' };

  const mappedStatus = forcedStatus || mapStripeSubscriptionStatus(subscriptionLike.status);
  const nextBillingAt = unixToIso(subscriptionLike.current_period_end);

  await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, {
    subscription_status: mappedStatus,
    provider_customer_id: asNullableText(subscriptionLike.customer),
    provider_subscription_id: asNullableText(subscriptionLike.id),
    next_billing_at: nextBillingAt,
    cancel_at_period_end: Boolean(subscriptionLike.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  });

  return { ok: true, workspaceId, subscriptionId: asNullableText(subscriptionLike.id), status: mappedStatus };
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

    const event = JSON.parse(rawBody || '{}');
    const eventId = asText(event?.id);
    const type = asText(event?.type);
    const object = (event?.data?.object || {}) as Record<string, any>;
    const workspaceId = resolveWorkspaceId(object);

    if (!eventId || !type) {
      res.status(400).json({ error: 'STRIPE_EVENT_INVALID' });
      return;
    }

    const registration = await registerWebhookEvent(eventId, type, workspaceId, event);
    if (registration.duplicate) {
      res.status(200).json({ ok: true, duplicate: true, eventId, type });
      return;
    }

    let result: Record<string, unknown> = { ignored: true, type };
    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      result = await markWorkspacePaidFromCheckout(object);
    } else if (type === 'customer.subscription.created' || type === 'customer.subscription.updated') {
      result = await patchWorkspaceBySubscription(object);
    } else if (type === 'customer.subscription.deleted') {
      result = await patchWorkspaceBySubscription(object, 'canceled');
    } else if (type === 'invoice.payment_failed') {
      const subscription = asNullableText(object.subscription);
      if (subscription) {
        const stripeSubscription = await getStripeSubscription(subscription);
        result = await patchWorkspaceBySubscription(stripeSubscription, 'payment_failed');
      } else {
        result = { ok: true, paymentFailed: true, skipped: true, reason: 'SUBSCRIPTION_ID_MISSING' };
      }
    } else if (type === 'checkout.session.async_payment_failed') {
      result = { ok: true, paymentFailed: true };
    }

    res.status(200).json({ ok: true, provider: 'stripe_blik', eventId, type, result });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'BILLING_WEBHOOK_FAILED' });
  }
}
