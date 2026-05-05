const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const accessGate = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');

test('Stage86B access gate documents webhook-only paid access and blocks failed billing statuses', () => {
  assert.match(accessGate, /BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14/);
  assert.match(accessGate, /status === 'paid_active'/);
  assert.match(accessGate, /status: 'payment_failed'/);
  assert.match(accessGate, /status: 'trial_expired'/);
  assert.match(accessGate, /status: 'canceled'/);
  assert.ok(accessGate.includes('isBlockedBillingAccessStatus(status)'), 'access gate must evaluate blocked billing statuses before allow-list');
});

