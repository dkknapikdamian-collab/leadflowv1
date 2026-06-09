const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('Stage231A Google auth entry consistency guard passes', () => {
  const output = execFileSync('node', ['scripts/check-stage231a-google-auth-entry-consistency.cjs'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  assert.match(output, /STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY PASS/);
});
