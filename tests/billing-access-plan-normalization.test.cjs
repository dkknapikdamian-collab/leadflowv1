const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('api me keeps exact paid Stripe plan ids', () => {
  const apiMe = source('api/me.ts');

  for (const planId of [
    'closeflow_basic',
    'closeflow_basic_yearly',
    'closeflow_pro',
    'closeflow_pro_yearly',
    'closeflow_business',
    'closeflow_business_yearly',
  ]) {
    assert.ok(apiMe.includes(planId), 'missing ' + planId);
  }

  assert.ok(apiMe.includes('PAID_PLAN_IDS.has(normalized)'), 'plans collapsed');
});

test('api me blocks paid access after next billing date', () => {
  const apiMe = source('api/me.ts');

  assert.ok(apiMe.includes('isAccessBillingDateExpired(workspace.nextBillingAt || null)'), 'no expiry gate');
  assert.ok(apiMe.includes("status: 'payment_failed'"), 'no failed status');
});
