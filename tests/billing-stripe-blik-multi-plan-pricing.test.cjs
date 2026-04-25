const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:test').mock ? require('node:path') : require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Billing page exposes Basic, Pro, Business and monthly/yearly periods', () => {
  const billing = read('src/pages/Billing.tsx');

  assert.match(billing, /BILLING_PLANS/);
  assert.match(billing, /monthlyPrice: 19/);
  assert.match(billing, /yearlyPrice: 190/);
  assert.match(billing, /monthlyPrice: 39/);
  assert.match(billing, /yearlyPrice: 390/);
  assert.match(billing, /monthlyPrice: 69/);
  assert.match(billing, /yearlyPrice: 690/);
  assert.match(billing, /billingPeriod/);
  assert.match(billing, /30 dni/);
  assert.match(billing, /Rok/);
  assert.match(billing, /handleUpgrade\(plan\)/);
});

test('Stripe checkout accepts selected plan and period metadata', () => {
  const stripe = read('api/_stripe.ts');
  const checkout = read('api/billing-checkout.ts');

  assert.match(stripe, /STRIPE_BLIK_BILLING_PLANS/);
  assert.match(stripe, /STRIPE_PRICE_BASIC_MONTHLY_PLN/);
  assert.match(stripe, /STRIPE_PRICE_BASIC_YEARLY_PLN/);
  assert.match(stripe, /STRIPE_PRICE_PRO_MONTHLY_PLN/);
  assert.match(stripe, /STRIPE_PRICE_PRO_YEARLY_PLN/);
  assert.match(stripe, /STRIPE_PRICE_BUSINESS_MONTHLY_PLN/);
  assert.match(stripe, /STRIPE_PRICE_BUSINESS_YEARLY_PLN/);
  assert.match(stripe, /metadata\[plan_id\]/);
  assert.match(stripe, /metadata\[billing_period\]/);
  assert.match(stripe, /metadata\[access_days\]/);
  assert.match(stripe, /payment_method_types\[1\]/);
  assert.match(stripe, /blik/);

  assert.match(checkout, /const planKey = asNullableText/);
  assert.match(checkout, /const billingPeriod = asNullableText/);
  assert.match(checkout, /planKey,/);
  assert.match(checkout, /billingPeriod,/);
});

test('Stripe webhook stores plan id and access duration from metadata', () => {
  const webhook = read('api/stripe-webhook.ts');

  assert.match(webhook, /resolvePlanId/);
  assert.match(webhook, /resolveAccessDays/);
  assert.match(webhook, /plan_id: resolvePlanId\(session\)/);
  assert.match(webhook, /buildNextBillingDate\(resolveAccessDays\(session\)\)/);
  assert.match(webhook, /billing_provider: 'stripe_blik'/);
});

test('client billing helper sends selected plan fields', () => {
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(fallback, /planKey\?: string \| null/);
  assert.match(fallback, /billingPeriod\?: string \| null/);
});

test('release gates include Stripe BLIK multi-plan pricing test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/billing-stripe-blik-multi-plan-pricing\.test\.cjs/);
  assert.match(fullGate, /tests\/billing-stripe-blik-multi-plan-pricing\.test\.cjs/);
});
