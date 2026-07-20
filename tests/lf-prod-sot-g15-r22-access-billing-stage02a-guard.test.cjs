const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-access-billing-source-of-truth-stage02a.cjs');
const plans = fs.readFileSync(path.join(root, 'src/lib/plans.ts'), 'utf8');
const apiMe = fs.readFileSync(path.join(root, 'api/me.ts'), 'utf8');
const billing = fs.readFileSync(path.join(root, 'src/pages/Billing.tsx'), 'utf8');
const billingOptions = fs.readFileSync(path.join(root, 'src/lib/source-of-truth/billing-options.ts'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

const statuses = [
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'canceled',
  'inactive',
];

test('reconciled R22 guard passes against current access and billing source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /current 14-day trial and centralized billing copy source truth/);
});

test('plans owns one explicit 14-day trial contract', () => {
  assert.match(plans, /export const TRIAL_DAYS = 14;/);
  assert.match(plans, /trial: 'trial_14d'/);
  assert.doesNotMatch(plans, /TRIAL_DAYS\s*=\s*21\b/);
});

test('api me imports the trial duration instead of defining a local numeric constant', () => {
  assert.match(apiMe, /TRIAL_DAYS as PLAN_TRIAL_DAYS/);
  assert.match(apiMe, /const TRIAL_DAYS = PLAN_TRIAL_DAYS;/);
  assert.match(apiMe, /STAGE231E2_R2_TRIAL_14D_LOCK/);
  assert.doesNotMatch(apiMe, /\bconst\s+TRIAL_DAYS\s*=\s*14\b/);
  assert.doesNotMatch(apiMe, /\bconst\s+TRIAL_DAYS\s*=\s*21\b/);
});

test('Billing consumes centralized access copy instead of a page-local ACCESS_COPY map', () => {
  assert.match(billing, /getBillingAccessCopy/);
  assert.match(billing, /getBillingAccessCopy\(access\?\.status\)/);
  assert.doesNotMatch(billing, /const ACCESS_COPY/);
});

test('billing source truth contains all access statuses and inactive fallback', () => {
  assert.match(billingOptions, /BILLING_ACCESS_COPY_BY_STATUS/);
  for (const status of statuses) assert.match(billingOptions, new RegExp(`${status}:`));
  assert.match(billingOptions, /BILLING_ACCESS_COPY_BY_STATUS\.inactive/);
});

test('guard rejects stale trial and page-local copy assumptions', () => {
  assert.match(guard, /TRIAL_DAYS\s*\\s\*=\s*\\s\*14/);
  assert.match(guard, /billing-options\.ts/);
  assert.match(guard, /BILLING_ACCESS_COPY_BY_STATUS/);
  assert.match(guard, /getBillingAccessCopy\(access\?\.status\)/);
  assert.doesNotMatch(guard, /TRIAL_DAYS\\s\*=\\s\*21/);
  assert.doesNotMatch(guard, /files\.billing, 'ACCESS_COPY'/);
});
