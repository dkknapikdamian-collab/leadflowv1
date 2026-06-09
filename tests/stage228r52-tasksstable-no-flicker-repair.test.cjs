const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

test('Stage228R52 validates TasksStable optimistic delete with rollback and no forced refresh', () => {
  const result = cp.spawnSync('node', ['scripts/check-stage228r52-tasksstable-no-flicker-repair.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R52_TASKSSTABLE_NO_FLICKER_REPAIR PASS/);
});
