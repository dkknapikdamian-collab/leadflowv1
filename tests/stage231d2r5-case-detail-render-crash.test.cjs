const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('STAGE231D2_R5_CASE_DETAIL_RENDER_CRASH_HOTFIX guard passes', () => {
  const r = spawnSync(process.execPath, ['scripts/check-stage231d2r5-case-detail-render-crash.cjs'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
