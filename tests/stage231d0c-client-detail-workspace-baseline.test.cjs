const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage231D0C ClientDetail workspace baseline guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0c-client-detail-workspace-baseline.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
