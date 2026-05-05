import checkoutHandler from '../src/server/billing-checkout-handler.js';
import actionsHandler from '../src/server/billing-actions-handler.js';

function asRouteValue(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').trim().toLowerCase();
}

function resolveBillingRoute(req: any) {
  const explicit = asRouteValue(req?.query?.route || req?.query?.action);
  if (explicit) return explicit;

  const url = String(req?.url || '').toLowerCase();
  if (url.includes('billing-actions')) return 'actions';
  if (url.includes('billing-action')) return 'actions';
  return 'checkout';
}

// STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT
// Vercel Hobby counts every file under /api as a Serverless Function.
// Checkout and cancel/resume share this existing entrypoint to avoid adding extra functions.
export default async function handler(req: any, res: any) {
  const route = resolveBillingRoute(req);

  if (route === 'actions' || route === 'action' || route === 'cancel' || route === 'resume') {
    return actionsHandler(req, res);
  }

  return checkoutHandler(req, res);
}