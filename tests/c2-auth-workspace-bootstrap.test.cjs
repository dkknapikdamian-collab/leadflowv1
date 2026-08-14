const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');

test('C2 auth/workspace bootstrap guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-c2-auth-workspace-bootstrap.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /single-live-bootstrap-trigger/);
});

test('C2 source rejects request-body workspace authority and requires membership', () => {
  const apiMe = fs.readFileSync(path.join(root, 'api', 'me.ts'), 'utf8');

  assert.doesNotMatch(apiMe, /req\.body\??\.(workspace|workspaceId|workspace_id)/i);
  assert.match(apiMe, /WORKSPACE_MEMBERSHIP_REQUIRED/);
  assert.match(apiMe, /workspace_members\?workspace_id=eq\.\$\{encodeURIComponent\(workspaceId\)\}/);
});
