const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('stage228r20r5 verified SQL task delete guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r20r5-verified-sql-task-delete.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R20R5_VERIFIED_SQL_TASK_DELETE/);
});
