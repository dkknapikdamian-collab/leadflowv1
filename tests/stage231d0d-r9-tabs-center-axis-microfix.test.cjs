const assert = require('assert');
const { spawnSync } = require('child_process');
const test = require('node:test');

test('STAGE231D0D-R9 tabs center and axis microfix guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0d-r9-tabs-center-axis-microfix.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS/);
});
