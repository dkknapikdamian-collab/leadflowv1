const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

test('STAGE231H_R1G2 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1g2-case-detail-cost-payment-closeout.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('STAGE231H_R1G2 keeps manual UI validation honest', () => {
  const report = fs.readFileSync('_project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'utf8');
  assert.match(report, /Manual UI remains required/);
  assert.doesNotMatch(report, /CASEDETAIL_FULL_PRODUCT_PASS/);
});
