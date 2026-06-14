const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE231H_R1D keeps payment save paid without brittle LF matching', () => {
  assert.match(source, /type:\s*'payment',\s*status:\s*'fully_paid'/);
  assert.doesNotMatch(source, /id="case-payment-status"/);
  assert.doesNotMatch(source, /id="case-payment-type"/);
});

test('STAGE231H_R1D guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
