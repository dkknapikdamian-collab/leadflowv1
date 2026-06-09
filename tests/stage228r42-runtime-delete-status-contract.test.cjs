const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('Stage228R42 delete status contract guard passes without brittle regex', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r42-runtime-delete-status-contract.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
