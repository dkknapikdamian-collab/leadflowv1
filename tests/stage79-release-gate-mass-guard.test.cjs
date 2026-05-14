const assert = require('node:assert/strict');
const cp = require('node:child_process');
const test = require('node:test');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
test('Stage79 mass guard passes current repo', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage79-release-gate-mass-guard.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
