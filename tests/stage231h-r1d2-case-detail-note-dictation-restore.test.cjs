const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

test('STAGE231H_R1D2 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-case-detail-note-dictation-restore.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE231H_R1D2 PASS/);
});

test('STAGE231H_R1D2 keeps dictation separate from future reimbursed cost stage', () => {
  const src = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.match(src, /Dyktuj notatkę/);
  assert.doesNotMatch(src, /STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING[\s\S]{0,200}SpeechRecognition/);
});
