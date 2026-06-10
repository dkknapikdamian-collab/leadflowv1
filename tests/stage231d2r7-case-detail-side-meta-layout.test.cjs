const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT guard passes', () => {
  const r = spawnSync(process.execPath, ['scripts/check-stage231d2r7-case-detail-side-meta-layout.cjs'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
