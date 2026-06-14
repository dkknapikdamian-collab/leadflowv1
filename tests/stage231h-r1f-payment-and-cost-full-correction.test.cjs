const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE231H_R1F payment correction updates original payment', () => {
  assert.match(source, /updatePaymentInSupabase\(payload as any\)/);
  assert.match(source, /const paymentType = 'payment';/);
  assert.match(source, /const paymentStatus = 'fully_paid';/);
});

test('STAGE231H_R1F cost correction saves full operational payload', () => {
  assert.match(source, /const payload = \{[\s\S]*?kind,\s*status,\s*amount,[\s\S]*?incurredAt,[\s\S]*?note,[\s\S]*?\};[\s\S]*?updateCaseCostInSupabase\(payload as any\)/);
});

test('STAGE231H_R1F guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
