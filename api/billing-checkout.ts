import { asNullableText, createStripeBlikCheckout, getAppUrl, parseBody } from './_stripe.js';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const workspaceId = asNullableText(body.workspaceId || req?.headers?.['x-workspace-id']);
    const customerEmail = asNullableText(body.customerEmail || req?.headers?.['x-user-email']);
    const planKey = asNullableText(body.planKey || req?.headers?.['x-billing-plan']);
    const billingPeriod = asNullableText(body.billingPeriod || req?.headers?.['x-billing-period']);

    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
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
    res.status(500).json({ error: error?.message || 'STRIPE_BLIK_CHECKOUT_FAILED' });
  }
}
