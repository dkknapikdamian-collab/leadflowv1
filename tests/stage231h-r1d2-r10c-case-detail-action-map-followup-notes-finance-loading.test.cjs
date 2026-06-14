const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const fs = require('fs');

test('STAGE231H_R1D2_R10C guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r10c-case-detail-action-map-followup-notes-finance-loading.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('STAGE231H_R1D2_R10C blocks generic follow-up task UI wording', () => {
  const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
  assert.match(text, /Follow-up po notatce/);
  assert.doesNotMatch(text, /const\s+title\s*=\s*['"]Follow-up:\s*['"]\s*\+\s*getCaseTitle\(caseData\)/);
  assert.match(text, /note-follow-up/);
  assert.match(text, /Notatka · follow-up przypięty do sprawy/);
});
