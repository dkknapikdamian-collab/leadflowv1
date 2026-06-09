const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R41 final delete flow validation guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r41-delete-flow-final-validate.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH/);
});