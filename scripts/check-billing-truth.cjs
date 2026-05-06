#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const billingPage = read('src/pages/Billing.tsx');
const checkoutHandler = read('src/server/billing-checkout-handler.ts');
const webhookHandler = read('src/server/billing-webhook-handler.ts');
const stripe = read('src/server/_stripe.ts');
const vercel = read('vercel.json');
const systemApi = read('api/system.ts');

assert.match(checkoutHandler, /resolveStripeBillingPlan/);
assert.match(checkoutHandler, /planKey/);
assert.match(checkoutHandler, /billingPeriod/);
assert.match(checkoutHandler, /STRIPE_PROVIDER_NOT_CONFIGURED/);

assert.match(webhookHandler, /checkout\.session\.completed/);
assert.match(webhookHandler, /invoice\.payment_failed/);
assert.match(webhookHandler, /customer\.subscription\.deleted/);

assert.match(stripe, /mapStripeSubscriptionStatus/);
assert.match(stripe, /cancel_at_period_end/);

assert.match(billingPage, /Wymaga konfiguracji/);
assert.match(billingPage, /cancel/i);
assert.match(billingPage, /resume/i);

assert.match(vercel, /"source": "\/api\/billing-webhook"/);
assert.match(vercel, /"destination": "\/api\/stripe-webhook\?route=webhook"/);
assert.match(vercel, /"source": "\/api\/workspace-subscription"/);
assert.match(systemApi, /kind === 'workspace-subscription'/);

console.log('OK check:billing-truth');
