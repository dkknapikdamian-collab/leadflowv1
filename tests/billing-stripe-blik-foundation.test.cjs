const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test('billing page uses Stripe BLIK checkout and does not activate paid plan directly', () => {
  const billing = read('src/pages/Billing.tsx');

  assert.match(billing, /createBillingCheckoutSessionInSupabase/);
  assert.match(billing, /Stripe\/BLIK/);
  assert.match(billing, /BLIK przez Stripe/);
  assert.match(billing, /Przejdz do platnosci/);

  assert.doesNotMatch(billing, /updateWorkspaceSubscriptionInSupabase/);
  assert.doesNotMatch(billing, /subscriptionStatus:\s*'paid_active'/);
  assert.doesNotMatch(billing, /Przelewy24/);
});

test('Stripe BLIK API foundation exists and uses Stripe env contract', () => {
  assert.ok(exists('api/_stripe.ts'));
  assert.ok(exists('api/billing-checkout.ts'));
  assert.ok(exists('api/stripe-webhook.ts'));

  const helper = read('api/_stripe.ts');
  const checkout = read('api/billing-checkout.ts');
  const webhook = read('api/stripe-webhook.ts');

  assert.match(helper, /STRIPE_SECRET_KEY/);
  assert.match(helper, /STRIPE_WEBHOOK_SECRET/);
  assert.match(helper, /STRIPE_PRICE_BASIC_MONTHLY_PLN/);
  assert.match(helper, /STRIPE_PRICE_BASIC_YEARLY_PLN/);
  assert.match(helper, /STRIPE_PRICE_PRO_MONTHLY_PLN/);
  assert.match(helper, /STRIPE_PRICE_PRO_YEARLY_PLN/);
  assert.match(helper, /STRIPE_PRICE_BUSINESS_MONTHLY_PLN/);
  assert.match(helper, /STRIPE_PRICE_BUSINESS_YEARLY_PLN/);
  assert.match(helper, /checkout\/sessions/);
  assert.match(helper, /payment_method_types\[1\]/);
  assert.match(helper, /blik/);
  assert.match(helper, /mode', 'payment'/);

  assert.match(checkout, /provider: 'stripe_blik'/);
  assert.match(checkout, /STRIPE_PROVIDER_NOT_CONFIGURED/);

  assert.match(webhook, /STRIPE_WEBHOOK_ENDPOINT = 'stripe-webhook'/);
  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
  assert.match(webhook, /subscription_status: 'paid_active'/);
  assert.match(webhook, /billing_provider: 'stripe_blik'/);
  assert.match(webhook, /next_billing_at/);
});

test('P24 artifacts are not active after Stripe BLIK decision', () => {
  assert.equal(exists('api/_p24.ts'), false);
  assert.equal(exists('api/p24-webhook.ts'), false);
  assert.equal(exists('tests/billing-przelewy24-foundation.test.cjs'), false);
});

test('client API exposes generic billing checkout helper only', () => {
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(fallback, /createBillingCheckoutSessionInSupabase/);
  assert.match(fallback, /\/api\/billing-checkout/);
  assert.doesNotMatch(fallback, /createBillingPortalSessionInSupabase/);
});

test('paid Stripe BLIK access expires when nextBillingAt is in the past', () => {
  const access = read('src/lib/access.ts');

  assert.match(access, /isBillingDateExpired/);
  assert.match(access, /workspace\?\.nextBillingAt/);
  assert.match(access, /Oplacony okres dostepu minal/);
});

test('release gates include Stripe BLIK billing foundation test and not P24 test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/billing-stripe-blik-foundation\.test\.cjs/);
  assert.match(fullGate, /tests\/billing-stripe-blik-foundation\.test\.cjs/);

  assert.doesNotMatch(quietGate, /tests\/billing-przelewy24-foundation\.test\.cjs/);
  assert.doesNotMatch(fullGate, /tests\/billing-przelewy24-foundation\.test\.cjs/);
});

