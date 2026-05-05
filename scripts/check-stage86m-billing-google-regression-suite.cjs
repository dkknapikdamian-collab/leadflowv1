#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = process.cwd();
const failures = [];

function rootPath(file) {
  return path.join(root, file);
}

function exists(file) {
  return fs.existsSync(rootPath(file));
}

function read(file) {
  if (!exists(file)) {
    failures.push(`missing required file: ${file}`);
    return '';
  }
  return fs.readFileSync(rootPath(file), 'utf8').replace(/^\uFEFF/, '');
}

function readBytes(file) {
  if (!exists(file)) return Buffer.alloc(0);
  return fs.readFileSync(rootPath(file));
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectIncludes(text, needle, message) {
  expect(text.includes(needle), message || `missing text: ${needle}`);
}

function expectNotIncludes(text, needle, message) {
  expect(!text.includes(needle), message || `forbidden text: ${needle}`);
}

function expectAny(text, needles, message) {
  expect(needles.some((needle) => text.includes(needle)), message || `missing any of: ${needles.join(' | ')}`);
}

function noBom(file) {
  const bytes = readBytes(file);
  if (!bytes.length) return;
  expect(!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), `${file} must be UTF-8 without BOM`);
}

function nodeCheck(file) {
  if (!exists(file)) {
    failures.push(`cannot syntax-check missing file: ${file}`);
    return;
  }
  const result = childProcess.spawnSync(process.execPath, ['--check', rootPath(file)], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) {
    failures.push(`node --check failed for ${file}: ${(result.stderr || result.stdout || '').trim()}`);
  }
}

function parseJson(file) {
  const text = read(file);
  try {
    return JSON.parse(text);
  } catch (error) {
    failures.push(`${file} must be valid JSON: ${error.message}`);
    return {};
  }
}

function listApiFunctionFiles() {
  const apiDir = rootPath('api');
  if (!fs.existsSync(apiDir)) return [];
  return fs.readdirSync(apiDir)
    .filter((name) => /\.(ts|js|mjs)$/.test(name))
    .filter((name) => !name.endsWith('.d.ts'))
    .sort();
}

const pkg = parseJson('package.json');
const vercel = parseJson('vercel.json');

