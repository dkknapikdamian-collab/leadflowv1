const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

test('Stage230C-R2/R8/R10/R12/R14/R15 visibility guard passes with stable marker', () => {
  const output = execFileSync(process.execPath, ['scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs'], {
    encoding: 'utf8',
  });

  assert.match(output, /STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX PASS/);
});
