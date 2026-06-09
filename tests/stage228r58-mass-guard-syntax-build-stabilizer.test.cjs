const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test("Stage228R58 runs mass guard syntax/build stabilizer checks", () => {
  const result = spawnSync(process.execPath, ["scripts/check-stage228r58-mass-guard-syntax-build-stabilizer.cjs"], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
