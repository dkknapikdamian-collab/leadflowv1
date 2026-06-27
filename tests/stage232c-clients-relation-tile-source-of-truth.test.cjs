const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('STAGE232C clients relation tile source of truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage232c-clients-relation-tile-source-of-truth.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /PASS/);
});
