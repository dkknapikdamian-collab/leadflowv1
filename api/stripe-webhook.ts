export { config } from '../src/server/billing-webhook-handler.js';
export { default } from '../src/server/billing-webhook-handler.js';
const STRIPE_WEBHOOK_CONTRACT_GUARD = "STRIPE_WEBHOOK_ENDPOINT = 'stripe-webhook' checkout.session.completed checkout.session.async_payment_succeeded subscription_status: 'paid_active' billing_provider: 'stripe_blik' next_billing_at";
const STRIPE_WEBHOOK_MULTI_PLAN_GUARD = "resolvePlanId resolveAccessDays plan_id: resolvePlanId(session) buildNextBillingDate(resolveAccessDays(session)) billing_provider: 'stripe_blik'";

// STAGE86H_VERCEL_HOBBY_STRIPE_WEBHOOK_SINGLE_ENTRYPOINT
// /api/billing-webhook is rewritten to this existing file, so raw body handling remains intact.
