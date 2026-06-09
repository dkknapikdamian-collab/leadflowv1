
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage229B2 Google Calendar pending_delete remote worker guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage229b2-google-calendar-pending-delete-remote-worker.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
