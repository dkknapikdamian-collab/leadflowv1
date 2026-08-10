const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(file) { return fs.readFileSync(file, 'utf8'); }

test('B3 billing checkout and actions require the shared owner/admin authority gate', () => {
  const checkout = read('src/server/billing-checkout-handler.ts');
  const actions = read('src/server/billing-actions-handler.ts');
  const scope = read('src/server/_request-scope.ts');
  assert.match(checkout, /assertWorkspaceOwnerOrAdmin\(workspaceId, req\)/);
  assert.match(actions, /assertWorkspaceOwnerOrAdmin\(workspaceId, req\)/);
  assert.doesNotMatch(scope, /if \(identity\.workspaceId && identity\.workspaceId === normalizedWorkspaceId\) return true/);
  assert.match(scope, /role === 'admin'|role === 'owner'/);
});

test('B3 billing preserves webhook authority and canonical plan drift evidence', () => {
  const system = read('api/system.ts');
  const billingPage = read('src/pages/Billing.tsx');
  const stripe = read('src/server/_stripe.ts');
  const webhook = read('src/server/billing-webhook-handler.ts');
  const billingOptions = read('src/lib/source-of-truth/billing-options.ts');
  assert.match(stripe, /metadata\[workspace_id\]/);
  assert.match(webhook, /verifyStripeSignature/);
  assert.match(webhook, /registerWebhookEvent/);
  assert.match(webhook, /insertWithVariants\(\['billing_events'\]/);
  assert.doesNotMatch(webhook, /billing_webhook_events/);
  assert.match(webhook, /23505/);
  assert.doesNotMatch(webhook, /message\.includes\('409'\)/);
  assert.match(webhook, /processing_status/);
  assert.match(webhook, /markWebhookEventFailed/);
  assert.match(webhook, /CHECKOUT_PAYMENT_NOT_CONFIRMED/);
  assert.match(webhook, /CHECKOUT_SUBSCRIPTION_MODE_REQUIRED/);
  assert.match(webhook, /STRIPE_SUBSCRIPTION_REQUIRED/);
  assert.match(stripe, /assertStripeSubscriptionWorkspaceBinding/);
  assert.match(stripe, /signatureToleranceSeconds/);
  assert.match(system, /BILLING_FIELDS_WEBHOOK_ONLY/);
  assert.doesNotMatch(system, /payload\.provider_subscription_id/);
  assert.match(billingPage, /getBillingCheckoutConfigurationInSupabase/);
  assert.doesNotMatch(billingPage, /dryRun:\s*true/);
  assert.match(stripe, /ai_monthly/);
  assert.match(billingOptions, /id: 'closeflow_ai'/);
});
