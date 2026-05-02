#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const stripe = read('src/server/_stripe.ts');
const checkout = read('src/server/billing-checkout-handler.ts');
const webhook = read('src/server/billing-webhook-handler.ts');
const actions = read('src/server/billing-actions-handler.ts');
const billing = read('src/pages/Billing.tsx');
const plans = read('src/lib/plans.ts');
const accessGate = read('src/server/_access-gate.ts');
const apiBilling = read('api/billing.ts');
const pkg = JSON.parse(read('package.json'));

expect(apiBilling.includes("route === 'checkout'"), 'api/billing must route checkout');
expect(apiBilling.includes("route === 'webhook'"), 'api/billing must route webhook');
expect(apiBilling.includes('readRawBody'), 'api/billing must preserve raw body for webhook signature');

expect(stripe.includes('ai_monthly'), 'Stripe plan map must include ai_monthly');
expect(stripe.includes('ai_yearly'), 'Stripe plan map must include ai_yearly');
expect(stripe.includes("planId: 'closeflow_ai'"), 'Stripe AI monthly must use closeflow_ai');
expect(stripe.includes("planId: 'closeflow_ai_yearly'"), 'Stripe AI yearly must use closeflow_ai_yearly');
expect(stripe.includes("planKey: 'ai'"), 'Stripe AI plans must emit planKey ai');
expect(!stripe.includes("planKey: 'business'"), 'Stripe must not emit business plan key');
expect(!stripe.includes('business_monthly'), 'Stripe must not keep business_monthly key');
expect(stripe.includes("if (normalized === 'business' || normalized === 'closeflow_business')"), 'Stripe must keep business alias mapped to ai for compatibility');
expect(stripe.includes("params.set('mode', 'subscription')"), 'Stripe checkout must be subscription mode');
expect(stripe.includes("params.set('payment_method_types[1]', 'blik')"), 'Stripe checkout must include BLIK');
expect(stripe.includes('recurring][interval]'), 'Stripe checkout must set recurring interval');
expect(!stripe.includes('dostep'), 'Stripe labels must use Polish accents');

expect(checkout.includes('dryRun'), 'checkout handler must keep dryRun');
expect(checkout.includes('checkoutConfigured'), 'dryRun must return checkoutConfigured');
expect(checkout.includes('webhookConfigured'), 'dryRun must return webhookConfigured');
expect(checkout.includes('Uzupełnij STRIPE_SECRET_KEY'), 'checkout copy must use Polish accent');
expect(!checkout.includes('Uzupelnij'), 'checkout copy must not contain unaccented Uzupelnij');
expect(checkout.includes('Dostęp płatny aktywuje wyłącznie webhook Stripe'), 'checkout must state webhook is paid access source');

expect(webhook.includes('BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14'), 'webhook must have paid source-of-truth marker');
expect(webhook.includes('registerWebhookEvent'), 'webhook must register events');
expect(webhook.includes('duplicate: true'), 'webhook must handle duplicate events idempotently');
expect(webhook.includes("type === 'checkout.session.completed'"), 'webhook must handle checkout completed');
expect(webhook.includes("type === 'checkout.session.async_payment_succeeded'"), 'webhook must handle async payment success');
expect(webhook.includes("type === 'invoice.payment_failed'"), 'webhook must handle invoice payment failed');
expect(webhook.includes("subscription_status: subscriptionStatus"), 'webhook must be the code path that sets paid status from checkout/subscription');
expect(webhook.includes("'payment_failed'"), 'webhook must map failures to payment_failed');

expect(actions.includes("action === 'cancel'"), 'billing actions must support cancel');
expect(actions.includes("action === 'resume'"), 'billing actions must support resume');
expect(actions.includes('updateStripeSubscription'), 'billing actions must update Stripe subscription when configured');

expect(billing.includes("type CheckoutPlanKey = 'basic' | 'pro' | 'ai'"), 'Billing UI checkout type must be basic/pro/ai');
expect(billing.includes("checkoutKey: 'ai'"), 'Billing UI must send ai checkout key');
expect(billing.includes("id: 'closeflow_ai'"), 'Billing UI AI plan must use closeflow_ai');
expect(!billing.includes("checkoutKey: 'business'"), 'Billing UI must not send business checkout key');
expect(billing.includes('Aktywny plan pojawi się dopiero po webhooku Stripe'), 'Billing UI must say webhook activates paid plan');
expect(!billing.includes('Płatność zakończona. Odświeżam status dostępu'), 'Billing UI must not imply checkout success activates access');

expect(plans.includes('closeflow_ai'), 'plans.ts must know closeflow_ai alias');
expect(plans.includes('closeflow_ai_yearly'), 'plans.ts must know closeflow_ai_yearly alias');
expect(plans.includes("ai: PLAN_IDS.ai"), 'plans.ts must keep ai plan');
expect(plans.includes('closeflow_business'), 'plans.ts may keep closeflow_business as legacy alias to AI');

expect(accessGate.includes('BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14'), 'access gate must mark webhook-only paid access rule');
expect(accessGate.includes("status === 'paid_active'"), 'access gate must use paid_active status');
expect(accessGate.includes("status: 'payment_failed'"), 'access gate must block failed/expired billing');

expect(pkg.scripts && pkg.scripts['check:p14-billing-production-validation'], 'package.json missing check:p14-billing-production-validation');

if (fail.length) {
  console.error('P14 billing production validation guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P14 billing production validation guard passed.');
