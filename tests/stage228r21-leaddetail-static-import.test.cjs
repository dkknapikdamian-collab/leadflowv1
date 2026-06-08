const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('stage228r21 LeadDetail static import guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage228r21-leaddetail-static-import.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK/);
});
