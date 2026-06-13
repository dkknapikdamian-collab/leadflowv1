const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('client and case urgent regression guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-closeflow-client-case-urgent-regressions.cjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
