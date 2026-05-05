const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('Stage86 billing router preserves raw Stripe webhook and routes checkout/actions', () => {
  const apiBilling = read('api/billing.ts');
  assert.match(apiBilling, /bodyParser:\s*false/);
  assert.match(apiBilling, /route === 'checkout'/);
  assert.match(apiBilling, /route === 'actions'/);
  assert.match(apiBilling, /route === 'webhook'/);
  assert.match(apiBilling, /return webhookHandler\(req, res\);/);
});

test('Stage86 Stripe checkout is subscription based and webhook is paid access source of truth', () => {
  const stripe = read('src/server/_stripe.ts');
  const webhook = read('src/server/billing-webhook-handler.ts');
  assert.match(stripe, /params\.set\('mode', 'subscription'\)/);
  assert.doesNotMatch(stripe, /params\.set\('mode', 'payment'\)/);
  assert.match(stripe, /price_data\]\[recurring\]\[interval\]/);
  assert.match(webhook, /subscription_status: subscriptionStatus/);
  assert.match(webhook, /updateWhere\(`workspaces\?id=eq\./);
});

test('Stage86 Google Calendar missing env is configuration state, not user error', () => {
  const settings = read('src/pages/Settings.tsx');
  assert.match(settings, /GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86/);
  assert.match(settings, /Google Calendar wymaga konfiguracji w Vercel/);
  assert.doesNotMatch(settings, /Brakuje ENV Google:/);
});
