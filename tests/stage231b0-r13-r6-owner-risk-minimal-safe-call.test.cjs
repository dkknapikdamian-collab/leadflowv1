const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R13 R6 owner risk minimal safe call passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r13-r6-owner-risk-minimal-safe-call.cjs'], { encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
