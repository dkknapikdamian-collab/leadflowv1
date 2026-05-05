#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) fail.push(message); };

const p14 = read('scripts/check-p14-billing-production-validation.cjs');
const checkout = read('api/billing-checkout.ts');
const webhook = read('api/stripe-webhook.ts');
const vercel = JSON.parse(read('vercel.json'));

expect(p14.includes("!exists('api/billing.ts')"), 'P14 must assert removed api/billing.ts for Hobby consolidation');
expect(p14.includes("api/billing-checkout.ts"), 'P14 must validate api/billing-checkout.ts consolidated entrypoint');
expect(p14.includes("api/stripe-webhook.ts"), 'P14 must validate api/stripe-webhook.ts webhook entrypoint');
expect(p14.includes('API_FUNCTION_BUDGET_TOP_LEVEL'), 'P14 must report API function budget');
expect(checkout.includes('STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT'), 'billing-checkout must carry Stage86H marker');
expect(webhook.includes('STAGE86H_VERCEL_HOBBY_STRIPE_WEBHOOK_SINGLE_ENTRYPOINT'), 'stripe-webhook must carry Stage86H marker');
expect(!exists('api/billing.ts'), 'api/billing.ts must be removed');
expect(!exists('api/billing-actions.ts'), 'api/billing-actions.ts must be removed');
expect(!exists('api/billing-webhook.ts'), 'api/billing-webhook.ts must be removed');

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
expect(rewrites.some((item) => item.source === '/api/billing-actions' && item.destination === '/api/billing-checkout?route=actions'), 'rewrite for billing-actions missing');
expect(rewrites.some((item) => item.source === '/api/billing-webhook' && item.destination === '/api/stripe-webhook?route=webhook'), 'rewrite for billing-webhook missing');

if (fail.length) {
  console.error('Stage86I P14 Hobby consolidation guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS STAGE86I_P14_HOBBY_CONSOLIDATION_GUARD');