const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const ROOT = process.cwd();
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const canonical = 'src/lib/source-of-truth/billing-options.ts';
const billingPage = 'src/pages/Billing.tsx';

test('CZ2-006 billing plan options contain free/basic/pro/ai', () => {
  const source = read(canonical);
  for (const key of ['free', 'basic', 'pro', 'ai']) {
    assert.match(source, new RegExp(`key:\\s*'${key}'`), `BILLING_PLAN_OPTIONS missing ${key}`);
  }
});

test('CZ2-006 billing prices and badges preserve current copy', () => {
  const source = read(canonical);
  assert.match(source, /key:\s*'basic'[\s\S]*?monthlyPrice:\s*19[\s\S]*?yearlyPrice:\s*190/);
  assert.match(source, /key:\s*'pro'[\s\S]*?monthlyPrice:\s*39[\s\S]*?yearlyPrice:\s*390[\s\S]*?badge:\s*'Najlepszy wybór'/);
  assert.match(source, /key:\s*'ai'[\s\S]*?monthlyPrice:\s*69[\s\S]*?yearlyPrice:\s*690[\s\S]*?badge:\s*'Beta'/);
});

test('CZ2-006 billing helpers preserve period labels and access CTA copy', () => {
  const source = read(canonical);
  assert.match(source, /period === 'yearly' \? '\/rok' : '\/30 dni'/);
  assert.match(source, /trial_active:[\s\S]*?cta:\s*'Przejdź do płatności'/);
  assert.match(source, /paid_active:[\s\S]*?cta:\s*'Zarządzaj planem'/);
});

test('CZ2-006 billing limit tone preserves class names', () => {
  const source = read(canonical);
  assert.match(source, /if \(value === 'Gotowe'\) return 'billing-limit-ok'/);
  assert.match(source, /if \(value === 'Wymaga konfiguracji'\) return 'billing-limit-warn'/);
  assert.match(source, /if \(value === 'Niedostępne w Twoim planie'\) return 'billing-limit-locked'/);
});

test('CZ2-006 Billing.tsx consumes billing-options without local billing metadata', () => {
  const source = read(billingPage);
  assert.match(source, /from '\.\.\/lib\/source-of-truth\/billing-options'/);
  assert.doesNotMatch(source, /type\s+CheckoutPlanKey\s*=/);
  assert.doesNotMatch(source, /type\s+PlanAvailability\s*=/);
  assert.doesNotMatch(source, /type\s+PlanCard\s*=/);
  assert.doesNotMatch(source, /const\s+BILLING_PLANS\s*[:=]/);
  assert.doesNotMatch(source, /const\s+ACCESS_COPY\s*[:=]/);
  assert.doesNotMatch(source, /const\s+LIMIT_ITEMS\s*[:=]/);
  assert.doesNotMatch(source, /const\s+SETTLEMENT_STATUS_LABELS\s*[:=]/);
});

test('CZ2-006 Billing.tsx still keeps checkout, billing action, settlements and UTF-8 clean', () => {
  const source = read(billingPage);
  assert.match(source, /createBillingCheckoutSessionInSupabase/);
  assert.match(source, /billingActionInSupabase/);
  assert.match(source, /fetchPaymentsFromSupabase/);
  assert.doesNotMatch(source, /Ä|Ă|Ĺ|â€|�/);
});
