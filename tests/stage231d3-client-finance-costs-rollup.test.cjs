const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('STAGE231D3_CLIENT_FINANCE_COSTS_ROLLUP guard passes', () => {
  const r = spawnSync(process.execPath, ['scripts/check-stage231d3-client-finance-costs-rollup.cjs'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
