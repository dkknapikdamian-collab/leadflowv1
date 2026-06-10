const assert = require('assert');
const { spawnSync } = require('child_process');
const test = require('node:test');

test('STAGE231D1_COST_MODEL_SOURCE_TRUTH guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d1-cost-model-source-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /STAGE231D1_COST_MODEL_SOURCE_TRUTH: PASS/);
});
