const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R50 no-flicker real-anchor guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r50-no-flicker-real-anchors.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE228R50_NO_FLICKER_REAL_ANCHORS PASS/);
});
