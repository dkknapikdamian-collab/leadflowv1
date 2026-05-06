const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('checkout supports basic/pro/ai and yearly/monthly', () => {
  const stripe = read('src/server/_stripe.ts');
  assert.match(stripe, /basic_monthly/);
  assert.match(stripe, /pro_monthly/);
  assert.match(stripe, /ai_monthly/);
  assert.match(stripe, /basic_yearly/);
  assert.match(stripe, /pro_yearly/);
  assert.match(stripe, /ai_yearly/);
});

test('checkout uses Stripe subscription mode and returns to app billing page', () => {
  const stripe = read('src/server/_stripe.ts');
  assert.match(stripe, /params\.set\('mode', 'subscription'\)/);
  assert.match(stripe, /success_url.*\/billing\?checkout=success/);
  assert.match(stripe, /cancel_url.*\/billing\?checkout=cancelled/);
});

test('checkout requires Stripe secret and does not fake success when missing', () => {
  const stripe = read('src/server/_stripe.ts');
  const handler = read('src/server/billing-checkout-handler.ts');
  assert.match(stripe, /STRIPE_PROVIDER_NOT_CONFIGURED/);
  assert.match(handler, /STRIPE_PROVIDER_NOT_CONFIGURED/);
  assert.match(handler, /status\(501\)/);
});
