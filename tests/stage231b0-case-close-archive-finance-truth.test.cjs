const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE231B0 case close archive finance truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-case-close-archive-finance-truth.cjs'], {
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 0, (result.stdout || '') + (result.stderr || ''));
  assert.match(result.stdout, /STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH PASS/);
});
