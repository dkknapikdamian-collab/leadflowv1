const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage230B Quick Capture Inbox guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage230b-quick-capture-inbox.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE230B_QUICK_CAPTURE_INBOX PASS/);
});
