const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

function run(script) {
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${script} failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

test('workspace isolation guards block body workspace trust and require scoped mutations', () => {
  run('scripts/check-no-body-workspace-trust.cjs');
  run('scripts/check-workspace-scope.cjs');
});
