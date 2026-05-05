#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');
const failures = [];
function expect(condition, message){ if(!condition) failures.push(message); }
expect(file.includes('BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14'), 'access gate must carry webhook-only paid access marker');
expect(file.includes("status === 'paid_active'"), 'access gate must keep paid_active as the only paid write status');
expect(file.includes("status: 'payment_failed'"), 'access gate must explicitly list payment_failed as blocked');
expect(file.includes("status: 'trial_expired'"), 'access gate must explicitly list trial_expired as blocked');
expect(file.includes("status: 'canceled'"), 'access gate must explicitly list canceled as blocked');
expect(file.includes('isBlockedBillingAccessStatus(status)'), 'access gate must evaluate blocked billing statuses before allow-list');
if(failures.length){
  console.error('Stage86B access gate billing truth failed.');
  for(const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log('PASS STAGE86B_ACCESS_GATE_BILLING_TRUTH');
