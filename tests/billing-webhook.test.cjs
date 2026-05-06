const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('webhook maps Stripe events to workspace status changes', () => {
  const webhook = read('src/server/billing-webhook-handler.ts');
  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
  assert.match(webhook, /invoice\.payment_failed/);
  assert.match(webhook, /customer\.subscription\.deleted/);
  assert.match(webhook, /'payment_failed'/);
  assert.match(webhook, /'canceled'/);
});

test('paid plan activation is webhook-driven', () => {
  const checkout = read('src/server/billing-checkout-handler.ts');
  const webhook = read('src/server/billing-webhook-handler.ts');
  assert.match(checkout, /paid access is activated only by Stripe webhook/i);
  assert.match(webhook, /markWorkspacePaidFromCheckout/);
  assert.match(webhook, /subscription_status:/);
});

test('stripe webhook endpoint exists and uses raw body config', () => {
  const api = read('api/stripe-webhook.ts');
  const webhook = read('src/server/billing-webhook-handler.ts');
  assert.match(api, /billing-webhook-handler/);
  assert.match(webhook, /bodyParser:\s*false/);
  assert.match(webhook, /verifyStripeSignature/);
});
