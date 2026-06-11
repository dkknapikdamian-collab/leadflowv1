const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage231D0C/R11 ClientDetail left rail axis lock guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs'], {
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
