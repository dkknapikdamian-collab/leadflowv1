const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231H_R1F4 FAIL: ' + message);
    process.exit(1);
  }
}

const source = read('src/pages/CaseDetail.tsx');
const run = read('_project/runs/STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR.md');
const obsidian = read('_project/obsidian_updates/2026-06-14_STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR.md');

assert(source.includes('STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR'), 'missing R1F4 marker');
assert(!/type:\s*financePaymentForm\.type,\s*status:\s*financePaymentForm\.status/.test(source), 'financePaymentForm type/status still controls commission payment save');
assert(/type:\s*'payment',\s*status:\s*'fully_paid'/.test(source), 'commission payment save does not force paid payment');
assert(source.includes("const paymentType = 'payment';"), 'payment correction does not normalize type');
assert(source.includes("const paymentStatus = 'fully_paid';"), 'payment correction does not normalize status');
assert(source.includes('data-stage231h-r1f4-payment-correction-normalized-paid="true"'), 'payment correction R1F4 marker missing');
assert(run.includes('RED_GUARD_PUSH_REPAIR'), 'run report must document red-guard push repair');
assert(obsidian.includes('SQL nie ruszany'), 'Obsidian payload must state SQL untouched');

console.log('STAGE231H_R1F4 PASS: payment save and guard repair is guarded.');
