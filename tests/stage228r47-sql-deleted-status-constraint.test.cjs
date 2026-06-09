const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage228R47 SQL deleted status guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r47-sql-deleted-status-constraint.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE228R47_SQL_DELETED_STATUS_CONSTRAINT PASS/);
});
