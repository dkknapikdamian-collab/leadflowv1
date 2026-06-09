const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage230C-R2/R8 voice debug visibility hotfix guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX PASS/);
});
