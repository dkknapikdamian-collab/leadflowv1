const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage231D0C/R9 ClientDetail left rail visual align guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
