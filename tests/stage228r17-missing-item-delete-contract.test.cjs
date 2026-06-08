const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

test('stage228r17 missing item delete contract guard passes', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage228r17-missing-item-delete-contract.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
