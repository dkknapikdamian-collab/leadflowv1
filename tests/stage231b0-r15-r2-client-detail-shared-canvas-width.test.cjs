const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R15-R2 ClientDetail shared canvas width guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r15-r2-client-detail-shared-canvas-width.cjs'], {
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
});
