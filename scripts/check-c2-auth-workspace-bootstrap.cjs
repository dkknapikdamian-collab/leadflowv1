const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function mustExist(file) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`${file}:missing`);
}

function mustContain(file, needle, label = needle) {
  const text = read(file);
  if (!text.includes(needle)) failures.push(`${file}:missing:${label}`);
}

function mustNotContain(file, needle, label = needle) {
  const text = read(file);
  if (text.includes(needle)) failures.push(`${file}:forbidden:${label}`);
}

const migration = 'supabase/migrations/20260814190000_c2_auth_workspace_bootstrap_single_source.sql';
const apiMe = 'api/me.ts';
const fallback = 'src/lib/supabase-fallback.ts';
const workspaceHook = 'src/hooks/useWorkspace.ts';
const legacyWorkspace = 'src/lib/workspace.ts';

for (const file of [migration, apiMe, fallback, workspaceHook, legacyWorkspace]) mustExist(file);

if (fs.existsSync(path.join(root, migration))) {
  const text = read(migration);
  mustContain(migration, 'drop trigger if exists on_auth_user_created_closeflow on auth.users', 'Stage01 trigger removal');
  mustContain(migration, 'drop trigger if exists closeflow_bootstrap_user_after_auth_insert on auth.users', 'A22 trigger replacement');
  mustContain(migration, "'trial_14d'", 'canonical trial plan');
  mustContain(migration, "interval '14 days'", 'canonical trial duration');
  mustContain(migration, 'insert into public.workspace_members', 'owner membership bootstrap');
  mustContain(migration, 'on conflict (workspace_id, user_id)', 'membership idempotency');
  mustContain(migration, 'create trigger closeflow_bootstrap_user_after_auth_insert', 'single canonical trigger');
  mustNotContain(migration, 'create trigger on_auth_user_created_closeflow', 'historical duplicate trigger');
  mustNotContain(migration, "'trial_21d'", 'stale trial plan');
  const triggerCreates = text.match(/create\s+trigger\s+closeflow_bootstrap_user_after_auth_insert/gi) || [];
  if (triggerCreates.length !== 1) failures.push(`${migration}:expected-one-canonical-trigger-create:${triggerCreates.length}`);
}

if (fs.existsSync(path.join(root, apiMe))) {
  const text = read(apiMe);
  mustContain(apiMe, 'requireSupabaseAuthContext(req)', 'verified Supabase request context');
  mustContain(apiMe, 'workspace_members?workspace_id=eq.', 'workspace-bound membership lookup');
  mustContain(apiMe, '&user_id=eq.', 'verified-user membership lookup');
  mustContain(apiMe, 'WORKSPACE_MEMBERSHIP_REQUIRED', 'fail-closed missing membership');
  mustContain(apiMe, 'WORKSPACE_MEMBERSHIP_ROLE_INVALID', 'invalid role rejection');
  mustContain(apiMe, 'workspaceRole', 'canonical workspace role response');
  mustContain(apiMe, 'isWorkspaceOwner', 'owner role response');
  mustContain(apiMe, 'isWorkspaceAdmin', 'admin role response');
  mustContain(apiMe, 'workspaceMembership:', 'membership response');
  mustContain(apiMe, 'workspaceCreated || ownerIds.some', 'owner-only membership repair');
  mustNotContain(apiMe, 'req.body.workspaceId', 'request-body workspace authority');
  mustNotContain(apiMe, 'req.body.workspace_id', 'request-body workspace authority snake case');
}

if (fs.existsSync(path.join(root, fallback))) {
  mustContain(fallback, "workspaceRole?: 'owner' | 'admin' | 'member'", 'typed workspace role');
  mustContain(fallback, 'workspaceMembership?', 'typed membership response');
}

if (fs.existsSync(path.join(root, workspaceHook))) {
  mustContain(workspaceHook, 'profile?.isWorkspaceAdmin === true', 'membership-backed admin UI');
  mustContain(workspaceHook, 'isWorkspaceOwner', 'membership-backed owner UI');
  mustContain(workspaceHook, 'workspaceRole', 'role exposed to consumers');
}

if (fs.existsSync(path.join(root, legacyWorkspace))) {
  mustContain(legacyWorkspace, 'isSupabaseConfigured()', 'configured-auth branch');
  mustContain(legacyWorkspace, 'SUPABASE_WORKSPACE_BOOTSTRAP_REQUIRED', 'configured-auth fail-closed fallback');
}

const packageJson = JSON.parse(read('package.json'));
if (packageJson.scripts?.['check:c2-auth-workspace-bootstrap'] !== 'node scripts/check-c2-auth-workspace-bootstrap.cjs') {
  failures.push('package.json:missing:check:c2-auth-workspace-bootstrap');
}
if (packageJson.scripts?.['test:c2-auth-workspace-bootstrap'] !== 'node --test tests/c2-auth-workspace-bootstrap.test.cjs') {
  failures.push('package.json:missing:test:c2-auth-workspace-bootstrap');
}

try {
  const authOwnerGuard = require('./check-ssot-auth-session-owner.cjs');
  authOwnerGuard.assertCanonicalAuthOwner();
} catch (error) {
  failures.push(`ssot-auth-session-owner:${error instanceof Error ? error.message : String(error)}`);
}

if (failures.length) {
  console.error('C2 auth/workspace bootstrap guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-V1-PR-002',
  checks: [
    'single-live-bootstrap-trigger',
    'canonical-trial-plan',
    'verified-user-membership-boundary',
    'owner-only-membership-repair',
    'workspace-role-response',
    'configured-auth-local-fallback-fail-closed',
    'supabase-auth-session-owner-regression',
  ],
}, null, 2));
