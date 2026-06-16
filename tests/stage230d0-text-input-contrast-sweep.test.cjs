const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage230D0 text/input contrast sweep guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage230d0-text-input-contrast-sweep.cjs'], {
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP PASS/);
});
