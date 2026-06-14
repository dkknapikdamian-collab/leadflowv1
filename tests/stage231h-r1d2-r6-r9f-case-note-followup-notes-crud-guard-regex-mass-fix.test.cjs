const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE231H_R1D2_R6_R9F guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r6-r9f-case-note-followup-notes-crud-guard-regex-mass-fix.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE231H_R1D2_R6_R9F PASS/);
});
