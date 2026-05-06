const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('service-role business mutations require workspace-scoped helpers', () => {
  const result = spawnSync(process.execPath, ['scripts/check-service-role-scoped-mutations.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
