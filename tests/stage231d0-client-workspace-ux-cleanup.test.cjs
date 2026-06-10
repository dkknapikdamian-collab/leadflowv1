const assert = require('assert');
const { spawnSync } = require('child_process');
const test = require('node:test');

test('STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231d0-client-workspace-ux-cleanup.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.strictEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
