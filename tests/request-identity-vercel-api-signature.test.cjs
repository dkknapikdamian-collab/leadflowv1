const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('request identity helper supports existing API call sites used by Vercel typecheck', () => {
  const helper = read('src/server/_request-scope.ts');

  assert.match(helper, /export function getRequestIdentity\(req: any, bodyInput\?: any\)/);
  assert.match(helper, /const body = bodyInput && typeof bodyInput === 'object' \? bodyInput : parseBody\(req\)/);
  assert.match(helper, /fullName: fullName \|\| null/);

  const support = read('api/support.ts');
  const system = read('api/system.ts');

  assert.match(support, /getRequestIdentity\(req, body\)/);
  assert.match(system, /getRequestIdentity\(req, body\)/);
  assert.match(system, /identity\.fullName/);
});
