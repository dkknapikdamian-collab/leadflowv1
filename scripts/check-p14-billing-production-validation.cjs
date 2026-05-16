#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

function includesAny(text, variants) {
  return variants.some((variant) => text.includes(variant));
}

const stripe = read('src/server/_stripe.ts');
const checkout = read('src/server/billing-checkout-handler.ts');
const webhook = read('src/server/billing-webhook-handler.ts');
const actions = read('src/server/billing-actions-handler.ts');
const billing = read('src/pages/Billing.tsx');
const plans = read('src/lib/plans.ts');
const accessGate = read('src/server/_access-gate.ts');
const apiCheckout = read('api/billing-checkout.ts');
const apiStripeWebhook = read('api/stripe-webhook.ts');
const vercel = JSON.parse(read('vercel.json'));
const pkg = JSON.parse(read('package.json'));

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
const hasRewrite = (source, destination) => rewrites.some((item) => item.source === source && item.destination === destination);

expect(!exists('api/billing.ts'), 'api/billing.ts must not exist on Vercel Hobby; billing is consolidated into existing entrypoints');
expect(!exists('api/billing-actions.ts'), 'api/billing-actions.ts must not exist on Vercel Hobby; billing actions must route through api/billing-checkout.ts');
expect(!exists('api/billing-webhook.ts'), 'api/billing-webhook.ts must not exist on Vercel Hobby; billing webhook must route through api/stripe-webhook.ts');

expect(apiCheckout.includes('STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT'), 'api/billing-checkout.ts must carry Stage86H consolidated entrypoint marker');
expect(apiCheckout.includes('billing-checkout-handler'), 'api/billing-checkout.ts must route checkout');
expect(apiCheckout.includes('billing-actions-handler'), 'api/billing-checkout.ts must route billing actions');
expect(apiCheckout.includes("route === 'actions'"), 'api/billing-checkout.ts must route actions');
expect(apiStripeWebhook.includes('billing-webhook-handler'), 'api/stripe-webhook.ts must delegate to billing-webhook-handler');
expect(apiStripeWebhook.includes('STAGE86H_VERCEL_HOBBY_STRIPE_WEBHOOK_SINGLE_ENTRYPOINT'), 'api/stripe-webhook.ts must carry Stage86H webhook marker');

expect(hasRewrite('/api/billing-actions', '/api/billing-checkout?route=actions'), 'vercel rewrite must route /api/billing-actions to /api/billing-checkout?route=actions');
expect(hasRewrite('/api/billing-webhook', '/api/stripe-webhook?route=webhook'), 'vercel rewrite must route /api/billing-webhook to /api/stripe-webhook?route=webhook');
expect(hasRewrite('/api/billing', '/api/billing-checkout?route=checkout'), 'vercel rewrite must route /api/billing to /api/billing-checkout?route=checkout');
expect(!rewrites.some((item) => String(item.destination || '').startsWith('/api/billing?route=')), 'vercel rewrites must not target removed api/billing.ts');

const apiDir = path.join(root, 'api');
const apiFiles = fs.readdirSync(apiDir)
  .filter((name) => /\.(ts|js|mjs)$/.test(name))
  .filter((name) => !name.endsWith('.d.ts'));
expect(apiFiles.length <= 12, `Vercel Hobby serverless function budget exceeded: ${apiFiles.length}/12 top-level api files: ${apiFiles.join(', ')}`);

expect(stripe.includes('ai_monthly'), 'Stripe plan map must include ai_monthly');
expect(stripe.includes('ai_yearly'), 'Stripe plan map must include ai_yearly');
expect(stripe.includes("planId: 'closeflow_ai'"), 'Stripe AI monthly must use closeflow_ai');
expect(stripe.includes("planId: 'closeflow_ai_yearly'"), 'Stripe AI yearly must use closeflow_ai_yearly');
expect(stripe.includes("planKey: 'ai'"), 'Stripe AI plans must emit planKey ai');
expect(!stripe.includes("planKey: 'business'"), 'Stripe must not emit business plan key');
expect(!stripe.includes('business_monthly'), 'Stripe must not keep business_monthly key');
expect(stripe.includes("if (normalized === 'business' || normalized === 'closeflow_business')"), 'Stripe must keep business alias mapped to ai for compatibility');
expect(stripe.includes("params.set('mode', 'subscription')"), 'Stripe checkout must be subscription mode');
expect(!stripe.includes("params.set('mode', 'payment')"), 'Stripe checkout must not use payment mode with subscription_data');
expect(stripe.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'), 'Stripe subscription checkout must carry Stage86O card-only marker');
expect(!stripe.includes("params.set('payment_method_types[1]', 'blik')"), 'Stripe subscription checkout must not include BLIK because Stripe rejects BLIK in subscription mode');
expect(stripe.includes('recurring][interval]'), 'Stripe checkout must set recurring interval');
expect(stripe.includes('subscription_data[metadata][workspace_id]'), 'Stripe checkout must keep subscription metadata for webhook paid activation');

expect(checkout.includes('dryRun'), 'checkout handler must keep dryRun');
expect(checkout.includes('checkoutConfigured'), 'dryRun must return checkoutConfigured');
expect(checkout.includes('webhookConfigured'), 'dryRun must return webhookConfigured');
expect(checkout.includes('STRIPE_SECRET_KEY'), 'checkout copy must mention STRIPE_SECRET_KEY configuration');
expect(checkout.includes('BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J') || includesAny(checkout, ['Dost\u0119p p\u0142atny aktywuje wy\u0142\u0105cznie webhook Stripe', 'Dostep platny aktywuje wylacznie webhook Stripe']), 'checkout must state webhook is paid access source');
expect(checkout.includes('BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K'), 'checkout must resolve workspace through verified request scope');
expect(checkout.includes('resolveRequestWorkspaceId(req, body)'), 'checkout must use resolveRequestWorkspaceId(req, body)');
expect(!checkout.includes('const workspaceId = asNullableText(authContext.workspaceId)'), 'checkout must not rely only on authContext.workspaceId');

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
expect(actions.includes('BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K'), 'billing actions must resolve workspace through verified request scope');
expect(actions.includes('resolveRequestWorkspaceId(req, body)'), 'billing actions must use resolveRequestWorkspaceId(req, body)');
expect(!actions.includes('const workspaceId = asText(auth.workspaceId)'), 'billing actions must not rely only on auth.workspaceId');

expect(billing.includes("type CheckoutPlanKey = 'basic' | 'pro' | 'ai'"), 'Billing UI checkout type must be basic/pro/ai');
expect(billing.includes("checkoutKey: 'ai'"), 'Billing UI must send ai checkout key');
expect(billing.includes("id: 'closeflow_ai'"), 'Billing UI AI plan must use closeflow_ai');
expect(!billing.includes("checkoutKey: 'business'"), 'Billing UI must not send business checkout key');
expect(billing.includes('BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J') || includesAny(billing, ['Aktywny plan pojawi si\u0119 dopiero po webhooku Stripe', 'Aktywny plan pojawi sie dopiero po webhooku Stripe']), 'Billing UI must say webhook activates paid plan');
expect(!billing.includes('P\u0142atno\u015B\u0107 zako\u0144czona. Od\u015Bwie\u017Cam status dost\u0119pu'), 'Billing UI must not imply checkout success activates access');

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
console.log(`API_FUNCTION_BUDGET_TOP_LEVEL=${apiFiles.length}/12`);
