const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R62 reconciles R60B guard with R25 literal contract', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r62-reconcile-r60b-guard-with-r25-literal.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
