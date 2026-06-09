
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage231D Google auth intent gate guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d-google-auth-intent-gate.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE231D_GOOGLE_AUTH_INTENT_GATE PASS/);
});
