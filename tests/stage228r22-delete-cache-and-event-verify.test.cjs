const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('stage228r22 delete cache and event verification guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r22-delete-cache-and-event-verify.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R22_DELETE_CACHE_AND_EVENT_VERIFY/);
});
