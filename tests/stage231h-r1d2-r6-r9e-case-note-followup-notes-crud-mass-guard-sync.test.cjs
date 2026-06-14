const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231H_R1D2_R6_R9E guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1d2-r6-r9e-case-note-followup-notes-crud-mass-guard-sync.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
