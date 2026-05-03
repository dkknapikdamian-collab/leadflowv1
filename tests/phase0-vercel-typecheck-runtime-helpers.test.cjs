const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8');
}

test('runtime request-scope exports match Vercel API call sites', () => {
  const source = read('src/server/_request-scope.ts');

  assert.match(source, /export\s+function\s+getRequestIdentity\s*\(/);
  assert.match(source, /export\s+async\s+function\s+requireRequestIdentity\s*\(/);
  assert.match(source, /export\s+async\s+function\s+requireAuthContext\s*\(/);
  assert.match(source, /export\s+async\s+function\s+requireAdminAuthContext\s*\(/);
  assert.match(source, /export\s+async\s+function\s+assertWorkspaceOwnerOrAdmin\s*\(/);
});

test('runtime access-gate exports match Vercel API call sites', () => {
  const source = read('src/server/_access-gate.ts');

  assert.match(source, /export\s+async\s+function\s+assertWorkspaceWriteAccess\s*\(/);
  assert.match(source, /export\s+async\s+function\s+assertWorkspaceAiAllowed\s*\(/);
  assert.match(source, /export\s+async\s+function\s+assertWorkspaceEntityLimit\s*\(/);
  assert.match(source, /isPastDate\s*\(\s*nextBillingAt/);
  assert.match(source, /paid_active/);
  assert.match(source, /trial_active/);
});
