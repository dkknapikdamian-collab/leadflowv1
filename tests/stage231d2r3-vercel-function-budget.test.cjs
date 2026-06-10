const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('STAGE231D2R3_VERCEL_FUNCTION_BUDGET guard passes', () => {
  const r = spawnSync(process.execPath, ['scripts/check-stage231d2r3-vercel-function-budget.cjs'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
