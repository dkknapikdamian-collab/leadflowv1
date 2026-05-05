#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    fail.push(`Missing file: ${file}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}
function expect(condition, message) {
  if (!condition) fail.push(message);
}

const apiBilling = read('api/billing.ts');
const apiStripeWebhook = read('api/stripe-webhook.ts');
const stripe = read('src/server/_stripe.ts');
const webhook = read('src/server/billing-webhook-handler.ts');
const actions = read('src/server/billing-actions-handler.ts');
const settings = read('src/pages/Settings.tsx');
const docs = read('docs/release/STAGE86_BILLING_STRIPE_GOOGLE_CALENDAR_E2E_2026-05-05.md');
const pkgRaw = read('package.json');
let pkg = {};
try { pkg = JSON.parse(pkgRaw || '{}'); } catch (error) { fail.push('package.json is not valid JSON'); }

expect(apiBilling.includes('bodyParser: false'), 'api/billing.ts must disable bodyParser to preserve Stripe raw body');
expect(apiBilling.includes("route === 'checkout'"), 'api/billing.ts must route checkout');
expect(apiBilling.includes("route === 'actions'"), 'api/billing.ts must route actions');
expect(apiBilling.includes("route === 'webhook'"), 'api/billing.ts must route webhook');
expect(apiBilling.includes('return webhookHandler(req, res);'), 'api/billing.ts must pass webhook request to webhook handler without consuming raw body');
expect(apiBilling.includes('readRawBody'), 'api/billing.ts must use readRawBody only for non-webhook JSON routes');

expect(apiStripeWebhook.includes('billing-webhook-handler'), 'api/stripe-webhook.ts must delegate to billing-webhook-handler, not keep legacy no-write webhook');

expect(stripe.includes("params.set('mode', 'subscription')"), 'Stripe checkout must use subscription mode for cancel/resume');
expect(!stripe.includes("params.set('mode', 'payment')"), 'Stripe checkout must not use one-time payment mode for subscription plans');
expect(stripe.includes("params.set('payment_method_types[1]', 'blik')"), 'Stripe checkout must keep BLIK in checkout method list');
expect(stripe.includes("line_items[0][price_data][recurring][interval]"), 'Stripe price_data must include recurring interval');
expect(stripe.includes("plan.period === 'yearly' ? 'year' : 'month'"), 'Stripe recurring interval must map yearly/monthly');
expect(stripe.includes("subscription_data[metadata][workspace_id]"), 'Stripe subscription metadata must include workspace_id');
expect(stripe.includes("subscription_data[metadata][plan_id]"), 'Stripe subscription metadata must include plan_id');

expect(webhook.includes('BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14'), 'billing webhook must mark paid access source of truth');
expect(webhook.includes('registerWebhookEvent'), 'billing webhook must register webhook events');
expect(webhook.includes('duplicate: true'), 'billing webhook must be idempotent');
expect(webhook.includes("type === 'checkout.session.completed'"), 'billing webhook must handle checkout.session.completed');
expect(webhook.includes("type === 'checkout.session.async_payment_succeeded'"), 'billing webhook must handle async BLIK success');
expect(webhook.includes("subscription_status: subscriptionStatus"), 'billing webhook must write subscription_status from Stripe');
expect(webhook.includes("'payment_failed'"), 'billing webhook must handle payment_failed');
expect(webhook.includes('updateWhere(`workspaces?id=eq.'), 'billing webhook must update workspace row');

expect(actions.includes("action === 'cancel'"), 'billing actions must support cancel');
expect(actions.includes("action === 'resume'"), 'billing actions must support resume');
expect(actions.includes('updateStripeSubscription'), 'billing actions must update Stripe subscription');

expect(settings.includes('GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86'), 'Settings must carry Google Calendar config-not-user-error marker');
expect(settings.includes('Google Calendar wymaga konfiguracji w Vercel'), 'Settings must show missing Google env as configuration requirement');
expect(!settings.includes('Brakuje ENV Google:'), 'Settings must not show missing Google env as raw user error');

expect(docs.includes('checkout → webhook → paid_active → access refresh → cancel/resume'), 'release doc must include Stripe E2E chain');
expect(docs.includes('Google Calendar: env → OAuth → status connected → event sync'), 'release doc must include Google Calendar E2E chain');
expect(docs.includes('NIE SPRZEDAWAĆ PUBLICZNIE'), 'release doc must keep public-sale gate');

expect(pkg.scripts && pkg.scripts['check:stage86-billing-google-e2e-readiness'], 'package.json missing check:stage86-billing-google-e2e-readiness');
expect(pkg.scripts && pkg.scripts['test:stage86-billing-google-e2e-readiness'], 'package.json missing test:stage86-billing-google-e2e-readiness');

if (fail.length) {
  console.error('STAGE86 billing/google readiness guard failed:');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS STAGE86_BILLING_GOOGLE_E2E_READINESS');
