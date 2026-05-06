const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('admin diagnostics are backend-protected and UI uses api/me-derived admin state', () => {
  const result = spawnSync(process.execPath, ['scripts/check-admin-backend-guard.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
