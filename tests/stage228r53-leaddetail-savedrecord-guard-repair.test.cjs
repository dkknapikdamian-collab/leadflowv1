const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');

test('Stage228R53 validates LeadDetail savedRecord no-flicker wiring', () => {
  const result = cp.spawnSync('node', ['scripts/check-stage228r53-leaddetail-savedrecord-guard-repair.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /STAGE228R53_LEADDETAIL_SAVEDRECORD_GUARD_REPAIR PASS/);
});
