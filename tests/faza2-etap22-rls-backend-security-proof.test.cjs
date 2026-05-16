const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 2 Etap 2.2 RLS/backend security proof is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/release/FAZA2_ETAP22_RLS_BACKEND_SECURITY_PROOF_2026-05-03.md');
  const guard = read('scripts/check-faza2-etap22-rls-backend-security-proof.cjs');
  const sql = read('docs/sql/CLOSEFLOW_RLS_WORKSPACE_SECURITY_PROOF_2026-05-03.sql');

  assert.equal(pkg.scripts['check:faza2-etap22-rls-backend-security-proof'], 'node scripts/check-faza2-etap22-rls-backend-security-proof.cjs');
  assert.equal(pkg.scripts['test:faza2-etap22-rls-backend-security-proof'], 'node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs');
  assert.match(quiet, /tests\/faza2-etap22-rls-backend-security-proof\.test\.cjs/);

  assert.match(doc, /FAZA 2 - Etap 2\.2 - RLS \/ backend security proof/);
  assert.match(doc, /manual_evidence_required/);
  assert.match(doc, /SQL proof/);
  assert.match(doc, /FAZA 3 - Etap 3\.1 - Jedno \u017Ar\u00F3d\u0142o prawdy dla plan\u00F3w/);
  assert.match(doc, /FAZA 2 - Etap 2\.2B - RLS hardening SQL fix/);

  assert.match(sql, /CLOSEFLOW RLS WORKSPACE SECURITY PROOF/);
  assert.match(sql, /pg_policies/);
  assert.match(sql, /pg_proc/);
  assert.match(sql, /relrowsecurity/);
  assert.match(sql, /relforcerowsecurity/);

  assert.match(guard, /PASS FAZA 2 - Etap 2\.2 RLS\/backend security proof guard/);
});

test('A22 migration and backend markers cover workspace RLS proof surface', () => {
  const migration = read('supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql').toLowerCase();
  const requestScope = read('src/server/_request-scope.ts');
  const accessGate = read('src/server/_access-gate.ts');
  const supabaseAuth = read('src/server/_supabase-auth.ts');

  for (const table of ['profiles', 'workspaces', 'workspace_members']) {
    assert.match(migration, new RegExp('create table if not exists public\\.' + table));
    assert.match(migration, new RegExp('alter table public\\.' + table + ' enable row level security'));
    assert.match(migration, new RegExp('alter table public\\.' + table + ' force row level security'));
  }

  for (const table of ['leads', 'clients', 'cases', 'work_items', 'activities', 'ai_drafts']) {
    assert.match(migration, new RegExp("'" + table + "'"));
  }

  assert.match(migration, /closeflow_is_workspace_member/);
  assert.match(migration, /closeflow_is_admin/);
  assert.match(migration, /workspace_id::text/);

  assert.match(requestScope, /requireSupabaseRequestContext/);
  assert.match(requestScope, /getRequestIdentity\(_req/);
  assert.match(requestScope, /return \{ userId: null, email: null, fullName: null, workspaceId: null \}/);
  assert.match(requestScope, /workspace_members\?user_id=eq\./);
  assert.match(requestScope, /requireScopedRow/);
  assert.match(requestScope, /withWorkspaceFilter/);

  assert.match(accessGate, /assertWorkspaceWriteAccess/);
  assert.match(accessGate, /WORKSPACE_WRITE_ACCESS_REQUIRED/);

  assert.match(supabaseAuth, /AUTHORIZATION_BEARER_REQUIRED/);
  assert.match(supabaseAuth, /INVALID_SUPABASE_ACCESS_TOKEN/);
  assert.match(supabaseAuth, /\/auth\/v1\/user/);
});
