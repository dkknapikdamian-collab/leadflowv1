const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('Stage228R43 proves R42 guard repair and deleted status contract', () => {
  for (const script of [
    'scripts/check-stage228r42-runtime-delete-status-contract.cjs',
    'scripts/check-stage228r43-r42-guard-repair.cjs',
  ]) {
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, script + '\nSTDOUT:\n' + result.stdout + '\nSTDERR:\n' + result.stderr);
  }
});
