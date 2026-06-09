const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test("Stage228R58B documents skipping node --check on TSX and relying on Vite build", () => {
  const result = spawnSync(process.execPath, ["scripts/check-stage228r58b-skip-tsx-nodecheck-continue.cjs"], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
