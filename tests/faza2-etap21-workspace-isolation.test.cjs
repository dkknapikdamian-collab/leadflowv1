const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, ''); }

test('Faza 2 Etap 2.1 workspace isolation audit is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA2_ETAP21_WORKSPACE_ISOLATION_AUDIT_CHECKLIST_2026-05-03.md');
  const guard = read('scripts/check-faza2-etap21-workspace-isolation.cjs');
  assert.equal(pkg.scripts['check:faza2-etap21-workspace-isolation'], 'node scripts/check-faza2-etap21-workspace-isolation.cjs');
  assert.equal(pkg.scripts['test:faza2-etap21-workspace-isolation'], 'node --test tests/faza2-etap21-workspace-isolation.test.cjs');
  assert.match(quiet, /tests\/faza2-etap21-workspace-isolation\.test\.cjs/);
  assert.match(doc, /FAZA 2 - Etap 2\.1 - Workspace isolation/);
  assert.match(guard, /PASS FAZA 2 - Etap 2\.1 workspace isolation audit guard/);
});

test('Request scope helpers are Stage15 hardened and do not trust body workspace id', () => {
  const requestScope = read('src/server/_request-scope.ts');
  const serverSupabaseHelper = read('src/server/_supabase.ts');
  assert.match(requestScope, /requireSupabaseRequestContext/);
  assert.match(requestScope, /resolveRequestWorkspaceId/);
  assert.match(requestScope, /requireScopedRow/);
  assert.match(requestScope, /fetchSingleScopedRow/);
  assert.match(requestScope, /withWorkspaceFilter/);
  assert.match(requestScope, /requireAdminAuthContext/);
  assert.match(requestScope, /STAGE15_NO_BODY_WORKSPACE_TRUST/);
  assert.match(requestScope, /WORKSPACE_MEMBERSHIP_REQUIRED/);
  assert.doesNotMatch(requestScope, /body\.workspaceId/);
  assert.doesNotMatch(requestScope, /body\.workspace_id/);
  assert.match(serverSupabaseHelper, /export async function supabaseRequest/);
  assert.match(serverSupabaseHelper, /export async function selectFirstAvailable/);
  assert.match(serverSupabaseHelper, /updateByWorkspaceAndId/);
  assert.match(serverSupabaseHelper, /deleteByWorkspaceAndId/);
});