const stripe = read('src/server/_stripe.ts');
const checkoutHandler = read('src/server/billing-checkout-handler.ts');
const actionsHandler = read('src/server/billing-actions-handler.ts');
const webhookHandler = read('src/server/billing-webhook-handler.ts');
const apiCheckout = read('api/billing-checkout.ts');
const apiWebhook = read('api/stripe-webhook.ts');
const accessGate = read('src/server/_access-gate.ts');
const billingPage = read('src/pages/Billing.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const googleHandler = read('src/server/google-calendar-handler.ts');
const googleSync = read('src/server/google-calendar-sync.ts');
const p14 = read('scripts/check-p14-billing-production-validation.cjs');

console.log('== Stage86M package/json hygiene ==');
noBom('package.json');
noBom('vercel.json');
expect(pkg.scripts && typeof pkg.scripts === 'object', 'package.json must have scripts');
[
  'check:p14-billing-production-validation',
  'check:stage86b-access-gate-billing-truth',
  'check:stage86d-access-gate-block-call',
  'check:stage86k-billing-workspace-resolution',
  'test:stage86k-billing-workspace-resolution',
  'check:stage86m-billing-google-regression-suite',
  'test:stage86m-billing-google-regression-suite',
  'verify:stage86-billing-google-hardening',
].forEach((scriptName) => {
  expect(Boolean(pkg.scripts && pkg.scripts[scriptName]), `package.json missing script ${scriptName}`);
});

console.log('== Stage86M syntax guards ==');
[
  'scripts/check-p14-billing-production-validation.cjs',
  'scripts/check-stage86b-access-gate-billing-truth.cjs',
  'scripts/check-stage86d-access-gate-block-call.cjs',
  'scripts/check-stage86h-vercel-hobby-billing-consolidation.cjs',
  'scripts/check-stage86k-billing-workspace-resolution.cjs',
  'scripts/check-stage86m-billing-google-regression-suite.cjs',
].forEach((file) => {
  if (exists(file)) nodeCheck(file);
  else failures.push(`missing guard script: ${file}`);
});

console.log('== Stage86M Vercel Hobby API budget ==');
const apiFiles = listApiFunctionFiles();
expect(apiFiles.length <= 12, `Vercel Hobby API function budget exceeded: ${apiFiles.length}/12: ${apiFiles.join(', ')}`);
expect(!exists('api/billing.ts'), 'api/billing.ts must stay removed; it adds a serverless function');
expect(!exists('api/billing-actions.ts'), 'api/billing-actions.ts must stay removed; actions route through api/billing-checkout.ts');
expect(!exists('api/billing-webhook.ts'), 'api/billing-webhook.ts must stay removed; webhook route aliases to api/stripe-webhook.ts');

const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
const hasRewrite = (source, destination) => rewrites.some((item) => item.source === source && item.destination === destination);
expect(hasRewrite('/api/billing-actions', '/api/billing-checkout?route=actions'), 'Vercel rewrite missing: /api/billing-actions -> /api/billing-checkout?route=actions');
expect(hasRewrite('/api/billing-webhook', '/api/stripe-webhook?route=webhook'), 'Vercel rewrite missing: /api/billing-webhook -> /api/stripe-webhook?route=webhook');
expect(hasRewrite('/api/billing', '/api/billing-checkout?route=checkout'), 'Vercel rewrite missing: /api/billing -> /api/billing-checkout?route=checkout');
expect(!rewrites.some((item) => String(item.destination || '').startsWith('/api/billing?route=')), 'Vercel rewrites must not target removed /api/billing.ts');

console.log('== Stage86M consolidated billing entrypoints ==');
expectIncludes(apiCheckout, 'STAGE86H_VERCEL_HOBBY_BILLING_CONSOLIDATED_ENTRYPOINT', 'billing checkout entrypoint must keep Stage86H marker');
expectIncludes(apiCheckout, 'billing-checkout-handler', 'api/billing-checkout.ts must delegate checkout');
expectIncludes(apiCheckout, 'billing-actions-handler', 'api/billing-checkout.ts must delegate billing actions');
expectIncludes(apiCheckout, "route === 'actions'", 'api/billing-checkout.ts must route actions');
expectIncludes(apiWebhook, 'STAGE86H_VERCEL_HOBBY_STRIPE_WEBHOOK_SINGLE_ENTRYPOINT', 'api/stripe-webhook.ts must keep Stage86H webhook marker');
expectIncludes(apiWebhook, 'export { config }', 'api/stripe-webhook.ts must export raw-body config');
expectIncludes(apiWebhook, 'billing-webhook-handler', 'api/stripe-webhook.ts must delegate webhook handler');

console.log('== Stage86M Stripe checkout contract ==');
expectIncludes(stripe, "params.set('mode', 'subscription')", 'Stripe checkout must use subscription mode');
expectNotIncludes(stripe, "params.set('mode', 'payment')", 'Stripe checkout must not use payment mode');
expectIncludes(stripe, 'subscription_data[metadata][workspace_id]', 'Stripe checkout must preserve workspace metadata for webhook');
expectIncludes(stripe, 'line_items[0][price_data][recurring][interval]', 'Stripe checkout must use recurring price data');
expectIncludes(stripe, "params.set('payment_method_types[0]', 'card')", 'Stripe checkout must support card');
expectIncludes(stripe, "params.set('payment_method_types[1]', 'blik')", 'Stripe checkout must support BLIK');
expectIncludes(stripe, 'ai_monthly', 'Stripe plan map must include ai_monthly');
expectIncludes(stripe, 'ai_yearly', 'Stripe plan map must include ai_yearly');
expectIncludes(stripe, "planId: 'closeflow_ai'", 'AI monthly must map to closeflow_ai');
expectIncludes(stripe, "planId: 'closeflow_ai_yearly'", 'AI yearly must map to closeflow_ai_yearly');
expectNotIncludes(stripe, "planKey: 'business'", 'Stripe must not emit business plan key');
expectNotIncludes(stripe, 'business_monthly', 'Stripe must not keep business monthly key');

console.log('== Stage86M billing workspace scope ==');
expectIncludes(checkoutHandler, 'BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K', 'checkout handler must keep Stage86K workspace marker');
expectIncludes(checkoutHandler, 'resolveRequestWorkspaceId(req, body)', 'checkout must use verified workspace resolution');
expectNotIncludes(checkoutHandler, 'const workspaceId = asNullableText(authContext.workspaceId)', 'checkout must not rely only on authContext.workspaceId');
expectIncludes(checkoutHandler, 'requestedWorkspaceId && requestedWorkspaceId !== workspaceId', 'checkout must reject mismatched workspaceId');
expectIncludes(actionsHandler, 'BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K', 'billing actions must keep Stage86K workspace marker');
expectIncludes(actionsHandler, 'resolveRequestWorkspaceId(req, body)', 'billing actions must use verified workspace resolution');
expectNotIncludes(actionsHandler, 'const workspaceId = asText(auth.workspaceId)', 'billing actions must not rely only on auth.workspaceId');
expectAny(fallback, ["headers['x-workspace-id'] = workspaceId", 'headers["x-workspace-id"] = workspaceId'], 'client must send x-workspace-id header when workspace context exists');
expectIncludes(fallback, "createBillingCheckoutSessionInSupabase", 'client must expose billing checkout helper');
expectIncludes(fallback, "body: JSON.stringify(input)", 'client checkout helper must send body payload including workspaceId');

console.log('== Stage86M webhook source of truth ==');
expectIncludes(webhookHandler, 'BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14', 'webhook must be marked as paid access source of truth');
expectIncludes(webhookHandler, 'registerWebhookEvent', 'webhook must register events for idempotency');
expectIncludes(webhookHandler, 'duplicate: true', 'webhook must handle duplicates idempotently');
[
  "type === 'checkout.session.completed'",
  "type === 'checkout.session.async_payment_succeeded'",
  "type === 'checkout.session.async_payment_failed'",
  "type === 'invoice.payment_failed'",
  "type === 'customer.subscription.updated'",
  "type === 'customer.subscription.deleted'",
].forEach((needle) => expectIncludes(webhookHandler, needle, `webhook missing handler branch: ${needle}`));
expectIncludes(webhookHandler, "subscription_status: subscriptionStatus", 'webhook must update subscription_status');
expectIncludes(webhookHandler, "'payment_failed'", 'webhook must map failed payments to payment_failed');

console.log('== Stage86M cancel/resume actions ==');
expectIncludes(actionsHandler, "action === 'cancel'", 'billing actions must support cancel');
expectIncludes(actionsHandler, "action === 'resume'", 'billing actions must support resume');
expectIncludes(actionsHandler, 'updateStripeSubscription', 'billing actions must update Stripe subscription');
expectIncludes(actionsHandler, 'cancel_at_period_end: true', 'cancel must set cancel_at_period_end true');
expectIncludes(actionsHandler, 'cancel_at_period_end: false', 'resume must set cancel_at_period_end false');
expectIncludes(actionsHandler, 'subscription_status', 'actions must update local subscription status after Stripe action');

console.log('== Stage86M access gate ==');
expectIncludes(accessGate, 'BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14', 'access gate must document webhook-only paid access');
expectIncludes(accessGate, 'BILLING_BLOCKED_ACCESS_STATUS_STAGE86B', 'access gate must keep blocked billing statuses list');
expectIncludes(accessGate, 'isBlockedBillingAccessStatus(status)', 'access gate must call blocked status helper');
['payment_failed', 'trial_expired', 'inactive', 'canceled'].forEach((status) => {
  expectIncludes(accessGate, `status: '${status}'`, `access gate must block ${status}`);
});
const allowedStatusFunctionIndex = accessGate.indexOf('function isAllowedWriteStatus');
const blockedCallIndex = accessGate.indexOf('isBlockedBillingAccessStatus(status)', allowedStatusFunctionIndex);
const paidActiveIndex = accessGate.indexOf("status === 'paid_active'", allowedStatusFunctionIndex);
expect(allowedStatusFunctionIndex >= 0 && blockedCallIndex > allowedStatusFunctionIndex, 'blocked status call must be inside isAllowedWriteStatus');
expect(blockedCallIndex >= 0 && paidActiveIndex >= 0 && blockedCallIndex < paidActiveIndex, 'blocked billing statuses must be checked before paid_active compatibility');

console.log('== Stage86M Billing UI truth ==');
expectIncludes(billingPage, 'BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J', 'Billing UI must keep webhook activation marker');
expectIncludes(billingPage, 'BILLING_STRIPE_STAGE86_E2E_GATE', 'Billing UI must keep E2E gate marker');
expectIncludes(billingPage, "type CheckoutPlanKey = 'basic' | 'pro' | 'ai'", 'Billing checkout plan keys must be basic/pro/ai');
expectIncludes(billingPage, "checkoutKey: 'ai'", 'Billing UI must send ai checkout key');
expectNotIncludes(billingPage, "checkoutKey: 'business'", 'Billing UI must not send business checkout key');
expectAny(billingPage, ['Aktywny plan pojawi siÄ™ dopiero po webhooku Stripe', 'paid plan appears only after Stripe webhook confirmation'], 'Billing UI must explain webhook activation');
expectNotIncludes(billingPage, 'PĹ‚atnoĹ›Ä‡ zakoĹ„czona. OdĹ›wieĹĽam status dostÄ™pu', 'Billing UI must not imply checkout success activates access before webhook');

console.log('== Stage86M Google Calendar config and sync contract ==');
expectIncludes(googleHandler, 'resolveRequestWorkspaceId(req, body)', 'Google Calendar handler must resolve workspace through request scope');
expectIncludes(googleHandler, "action === 'callback'", 'Google Calendar must handle callback');
expectIncludes(googleHandler, "action === 'status'", 'Google Calendar must handle status');
expectIncludes(googleHandler, "action === 'connect'", 'Google Calendar must handle connect');
expectIncludes(googleHandler, "action === 'disconnect'", 'Google Calendar must handle disconnect');
expectIncludes(googleHandler, "action === 'sync-inbound'", 'Google Calendar must handle sync-inbound');
expectIncludes(googleHandler, "action === 'sync-outbound'", 'Google Calendar must handle sync-outbound');
expectIncludes(googleHandler, "action === 'sync-now'", 'Google Calendar must handle sync-now alias');
expectIncludes(googleHandler, 'getGoogleCalendarConfigStatus', 'Google Calendar handler must read config status');
expectIncludes(googleHandler, "GOOGLE_CALENDAR_CONFIG_REQUIRED", 'Google Calendar missing env must be config-required state');
expectNotIncludes(googleHandler, 'throw new Error("GOOGLE_CALENDAR_CONFIG_REQUIRED")', 'Google Calendar route should respond with controlled config state, not raw throw in handler branch');

expectIncludes(googleSync, 'GOOGLE_CLIENT_ID', 'Google Calendar config must check GOOGLE_CLIENT_ID');
expectIncludes(googleSync, 'GOOGLE_CLIENT_SECRET', 'Google Calendar config must check GOOGLE_CLIENT_SECRET');
expectIncludes(googleSync, 'GOOGLE_REDIRECT_URI', 'Google Calendar config must check GOOGLE_REDIRECT_URI');
expectIncludes(googleSync, 'GOOGLE_TOKEN_ENCRYPTION_KEY', 'Google Calendar config must check GOOGLE_TOKEN_ENCRYPTION_KEY');
expectIncludes(googleSync, 'CRON_SECRET', 'Google Calendar config may fall back to CRON_SECRET');
expectIncludes(googleSync, 'GOOGLE_OAUTH_STATE_SECRET', 'Google Calendar OAuth state must be signed');
expectIncludes(googleSync, 'verifyGoogleOAuthState', 'Google Calendar OAuth callback must verify state');
expectIncludes(googleSync, 'exchangeGoogleCalendarCode', 'Google Calendar must exchange OAuth code');
expectIncludes(googleSync, 'upsertGoogleCalendarConnection', 'Google Calendar must save connection');
expectIncludes(googleSync, 'disconnectGoogleCalendarConnection', 'Google Calendar must support disconnect');
expectIncludes(googleSync, 'createGoogleCalendarEvent', 'Google Calendar must support outbound create');
expectIncludes(googleSync, 'updateGoogleCalendarEvent', 'Google Calendar must support outbound update');
expectIncludes(googleSync, 'deleteGoogleCalendarEvent', 'Google Calendar must support outbound delete');
expectIncludes(googleSync, 'listGoogleCalendarEvents', 'Google Calendar must support inbound list');

console.log('== Stage86M P14 regression guard ==');
expectIncludes(p14, 'api/billing-checkout.ts', 'P14 must validate consolidated checkout entrypoint');
expectIncludes(p14, 'api/stripe-webhook.ts', 'P14 must validate consolidated webhook entrypoint');
expectIncludes(p14, 'API_FUNCTION_BUDGET_TOP_LEVEL', 'P14 must report API function budget');
expectIncludes(p14, 'BILLING_CHECKOUT_RESOLVES_SCOPED_WORKSPACE_STAGE86K', 'P14 must protect checkout workspace resolution');
expectIncludes(p14, 'BILLING_ACTIONS_RESOLVE_SCOPED_WORKSPACE_STAGE86K', 'P14 must protect billing actions workspace resolution');
expectIncludes(p14, 'BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J', 'P14 must protect Billing UI truth marker');

if (failures.length) {
  console.error('STAGE86M billing/google regression suite failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('PASS STAGE86M_BILLING_GOOGLE_REGRESSION_SUITE');
console.log(`API_FUNCTION_BUDGET_TOP_LEVEL=${apiFiles.length}/12`);