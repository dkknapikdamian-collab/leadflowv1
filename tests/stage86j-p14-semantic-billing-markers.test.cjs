const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage86J uses semantic billing markers for webhook source-of-truth copy', () => {
  const p14 = read('scripts/check-p14-billing-production-validation.cjs');
  const checkout = read('src/server/billing-checkout-handler.ts');
  const billing = read('src/pages/Billing.tsx');

  assert.ok(checkout.includes('BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J'));
  assert.ok(billing.includes('BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J'));
  assert.ok(p14.includes('BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J'));
  assert.ok(p14.includes('BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J'));
});