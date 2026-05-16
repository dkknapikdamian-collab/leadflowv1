#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const accessGate = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');

const fail = [];
function expect(condition, message) {
  if (!condition) fail.push(message);
}

const fnIndex = accessGate.indexOf('function isAllowedWriteStatus');
const callIndex = accessGate.indexOf('if (isBlockedBillingAccessStatus(status)) return false;');
const paidIndex = accessGate.indexOf("if (status === 'paid_active'");

expect(accessGate.includes('BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14'), 'missing webhook-only billing marker');
expect(accessGate.includes('BILLING_BLOCKED_ACCESS_STATUS_STAGE86B'), 'missing blocked billing status list');
expect(accessGate.includes("status: 'payment_failed'"), 'missing payment_failed blocked status');
expect(accessGate.includes("status: 'trial_expired'"), 'missing trial_expired blocked status');
expect(accessGate.includes("status: 'inactive'"), 'missing inactive blocked status');
expect(accessGate.includes("status: 'canceled'"), 'missing canceled blocked status');
expect(fnIndex >= 0, 'missing isAllowedWriteStatus function');
expect(callIndex > fnIndex, 'blocked status call must be inside isAllowedWriteStatus');
expect(paidIndex > callIndex, 'blocked status call must run before paid/trial/free allow rules');
expect(accessGate.includes('isBlockedBillingAccessStatus(status)'), 'isAllowedWriteStatus must call isBlockedBillingAccessStatus(status)');

if (fail.length) {
  console.error('Stage86D access gate block call guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE86D_ACCESS_GATE_BLOCK_CALL');
