const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test("Stage228R59 rewrites malformed task block and validates syntax", () => {
  const result = spawnSync(process.execPath, ["scripts/check-stage228r59-rewrite-task-block-and-mass-validate.cjs"], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
