const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const repoRoot = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(repoRoot, p), 'utf8'); }

test('Stripe helper has a single app URL normalizer and adds explicit scheme', () => {
  const helper = read('src/server/_stripe.ts');
  assert.equal((helper.match(/export function normalizeAppUrl/g) || []).length, 1);
  assert.match(helper, /return `https:\/\/\$\{cleaned\}`/);
  assert.match(helper, /return `http:\/\/\$\{cleaned\}`/);
  assert.match(helper, /return normalizeAppUrl\(configured\)/);
  assert.match(helper, /return normalizeAppUrl\(host\)/);
});

test('billing checkout supports dry-run diagnostics before real checkout', () => {
  const api = read('api/billing-checkout.ts');
  assert.match(api, /dryRun/);
  assert.match(api, /getStripeConfig/);
  assert.match(api, /resolveStripeBillingPlan/);
  assert.match(api, /checkoutConfigured/);
  assert.match(api, /webhookConfigured/);
  assert.match(api, /STRIPE_SECRET_KEY/);
  assert.match(api, /STRIPE_WEBHOOK_SECRET/);
  assert.ok(api.indexOf('if (dryRun)') > -1);
  assert.ok(api.indexOf('if (dryRun)') < api.indexOf('createStripeBlikCheckout'));
});

test('client billing helper can request dry-run diagnostics', () => {
  const helper = read('src/lib/supabase-fallback.ts');
  assert.match(helper, /dryRun\?: boolean/);
  assert.match(helper, /checkoutConfigured\?: boolean/);
  assert.match(helper, /webhookConfigured\?: boolean/);
  assert.match(helper, /appUrl\?: string/);
});
