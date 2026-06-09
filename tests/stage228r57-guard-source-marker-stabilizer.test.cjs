const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test("Stage228R57 stabilizes stale source-marker guards after R56 rewrite", () => {
  const result = spawnSync(process.execPath, ["scripts/check-stage228r57-guard-source-marker-stabilizer.cjs"], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
