const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R25 delete flow source-truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r25-delete-flow-source-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE228R25_DELETE_FLOW_FIX_AND_PUSH_COMPAT_R41/);
});