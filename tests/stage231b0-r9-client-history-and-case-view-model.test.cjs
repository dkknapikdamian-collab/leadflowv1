const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 R9 client history and case view model guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r9-client-history-and-case-view-model.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /STAGE231B0_R9_CLIENT_HISTORY_AND_CASE_VIEW_MODEL PASS/);
});
