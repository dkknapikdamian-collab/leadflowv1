const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions', () => {
  const result = spawnSync(process.execPath, ['scripts/check-a13-critical-regressions.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`.trim());
  assert.match(result.stdout, /A13 critical regression guard passed/);
});
