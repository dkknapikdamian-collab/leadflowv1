#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const p14 = read('scripts/check-p14-billing-production-validation.cjs');
const checkout = read('src/server/billing-checkout-handler.ts');
const billing = read('src/pages/Billing.tsx');

expect(checkout.includes('BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J'), 'checkout handler must have stable webhook source-of-truth marker');
expect(billing.includes('BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J'), 'Billing UI must have stable webhook activation marker');
expect(p14.includes('BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J'), 'P14 must validate checkout marker');
expect(p14.includes('BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J'), 'P14 must validate Billing UI marker');
expect(p14.includes('includesAny'), 'P14 must use semantic/fallback copy checks, not only brittle exact Polish strings');

if (fail.length) {
  console.error('Stage86J semantic billing marker guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE86J_P14_SEMANTIC_BILLING_MARKERS');
