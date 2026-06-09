const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

test('Stage228R54 stabilizes guard stack after R50-R53 partial local stages', () => {
  const result = cp.spawnSync('node', ['scripts/check-stage228r54-guard-stack-stabilizer.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R54_GUARD_STACK_STABILIZER PASS/);
});
