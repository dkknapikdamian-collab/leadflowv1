const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));

test('Stage86H consolidates billing routes without extra Vercel functions', () => {
  const billingCheckout = read('api/billing-checkout.ts');
  const stripeWebhook = read('api/stripe-webhook.ts');
  const vercel = JSON.parse(read('vercel.json'));
  const stripe = read('src/server/_stripe.ts');

  assert.equal(exists('api/billing.ts'), false);
  assert.equal(exists('api/billing-actions.ts'), false);
  assert.equal(exists('api/billing-webhook.ts'), false);

  assert.ok(billingCheckout.includes('billing-checkout-handler'));
  assert.ok(billingCheckout.includes('billing-actions-handler'));
  assert.ok(billingCheckout.includes('STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT'));
  assert.ok(stripeWebhook.includes('billing-webhook-handler'));

  const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
  assert.ok(rewrites.some((item) => item.source === '/api/billing-actions' && item.destination === '/api/billing-checkout?route=actions'));
  assert.ok(rewrites.some((item) => item.source === '/api/billing-webhook' && item.destination === '/api/stripe-webhook?route=webhook'));

  assert.ok(stripe.includes("params.set('mode', 'subscription')"));
  assert.equal(stripe.includes("params.set('mode', 'payment')"), false);
});
