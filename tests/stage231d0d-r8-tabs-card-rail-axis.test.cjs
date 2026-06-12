const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE231D0D-R8 tabs card and right rail axis guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0d-r8-tabs-card-rail-axis.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});
