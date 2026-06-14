const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const caseDetail = fs.readFileSync(path.join(root, 'src/pages/CaseDetail.tsx'), 'utf8');

test('STAGE231H_R1D removes redundant cost status chip from correction list', () => {
  assert.match(caseDetail, /STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT/);
  assert.doesNotMatch(caseDetail, /Status: \{getCaseCostStatusLabelStage231H_R1C/);
  assert.match(caseDetail, /status kosztu jest dostępny w korekcie/);
});

test('STAGE231H_R1D removes redundant payment row helper text', () => {
  assert.doesNotMatch(caseDetail, /<span>Korekta \/ prowizja<\/span>/);
  assert.match(caseDetail, /Koryguj wpłatę\/koszt/);
});

test('STAGE231H_R1D makes commission payment status implicit and paid', () => {
  assert.doesNotMatch(caseDetail, /id="case-payment-status"/);
  assert.doesNotMatch(caseDetail, /id="case-payment-type"/);
  assert.match(caseDetail, /data-stage231h-r1d-commission-payment-defaults="status-fully-paid-type-payment"/);
  assert.match(caseDetail, /type: 'payment',\n\s*status: 'fully_paid',/);
});

test('STAGE231H_R1D guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
