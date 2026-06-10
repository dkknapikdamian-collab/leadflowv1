const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT guard passes', () => {
  const r = spawnSync(process.execPath, ['scripts/check-stage231d2r6-case-detail-top-rail-lift.cjs'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
