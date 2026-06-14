const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8').replace(/\r\n/g, '\n');

function findBlock(text, marker) {
  const index = text.indexOf(marker);
  if (index < 0) return '';
  return text.slice(Math.max(0, index - 2500), Math.min(text.length, index + 4500));
}

test('STAGE231H_R1F payment correction updates original payment', () => {
  assert.match(source, /updatePaymentInSupabase\(payload as any\)/);
  assert.match(source, /const paymentType = 'payment';/);
  assert.match(source, /const paymentStatus = 'fully_paid';/);
});

test('STAGE231H_R1F cost correction saves full operational payload', () => {
  const block = findBlock(source, 'updateCaseCostInSupabase(payload as any)');
  assert.ok(block, 'missing cost update block');
  for (const token of ['kind', 'status', 'amount', 'reimbursableAmount', 'reimbursedAmount', 'currency', 'incurredAt', 'note']) {
    assert.ok(block.includes(token), `missing ${token}`);
  }
});

test('STAGE231H_R1F guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
