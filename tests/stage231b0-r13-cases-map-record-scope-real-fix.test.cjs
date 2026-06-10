const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R13 cases map record scope real fix guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r13-cases-map-record-scope-real-fix.cjs'], { encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
