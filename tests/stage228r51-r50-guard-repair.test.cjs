const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

test('Stage228R51 guard repair validates behavior without brittle exact setTasks formatting', () => {
  const result = cp.spawnSync('node', ['scripts/check-stage228r51-r50-guard-repair.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R51_R50_GUARD_REPAIR PASS/);
});
