#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) failures.push(message); };

const stripe = read('src/server/_stripe.ts');
const billing = exists('src/pages/Billing.tsx') ? read('src/pages/Billing.tsx') : '';
const p14 = exists('scripts/check-p14-billing-production-validation.cjs') ? read('scripts/check-p14-billing-production-validation.cjs') : '';
const mGuard = exists('scripts/check-stage86m-billing-google-regression-suite.cjs') ? read('scripts/check-stage86m-billing-google-regression-suite.cjs') : '';

expect(stripe.includes("params.set('mode', 'subscription')"), 'Stripe checkout must stay in subscription mode for recurring cancel/resume');
expect(stripe.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'), 'Stripe checkout must document card-only subscription rule');
expect(stripe.includes("params.set('payment_method_types[0]', 'card')"), 'Stripe subscription checkout must include card');
expect(!stripe.includes("params.set('payment_method_types[1]', 'blik')"), 'Stripe subscription checkout must not include BLIK');
expect(stripe.includes('subscription_data[metadata][workspace_id]'), 'Stripe subscription checkout must preserve workspace metadata');
expect(stripe.includes('line_items[0][price_data][recurring][interval]'), 'Stripe subscription checkout must preserve recurring interval');

expect(!billing.includes('Stripe/BLIK'), 'Billing UI must not promise Stripe/BLIK for recurring subscription checkout');
expect(billing.includes('BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O') || billing.length === 0, 'Billing UI must carry Stage86O card-only marker');

expect(p14.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'), 'P14 must protect card-only subscription rule');
expect(p14.includes('must not include BLIK'), 'P14 must explicitly block BLIK in subscription checkout');

if (mGuard) {
  expect(mGuard.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'), 'Stage86M guard must protect card-only subscription rule');
  expect(mGuard.includes('must not include BLIK'), 'Stage86M guard must block BLIK regression');
}

if (failures.length) {
  console.error('Stage86O Stripe card-only safe patch guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('PASS STAGE86O_STRIPE_CARD_ONLY_SAFE_PATCH');
