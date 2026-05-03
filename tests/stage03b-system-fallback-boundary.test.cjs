const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function getFunctionBlock(content, functionName) {
  const start = content.indexOf('async function ' + functionName);
  assert.notEqual(start, -1, functionName + ' not found');
  const next = content.indexOf('\nasync function ', start + 10);
  return next < 0 ? content.slice(start) : content.slice(start, next);
}

test('Stage03B system fallback boundary is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md');
  const guard = read('scripts/check-stage03b-system-fallback-boundary.cjs');

  assert.equal(pkg.scripts['check:stage03b-system-fallback-boundary'], 'node scripts/check-stage03b-system-fallback-boundary.cjs');
  assert.equal(pkg.scripts['test:stage03b-system-fallback-boundary'], 'node --test tests/stage03b-system-fallback-boundary.test.cjs');
  assert.match(quiet, /tests\/stage03b-system-fallback-boundary\.test\.cjs/);

  assert.match(doc, /Stage03B narrows the generic runtime schema fallback/);
  assert.match(doc, /SYSTEM_SCHEMA_FALLBACK_ALLOWED_COLUMNS/);
  assert.match(doc, /profiles/);
  assert.match(doc, /workspaces/);
  assert.match(doc, /Next Stage03C candidate/);

  assert.match(guard, /PASS Stage03B system fallback boundary guard/);
});

test('api/system.ts missing-column fallback is bounded by explicit allowlist', () => {
  const systemApi = read('api/system.ts');

  assert.match(systemApi, /const\s+SYSTEM_SCHEMA_FALLBACK_ALLOWED_COLUMNS\s*:\s*Record<string,\s*Set<string>>/);
  assert.match(systemApi, /profiles:\s*new Set\s*\(/);
  assert.match(systemApi, /workspaces:\s*new Set\s*\(/);
  assert.match(systemApi, /function\s+isSystemSchemaFallbackColumnAllowed\s*\(/);
  assert.match(systemApi, /function\s+shouldDropMissingColumnForSystemFallback\s*\(/);

  for (const functionName of ['safeUpdateById', 'safeUpdateWhere', 'safeInsert']) {
    const block = getFunctionBlock(systemApi, functionName);
    assert.match(block, /shouldDropMissingColumnForSystemFallback/);
    assert.match(block, /delete currentPayload\[missingColumn as string\]/);
  }

  assert.doesNotMatch(
    systemApi,
    /if\s*\(\s*!missingColumn\s*\|\|\s*!\(\s*missingColumn\s+in\s+currentPayload\s*\)\s*\)\s*throw\s+error;\s*delete\s+currentPayload\[missingColumn\];/s,
  );
});
