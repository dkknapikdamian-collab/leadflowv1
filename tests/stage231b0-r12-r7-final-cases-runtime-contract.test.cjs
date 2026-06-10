const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R12 R7 final cases runtime contract guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r12-r7-final-cases-runtime-contract.cjs'], {
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
