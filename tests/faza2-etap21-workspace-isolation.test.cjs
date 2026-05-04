const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 2 Etap 2.1 workspace isolation audit is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA2_ETAP21_WORKSPACE_ISOLATION_AUDIT_CHECKLIST_2026-05-03.md');
  const guard = read('scripts/check-faza2-etap21-workspace-isolation.cjs');

  assert.equal(pkg.scripts['check:faza2-etap21-workspace-isolation'], 'node scripts/check-faza2-etap21-workspace-isolation.cjs');
  assert.equal(pkg.scripts['test:faza2-etap21-workspace-isolation'], 'node --test tests/faza2-etap21-workspace-isolation.test.cjs');
  assert.match(quiet, /tests\/faza2-etap21-workspace-isolation\.test\.cjs/);

  assert.match(doc, /FAZA 2 - Etap 2\.1 - Workspace isolation/);
  assert.match(doc, /User B nie może widzieć żadnego tekstu/);
  assert.match(doc, /AUDIT_A_LEAD/);
  assert.match(doc, /AUDIT_A_TASK/);
  assert.match(doc, /AUDIT_A_EVENT/);
  assert.match(doc, /AUDIT_A_CASE/);
  assert.match(doc, /Nie twierdzimy, że security jest gotowe produkcyjnie/);
  assert.match(doc, /Faza 2 - Etap 2\.2 - RLS \/ backend security proof/);

  assert.match(guard, /PASS FAZA 2 - Etap 2\.1 workspace isolation audit guard/);
});

test('Request scope helpers and known compatibility debt are visible', () => {
  const requestScope = read('src/server/_request-scope.ts');
  const serverSupabaseHelper = read('src/server/_supabase.ts');
  const doc = read('docs/release/FAZA2_ETAP21_WORKSPACE_ISOLATION_AUDIT_CHECKLIST_2026-05-03.md');

  for (const marker of [
    'requireSupabaseRequestContext',
    'resolveRequestWorkspaceId',
    'requireScopedRow',
    'fetchSingleScopedRow',
    'withWorkspaceFilter',
    'requireAdminAuthContext',
  ]) {
    assert.match(requestScope, new RegExp(marker));
  }

  assert.match(requestScope, /body\.workspaceId/);
  assert.match(doc, /body\.workspaceId/);
  assert.match(doc, /manual_evidence_required/);
  assert.match(serverSupabaseHelper, /export async function supabaseRequest/);
  assert.match(serverSupabaseHelper, /export async function selectFirstAvailable/);
  assert.match(requestScope, /getRequestIdentity\(_req/);
  assert.match(requestScope, /return \{ userId: null, email: null, fullName: null, workspaceId: null \}/);
  assert.match(requestScope, /workspace_members\?user_id=eq\./);
  assert.match(requestScope, /WORKSPACE_OWNER_REQUIRED/);
  assert.match(doc, /WORKSPACE_OWNER_REQUIRED/);
});
