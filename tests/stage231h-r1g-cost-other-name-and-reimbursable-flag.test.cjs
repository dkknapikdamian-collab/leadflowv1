const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('STAGE231H_R1G add and correction forms expose other name and reimbursable flag', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /data-stage231h-r1g-add-cost-other-name="true"/);
  assert.match(source, /data-stage231h-r1g-add-cost-reimbursable-toggle="true"/);
  assert.match(source, /data-stage231h-r1g-correct-cost-other-name="true"/);
  assert.match(source, /data-stage231h-r1g-correct-cost-reimbursable-toggle="true"/);
});

test('STAGE231H_R1G non-reimbursable costs do not enter reimbursement amount', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /reimbursableAmount:\s*caseCostDraftStage231D2\.reimbursable \? amount : 0/);
  assert.match(source, /const finalReimbursableAmount\s*=\s*isCostReimbursable \?/);
  assert.match(source, /reimbursable:\s*isCostReimbursable/);
});

test('STAGE231H_R1G summary source only adds reimbursable costs to total to collect', () => {
  const source = read('src/lib/finance/case-costs-source.ts');
  assert.match(source, /const reimbursableRows = incurredRows\.filter\(\(cost\) => cost\.reimbursable\)/);
  assert.match(source, /const totalToCollectAmount = roundMoney\(commissionRemainingAmount \+ costsToReimburseAmount\)/);
});

test('STAGE231H_R1G guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
});
