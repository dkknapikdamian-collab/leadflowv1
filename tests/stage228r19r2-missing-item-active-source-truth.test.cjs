const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('stage228r19r2 missing item active source truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r19r2-missing-item-active-source-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
