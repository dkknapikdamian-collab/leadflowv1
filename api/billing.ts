import checkoutHandler from '../src/server/billing-checkout-handler.js';
import actionsHandler from '../src/server/billing-actions-handler.js';
import webhookHandler from '../src/server/billing-webhook-handler.js';
import { readRawBody } from '../src/server/_stripe.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function asRouteValue(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').trim().toLowerCase();
}

function getBillingRoute(req: any) {
  const fromQuery = asRouteValue(req?.query?.route || req?.query?.action);
  if (fromQuery) return fromQuery;

  const path = String(req?.url || '').toLowerCase();
  if (path.includes('billing-checkout')) return 'checkout';
  if (path.includes('billing-actions')) return 'actions';
  if (path.includes('billing-webhook') || path.includes('stripe-webhook')) return 'webhook';
  return '';
}

function parseJsonOrEmpty(raw: string) {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function attachJsonBody(req: any) {
  if (req.body !== undefined && req.body !== null) return;
  const rawBody = await readRawBody(req);
  req.rawBody = rawBody;
  req.body = parseJsonOrEmpty(rawBody);
}

export default async function handler(req: any, res: any) {
  const route = getBillingRoute(req);

  if (route === 'webhook' || route === 'stripe-webhook') {
    return webhookHandler(req, res);
  }

  if (route === 'checkout') {
    await attachJsonBody(req);
    return checkoutHandler(req, res);
  }

  if (route === 'actions' || route === 'action') {
    await attachJsonBody(req);
    return actionsHandler(req, res);
  }

  res.status(404).json({
    error: 'BILLING_ROUTE_REQUIRED',
    allowedRoutes: ['checkout', 'actions', 'webhook'],
  });
}
