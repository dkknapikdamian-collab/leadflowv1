import billingCheckoutHandler from '../src/server/billing-checkout-handler.js';
import billingActionsHandler from '../src/server/billing-actions-handler.js';
import billingWebhookHandler from '../src/server/billing-webhook-handler.js';
import { readRawBody } from '../src/server/_stripe.js';

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

function asRoute(req: any) {
  return asText(req?.query?.route).toLowerCase();
}

export default async function handler(req: any, res: any) {
  const route = asRoute(req);

  if (route === 'webhook' || route === 'stripe-webhook') {
    await billingWebhookHandler(req, res);
    return;
  }

  if (req.method && req.method !== 'GET') {
    const rawBody = await readRawBody(req);
    req.body = rawBody || '';
  }

  if (route === 'checkout') {
    await billingCheckoutHandler(req, res);
    return;
  }

  if (route === 'actions') {
    await billingActionsHandler(req, res);
    return;
  }

  res.status(400).json({ error: 'BILLING_ROUTE_REQUIRED' });
}
