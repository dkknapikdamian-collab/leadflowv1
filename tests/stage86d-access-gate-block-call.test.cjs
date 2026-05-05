const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const accessGate = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');

test('Stage86D blocks failed/expired billing statuses before old compatibility aliases', () => {
  const fnIndex = accessGate.indexOf('function isAllowedWriteStatus');
  const callIndex = accessGate.indexOf('if (isBlockedBillingAccessStatus(status)) return false;');
  const paidIndex = accessGate.indexOf("if (status === 'paid_active'");
  const legacyPlanIndex = accessGate.indexOf("if (status === 'basic' || status === 'pro'");

  assert.ok(fnIndex >= 0, 'missing isAllowedWriteStatus');
  assert.ok(callIndex > fnIndex, 'blocked billing call must be inside isAllowedWriteStatus');
  assert.ok(paidIndex > callIndex, 'blocked billing call must be before paid_active allow');
  assert.ok(legacyPlanIndex > callIndex, 'blocked billing call must be before legacy plan aliases');
  assert.match(accessGate, /status: 'payment_failed'/);
  assert.match(accessGate, /status: 'trial_expired'/);
  assert.match(accessGate, /status: 'inactive'/);
  assert.match(accessGate, /status: 'canceled'/);
});