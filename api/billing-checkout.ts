import { asNullableText, createStripeBlikCheckout, getAppUrl, getStripeConfig, parseBody, resolveStripeBillingPlan } from '../src/server/_stripe.js';
import { requireAuthContext } from '../src/server/_request-scope.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const authContext = await requireAuthContext(req);
    const body = parseBody(req);
    const workspaceId = asNullableText(authContext.workspaceId);
    const requestedWorkspaceId = asNullableText(body.workspaceId);
    const customerEmail = asNullableText(authContext.email);
    const planKey = asNullableText(body.planKey || req?.headers?.['x-billing-plan']);
    const billingPeriod = asNullableText(body.billingPeriod || req?.headers?.['x-billing-period']);
    const dryRun = body.dryRun === true || body.dryRun === '1' || req?.headers?.['x-billing-dry-run'] === '1';

    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    if (requestedWorkspaceId && requestedWorkspaceId !== workspaceId) {
      res.status(403).json({ error: 'WORKSPACE_FORBIDDEN' });
      return;
    }

    if (dryRun) {
      const stripeConfig = getStripeConfig();
      const plan = resolveStripeBillingPlan(planKey, billingPeriod);
      const appUrl = getAppUrl(req);
      const amount = Math.max(100, Math.round(plan.amountPln * 100));

      res.status(200).json({
        ok: true,
        provider: 'stripe_blik',
        dryRun: true,
        checkoutConfigured: Boolean(stripeConfig.secretKey),
        webhookConfigured: Boolean(stripeConfig.webhookSecret),
        appUrl,
        planId: plan.planId,
        planKey: plan.planKey,
        billingPeriod: plan.period,
        amount,
        amountPln: plan.amountPln,
        currency: stripeConfig.currency,
        accessDays: plan.accessDays,
        missing: {
          STRIPE_SECRET_KEY: !stripeConfig.secretKey,
          STRIPE_WEBHOOK_SECRET: !stripeConfig.webhookSecret,
        },
      });
      return;
    }

    const result: any = await createStripeBlikCheckout({
      workspaceId,
      customerEmail,
      appUrl: getAppUrl(req),
      planKey,
      billingPeriod,
    });

    if (!result.ok) {
      if (result.error === 'STRIPE_PROVIDER_NOT_CONFIGURED') {
        res.status(501).json({
          ...result,
          provider: 'stripe_blik',
          message: 'Stripe nie jest jeszcze skonfigurowany. Uzupelnij STRIPE_SECRET_KEY w Vercel.',
        });
        return;
      }

      res.status(501).json(result);
      return;
    }

    res.status(200).json({
      ok: true,
      provider: 'stripe_blik',
      url: result.url,
      sessionId: result.sessionId,
      amount: result.amount,
      amountPln: result.amountPln,
      currency: result.currency,
      planId: result.planId,
      planKey: result.planKey,
      billingPeriod: result.billingPeriod,
      accessDays: result.accessDays,
    });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    res.status(500).json({ error: error?.message || 'STRIPE_BLIK_CHECKOUT_FAILED' });
  }
}

