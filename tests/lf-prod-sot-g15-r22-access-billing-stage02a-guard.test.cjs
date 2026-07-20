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

const statuses = ['trial_active', 'trial_ending', 'trial_expired', 'free_active', 'paid_active', 'payment_failed', 'canceled', 'inactive'];

test('reconciled R22 guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /current 14-day trial and centralized billing copy source truth/);
});

test('plans owns the 14-day trial contract', () => {
  assert.match(plans, /export const TRIAL_DAYS = 14;/);
  assert.match(plans, /trial: 'trial_14d'/);
  assert.doesNotMatch(plans, /TRIAL_DAYS\s*=\s*21\b/);
});

test('api me uses the central trial alias', () => {
  assert.match(apiMe, /TRIAL_DAYS as PLAN_TRIAL_DAYS/);
  assert.match(apiMe, /const TRIAL_DAYS = PLAN_TRIAL_DAYS;/);
  assert.match(apiMe, /STAGE231E2_R2_TRIAL_14D_LOCK/);
});

test('Billing consumes centralized access copy', () => {
  assert.match(billing, /getBillingAccessCopy/);
  assert.match(billing, /getBillingAccessCopy\(access\?\.status\)/);
  assert.doesNotMatch(billing, /const ACCESS_COPY/);
});

test('billing source truth contains all statuses', () => {
  assert.match(billingOptions, /BILLING_ACCESS_COPY_BY_STATUS/);
  for (const status of statuses) assert.match(billingOptions, new RegExp(`${status}:`));
  assert.match(billingOptions, /BILLING_ACCESS_COPY_BY_STATUS\.inactive/);
});

test('guard follows current source locations', () => {
  assert.match(guard, /Trial ma jedno źródło prawdy i trwa 14 dni/);
  assert.match(guard, /billing-options\.ts/);
  assert.match(guard, /Centralna mapa copy statusów istnieje/);
  assert.match(guard, /Billing wylicza copy z aktualnego access status/);
  assert.doesNotMatch(guard, /Trial ma jedno źródło prawdy i trwa 21 dni/);
});
