const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2C v3 rebuilds access gate feature and AI block cleanly', () => {
  const source = read('src/server/_access-gate.ts');

  assert.match(source, /export async function assertWorkspaceFeatureAccess/);
  assert.match(source, /export async function assertWorkspaceAiAllowed/);
  assert.match(source, /assertWorkspaceFeatureAccess\(workspaceInput, 'fullAi', planInput\)/);
  assert.match(source, /WORKSPACE_FEATURE_ACCESS_REQUIRED/);
  assert.match(source, /WORKSPACE_AI_ACCESS_REQUIRED/);
  assert.match(source, /function normalizeLimitKey\(entityName: unknown\)/);

  assert.doesNotMatch(source, /\n\}, planInput\?: unknown\) \{/);
  assert.doesNotMatch(source, /const row = asRecord\(workspace\);\n  const status = readWorkspaceStatus\(workspace\);/);
  assert.doesNotMatch(source, /plan === 'pro'\)\) return true/);
  assert.doesNotMatch(source, /plan === 'pro' \|\| plan\.includes\('ai'\)/);

  assert.equal((source.match(/export async function assertWorkspaceFeatureAccess/g) || []).length, 1);
  assert.equal((source.match(/export async function assertWorkspaceAiAllowed/g) || []).length, 1);
});

test('Faza 3 Etap 3.2C v3 removes failed v1/v2 hotfix wiring', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA3_ETAP32C_ACCESS_GATE_RUNTIME_HOTFIX_V3_2026-05-03.md');

  assert.equal(pkg.scripts['check:faza3-etap32c-access-gate-runtime-hotfix-v3'], 'node scripts/check-faza3-etap32c-access-gate-runtime-hotfix-v3.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32c-access-gate-runtime-hotfix-v3'], 'node --test tests/faza3-etap32c-access-gate-runtime-hotfix-v3.test.cjs');

  assert.equal(pkg.scripts['check:faza3-etap32c-access-gate-runtime-hotfix'], undefined);
  assert.equal(pkg.scripts['test:faza3-etap32c-access-gate-runtime-hotfix'], undefined);
  assert.equal(pkg.scripts['check:faza3-etap32c-access-gate-runtime-hotfix-v2'], undefined);
  assert.equal(pkg.scripts['test:faza3-etap32c-access-gate-runtime-hotfix-v2'], undefined);

  assert.match(quiet, /tests\/faza3-etap32c-access-gate-runtime-hotfix-v3\.test\.cjs/);
  assert.doesNotMatch(quiet, /tests\/faza3-etap32c-access-gate-runtime-hotfix\.test\.cjs/);
  assert.doesNotMatch(quiet, /tests\/faza3-etap32c-access-gate-runtime-hotfix-v2\.test\.cjs/);
  assert.match(doc, /false-positive/);
});
