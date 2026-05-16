#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) failures.push(message); };

const billingCheckout = read('api/billing-checkout.ts');
const stripeWebhook = read('api/stripe-webhook.ts');
const vercel = JSON.parse(read('vercel.json'));
const stripe = read('src/server/_stripe.ts');

expect(!exists('api/billing.ts'), 'api/billing.ts must not exist on Vercel Hobby because it adds a serverless function');
expect(!exists('api/billing-actions.ts'), 'api/billing-actions.ts must not exist on Vercel Hobby because billing-actions is routed through api/billing-checkout.ts');
expect(!exists('api/billing-webhook.ts'), 'api/billing-webhook.ts must not exist on Vercel Hobby because billing-webhook is routed through api/stripe-webhook.ts');

expect(billingCheckout.includes('STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT'), 'billing-checkout entrypoint must carry Stage86H marker');
expect(billingCheckout.includes('billing-checkout-handler'), 'billing-checkout entrypoint must keep checkout handler');
expect(billingCheckout.includes('billing-actions-handler'), 'billing-checkout entrypoint must handle billing actions');
expect(billingCheckout.includes("route === 'actions'"), 'billing-checkout entrypoint must route actions');

expect(stripeWebhook.includes('billing-webhook-handler'), 'stripe-webhook must delegate to billing-webhook-handler');
expect(stripeWebhook.includes('STAGE86H_VERCEL_HOBBY_STRIPE_WEBHOOK_SINGLE_ENTRYPOINT'), 'stripe-webhook must carry Stage86H marker');

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
const hasRewrite = (source, destination) => rewrites.some((item) => item.source === source && item.destination === destination);
expect(hasRewrite('/api/billing-actions', '/api/billing-checkout?route=actions'), 'vercel rewrite must route billing-actions to billing-checkout entrypoint');
expect(hasRewrite('/api/billing-webhook', '/api/stripe-webhook?route=webhook'), 'vercel rewrite must route billing-webhook to stripe-webhook entrypoint');
expect(!rewrites.some((item) => item.destination === '/api/billing?route=actions'), 'billing-actions must not target removed api/billing function');
expect(!rewrites.some((item) => item.destination === '/api/billing?route=webhook'), 'billing-webhook must not target removed api/billing function');

expect(stripe.includes("params.set('mode', 'subscription')"), 'Stripe checkout must use subscription mode');
expect(!stripe.includes("params.set('mode', 'payment')"), 'Stripe checkout must not use payment mode with subscription_data');
expect(stripe.includes('subscription_data[metadata][workspace_id]'), 'Stripe checkout must keep subscription metadata for webhook paid activation');
expect(stripe.includes('line_items[0][price_data][recurring][interval]'), 'Stripe checkout subscription mode must include recurring interval');

const apiDir = path.join(root, 'api');
const apiFiles = fs.readdirSync(apiDir)
  .filter((name) => /\.(ts|js|mjs)$/.test(name))
  .filter((name) => !name.endsWith('.d.ts'));
if (apiFiles.length > 12) {
  failures.push(`Vercel Hobby serverless function budget exceeded: ${apiFiles.length}/12 top-level api files: ${apiFiles.join(', ')}`);
}

if (failures.length) {
  console.error('Stage86H Vercel Hobby billing consolidation failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('PASS STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATION');
console.log(`API_FUNCTION_BUDGET_TOP_LEVEL=${apiFiles.length}/12`);
