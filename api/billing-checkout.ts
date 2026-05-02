import {
  asNullableText,
  createStripeBlikCheckout,
  getAppUrl,
  getStripeConfig,
  parseBody,
  resolveStripeBillingPlan,
} from '../src/server/_stripe.js';

function resolveRequesterEmail(req: any, body: Record<string, unknown>) {
  return asNullableText(
    body.customerEmail
      || body.email
      || req?.headers?.['x-user-email']
      || req?.headers?.['x-customer-email'],
  );
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req) as Record<string, unknown>;
    const workspaceId = asNullableText(body.workspaceId || req?.headers?.['x-workspace-id']);
    const customerEmail = resolveRequesterEmail(req, body);
    const planKey = asNullableText(body.planKey || body.planId || body.plan);
    const billingPeriod = asNullableText(body.billingPeriod || body.period);
    const appUrl = getAppUrl(req);
    const dryRun = body.dryRun === true || body.dryRun === 'true';

    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    if (dryRun) {
      const stripeConfig = getStripeConfig();
      const selectedPlan = resolveStripeBillingPlan(planKey, billingPeriod);
      res.status(200).json({
        ok: true,
        dryRun: true,
        provider: 'stripe_blik',
        checkoutConfigured: Boolean(stripeConfig.secretKey),
        webhookConfigured: Boolean(stripeConfig.webhookSecret),
        STRIPE_SECRET_KEY: Boolean(stripeConfig.secretKey),
        STRIPE_WEBHOOK_SECRET: Boolean(stripeConfig.webhookSecret),
        appUrl,
        planId: selectedPlan.planId,
        planKey: selectedPlan.planKey,
        billingPeriod: selectedPlan.period,
        accessDays: selectedPlan.accessDays,
      });
      return;
    }

    const result: any = await createStripeBlikCheckout({
      workspaceId,
      customerEmail,
      appUrl,
      planKey,
      billingPeriod,
    });

    if (!result.ok) {
      const status = result.error === 'STRIPE_PROVIDER_NOT_CONFIGURED' ? 503 : 400;
      res.status(status).json(result);
      return;
    }

    res.status(200).json({
      ok: true,
      provider: 'stripe_blik',
      url: result.url,
      sessionId: result.sessionId || null,
      planId: result.planId,
      planKey: result.planKey,
      billingPeriod: result.billingPeriod,
      accessDays: result.accessDays,
      amountPln: result.amountPln,
      currency: result.currency,
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'STRIPE_CHECKOUT_FAILED' });
  }
}

// STRIPE_PROVIDER_NOT_CONFIGURED
