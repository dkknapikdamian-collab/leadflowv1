import { asNullableText, createStripeBlikCheckout, getAppUrl, getStripeConfig, parseBody, resolveStripeBillingPlan } from './_stripe.js';
import { requireAuthContext, resolveRequestWorkspaceId } from './_request-scope.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';

const BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J = 'paid access is activated only by Stripe webhook after confirmed payment';
const BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K = 'checkout resolves workspace through verified request scope, not raw body trust';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const authContext = await requireAuthContext(req, body);
    const workspaceId = asNullableText(await resolveRequestWorkspaceId(req));
    const customerEmail = asNullableText(authContext.email);
    const planKey = asNullableText(body.planKey || req?.headers?.['x-billing-plan']);
    const billingPeriod = asNullableText(body.billingPeriod || req?.headers?.['x-billing-period']);
    const dryRun = body.dryRun === true || body.dryRun === '1' || req?.headers?.['x-billing-dry-run'] === '1';

    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }
    // STAGE15D_SCOPED_BILLING_CHECKOUT_NO_RAW_WORKSPACE_HINT

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
        workspaceId,
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
          message: 'Stripe nie jest jeszcze skonfigurowany. UzupeĹ‚nij STRIPE_SECRET_KEY w Vercel. DostÄ™p pĹ‚atny aktywuje wyĹ‚Ä…cznie webhook Stripe po potwierdzeniu pĹ‚atnoĹ›ci.',
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