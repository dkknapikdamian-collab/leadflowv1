const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE231H_R1F4 removes stale financePaymentForm type/status save path', () => {
  assert.doesNotMatch(source, /type:\s*financePaymentForm\.type,\s*status:\s*financePaymentForm\.status/);
  assert.match(source, /type:\s*'payment',\s*status:\s*'fully_paid'/);
});

test('STAGE231H_R1F4 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1f4-payment-save-and-guard-repair.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
