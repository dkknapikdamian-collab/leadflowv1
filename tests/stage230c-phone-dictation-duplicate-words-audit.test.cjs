const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage230C phone dictation duplicate words audit guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT PASS/);
});
