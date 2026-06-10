const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R11 client width and cases runtime guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs'], {
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
