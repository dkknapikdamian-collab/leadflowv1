const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage231D0B ClientListCard freeze guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0b-client-list-card-freeze.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /PASS/);
});
