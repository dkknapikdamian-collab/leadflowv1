const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R63 rewrites malformed event update block and validates syntax', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r63-rewrite-event-update-block-build.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
