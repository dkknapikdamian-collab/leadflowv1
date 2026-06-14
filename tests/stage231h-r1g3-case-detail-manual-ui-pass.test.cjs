const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

test('STAGE231H_R1G3 guard passes', () => {
  const output = execFileSync('node', ['scripts/check-stage231h-r1g3-case-detail-manual-ui-pass.cjs'], {
    encoding: 'utf8',
  });
  assert.match(output, /STAGE231H_R1G3 PASS/);
});

test('STAGE231H_R1G3 keeps future stages separate', () => {
  const stages = fs.readFileSync('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'utf8');
  assert.match(stages, /STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME/);
  assert.match(stages, /STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING/);
});
