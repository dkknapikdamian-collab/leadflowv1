const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R8 case archive relation truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r8-case-archive-relation-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH PASS/);
});
