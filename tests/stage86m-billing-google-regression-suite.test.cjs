const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const exists = (file) => fs.existsSync(path.join(root, file));
const json = (file) => JSON.parse(read(file));

test('Stage86M protects Vercel Hobby API budget and billing rewrites', () => {
  const vercel = json('vercel.json');
  const apiFiles = fs.readdirSync(path.join(root, 'api'))
    .filter((name) => /\.(ts|js|mjs)$/.test(name))
    .filter((name) => !name.endsWith('.d.ts'));

  assert.ok(apiFiles.length <= 12, `api files: ${apiFiles.join(', ')}`);
  assert.equal(exists('api/billing.ts'), false);
  assert.equal(exists('api/billing-actions.ts'), false);
  assert.equal(exists('api/billing-webhook.ts'), false);

  const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
  assert.ok(rewrites.some((item) => item.source === '/api/billing-actions' && item.destination === '/api/billing-checkout?route=actions'));
  assert.ok(rewrites.some((item) => item.source === '/api/billing-webhook' && item.destination === '/api/stripe-webhook?route=webhook'));
  assert.ok(rewrites.some((item) => item.source === '/api/billing' && item.destination === '/api/billing-checkout?route=checkout'));
});

test('Stage86M protects Stripe subscription checkout and webhook source of truth', () => {
  const stripe = read('src/server/_stripe.ts');
  const webhook = read('src/server/billing-webhook-handler.ts');

  assert.ok(stripe.includes("params.set('mode', 'subscription')"));
  assert.equal(stripe.includes("params.set('mode', 'payment')"), false);
  assert.ok(stripe.includes('subscription_data[metadata][workspace_id]'));
  assert.ok(stripe.includes('line_items[0][price_data][recurring][interval]'));
  assert.ok(stripe.includes('STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH'));
  assert.equal(stripe.includes("params.set('payment_method_types[1]', 'blik')"), false);

  assert.ok(webhook.includes('BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14'));
  assert.ok(webhook.includes("type === 'checkout.session.completed'"));
  assert.ok(webhook.includes("type === 'invoice.payment_failed'"));
  assert.ok(webhook.includes("'payment_failed'"));
});

test('Stage86M protects verified workspace resolution for billing checkout/actions', () => {
  const checkout = read('src/server/billing-checkout-handler.ts');
  const actions = read('src/server/billing-actions-handler.ts');

  assert.ok(checkout.includes('BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K'));
  assert.ok(checkout.includes('resolveRequestWorkspaceId(req, body)'));
  assert.equal(checkout.includes('const workspaceId = asNullableText(authContext.workspaceId)'), false);
  assert.ok(checkout.includes('requestedWorkspaceId && requestedWorkspaceId !== workspaceId'));

  assert.ok(actions.includes('BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K'));
  assert.ok(actions.includes('resolveRequestWorkspaceId(req, body)'));
  assert.equal(actions.includes('const workspaceId = asText(auth.workspaceId)'), false);
});

test('Stage86M protects access gate blocked statuses before paid aliases', () => {
  const accessGate = read('src/server/_access-gate.ts');
  const allowedIndex = accessGate.indexOf('function isAllowedWriteStatus');
  const blockedIndex = accessGate.indexOf('isBlockedBillingAccessStatus(status)', allowedIndex);
  const paidIndex = accessGate.indexOf("status === 'paid_active'", allowedIndex);

  assert.ok(accessGate.includes('BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14'));
  assert.ok(accessGate.includes('BILLING_BLOCKED_ACCESS_STATUS_STAGE86B'));
  for (const status of ['payment_failed', 'trial_expired', 'inactive', 'canceled']) {
    assert.ok(accessGate.includes(`status: '${status}'`));
  }
  assert.ok(blockedIndex > allowedIndex);
  assert.ok(blockedIndex < paidIndex);
});

test('Stage86M protects Google Calendar env/OAuth/sync contract', () => {
  const handler = read('src/server/google-calendar-handler.ts');
  const sync = read('src/server/google-calendar-sync.ts');

  for (const needle of [
    'resolveRequestWorkspaceId(req, body)',
    "action === 'callback'",
    "action === 'status'",
    "action === 'connect'",
    "action === 'disconnect'",
    "action === 'sync-inbound'",
    "action === 'sync-outbound'",
    'GOOGLE_CALENDAR_CONFIG_REQUIRED',
  ]) {
    assert.ok(handler.includes(needle), needle);
  }

  for (const needle of [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'GOOGLE_TOKEN_ENCRYPTION_KEY',
    'GOOGLE_OAUTH_STATE_SECRET',
    'verifyGoogleOAuthState',
    'exchangeGoogleCalendarCode',
    'createGoogleCalendarEvent',
    'listGoogleCalendarEvents',
  ]) {
    assert.ok(sync.includes(needle), needle);
  }
});

test('Stage86M protects package scripts and no-BOM JSON', () => {
  const pkgPath = path.join(root, 'package.json');
  const bytes = fs.readFileSync(pkgPath);
  assert.equal(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf, false);

  const pkg = json('package.json');
  for (const scriptName of [
    'check:stage86m-billing-google-regression-suite',
    'test:stage86m-billing-google-regression-suite',
    'verify:stage86-billing-google-hardening',
    'check:p14-billing-production-validation',
    'check:stage86k-billing-workspace-resolution',
  ]) {
    assert.ok(pkg.scripts[scriptName], scriptName);
  }
});
