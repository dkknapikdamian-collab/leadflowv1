const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('stage228r23 work_items soft delete guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r23-work-items-soft-delete.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R23_WORK_ITEMS_SOFT_DELETE/);
});
