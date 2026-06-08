const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('stage228r18r5 missing item hard delete guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r18r5-missing-item-hard-delete-source-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
