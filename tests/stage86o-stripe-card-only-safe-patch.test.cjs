const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage86O Stripe recurring checkout is card-only', () => {
  const stripe = read('src/server/_stripe.ts');

  assert.ok(stripe.includes("params.set('mode', 'subscription')"));
  assert.ok(stripe.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'));
  assert.ok(stripe.includes("params.set('payment_method_types[0]', 'card')"));
  assert.equal(stripe.includes("params.set('payment_method_types[1]', 'blik')"), false);
  assert.ok(stripe.includes('subscription_data[metadata][workspace_id]'));
  assert.ok(stripe.includes('line_items[0][price_data][recurring][interval]'));
});

test('Stage86O P14 and Stage86M guards reject BLIK in subscription checkout', () => {
  const p14 = read('scripts/check-p14-billing-production-validation.cjs');
  const mGuard = read('scripts/check-stage86m-billing-google-regression-suite.cjs');

  assert.ok(p14.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'));
  assert.ok(p14.includes('must not include BLIK'));
  assert.ok(mGuard.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'));
  assert.ok(mGuard.includes('must not include BLIK'));
});
