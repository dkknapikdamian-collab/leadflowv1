const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test("Stage228R56 validates full task function block behavior", () => {
  const result = spawnSync(process.execPath, ["scripts/check-stage228r56-supabase-fallback-task-functions.cjs"], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
