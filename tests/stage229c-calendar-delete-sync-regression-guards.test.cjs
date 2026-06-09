const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage229C calendar/delete/google-sync regression guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage229c-calendar-delete-sync-regression-guards.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
