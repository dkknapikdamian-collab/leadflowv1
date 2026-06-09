const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R61 restores exact R25 literal api system tasks contract', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r61-restore-literal-api-system-tasks-contract.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
