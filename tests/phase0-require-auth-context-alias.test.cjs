const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('request scope exports requireAuthContext compatibility alias for Vercel handlers', () => {
  const source = read('src/server/_request-scope.ts');
  assert.match(source, /export\s+(async\s+function|const|function)\s+requireAuthContext\b/);
  assert.match(source, /requireRequestIdentity\(req,\s*bodyInput\)/);
});

test('server handlers importing requireAuthContext remain typecheck compatible', () => {
  for (const relativePath of [
    'src/server/billing-actions-handler.ts',
    'src/server/billing-checkout-handler.ts',
    'src/server/portal-tokens-handler.ts',
  ]) {
    const source = read(relativePath);
    assert.match(source, /requireAuthContext/);
    assert.match(source, /_request-scope\.js/);
  }
});
