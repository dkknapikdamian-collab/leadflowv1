const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('case, finance and readability repair guard passes', () => {
  const root = path.resolve(__dirname, '..');
  const result = spawnSync(process.execPath, ['scripts/check-closeflow-case-finance-ui-repair.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /OK: case actions/);
});
