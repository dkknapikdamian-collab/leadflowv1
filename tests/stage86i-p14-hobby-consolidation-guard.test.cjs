const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));

test('Stage86I updates P14 to validate Hobby consolidated billing entrypoints', () => {
  const p14 = read('scripts/check-p14-billing-production-validation.cjs');
  const checkout = read('api/billing-checkout.ts');
  const webhook = read('api/stripe-webhook.ts');

  assert.equal(exists('api/billing.ts'), false);
  assert.equal(exists('api/billing-actions.ts'), false);
  assert.equal(exists('api/billing-webhook.ts'), false);

  assert.ok(p14.includes("!exists('api/billing.ts')"));
  assert.ok(p14.includes("api/billing-checkout.ts"));
  assert.ok(p14.includes("api/stripe-webhook.ts"));
  assert.ok(checkout.includes('billing-actions-handler'));
  assert.ok(webhook.includes('billing-webhook-handler'));
});