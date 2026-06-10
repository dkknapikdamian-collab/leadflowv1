const assert = require('assert');
const { spawnSync } = require('child_process');
const test = require('node:test');

test('STAGE231B0 R7 case archive restore navigation guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231b0-r7-case-archive-restore-navigation.cjs'], {
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION PASS/);
});
