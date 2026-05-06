const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }

test('request identity helper remains compatible with Vercel API call sites without trusting workspace body', () => {
  const helper = read('src/server/_request-scope.ts');
  assert.match(helper, /export function getRequestIdentity\(req: any/);
  assert.match(helper, /fullName/);
  assert.doesNotMatch(helper, /body\.workspaceId/);
  assert.doesNotMatch(helper, /body\.workspace_id/);
  const support = read('api/support.ts');
  const system = read('api/system.ts');
  assert.match(support, /getRequestIdentity\(req, body\)|getRequestIdentity\(req\)/);
  assert.match(system, /getRequestIdentity\(req, body\)|getRequestIdentity\(req\)/);
  assert.match(system, /identity\.fullName/);
});
