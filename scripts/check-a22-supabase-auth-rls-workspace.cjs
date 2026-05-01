#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const expect = (condition, message) => { if (!condition) fail.push(message); };

const migration = 'supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql';
expect(exists(migration), 'missing A22 Supabase Auth/RLS/workspace migration');

if (exists(migration)) {
  const sql = read(migration);
  const lower = sql.toLowerCase();
  for (const table of ['profiles', 'workspaces', 'workspace_members']) {
    expect(lower.includes('create table if not exists public.' + table), 'migration must create/repair public.' + table);
    expect(lower.includes('alter table public.' + table + ' enable row level security'), 'migration must enable RLS on public.' + table);
    expect(lower.includes('alter table public.' + table + ' force row level security'), 'migration must force RLS on public.' + table);
  }
  expect(lower.includes('auth.users'), 'migration must hook into auth.users');
  expect(lower.includes('closeflow_bootstrap_user'), 'migration must define bootstrap trigger function');
  expect(lower.includes('after insert on auth.users'), 'migration must create after insert trigger on auth.users');
  expect(lower.includes('closeflow_is_workspace_member'), 'migration must define workspace membership helper');
  expect(lower.includes('closeflow_is_admin'), 'migration must define admin helper');
  expect(lower.includes('business_tables text[]'), 'migration must enumerate business tables for RLS');
  for (const table of ['leads', 'clients', 'cases', 'work_items', 'activities', 'ai_drafts', 'response_templates', 'case_items']) {
    expect(lower.includes("'" + table + "'"), 'migration business RLS list missing ' + table);
  }
  expect(lower.includes('workspace_id::text'), 'migration policies must scope by workspace_id');
  expect(lower.includes('trial_active'), 'migration must bootstrap trial state');
}

expect(exists('docs/STAGE_A22_SUPABASE_AUTH_RLS_WORKSPACE.md'), 'missing A22 stage documentation');
expect(exists('docs/SUPABASE_AUTH_RLS_WORKSPACE.md'), 'missing Supabase Auth/RLS/workspace documentation');
expect(exists('api/_supabase.ts'), 'missing api/_supabase.ts compatibility export');

if (exists('api/_supabase.ts')) {
  expect(read('api/_supabase.ts').includes("../src/server/_supabase.js"), 'api/_supabase.ts must re-export server Supabase helper');
}

const supabaseAuth = read('src/server/_supabase-auth.ts');
expect(supabaseAuth.includes('AUTHORIZATION_BEARER_REQUIRED'), 'API without JWT must return 401 path');
expect(supabaseAuth.includes('INVALID_SUPABASE_ACCESS_TOKEN'), 'invalid Supabase JWT path missing');
expect(supabaseAuth.includes('/auth/v1/user'), 'server auth must verify token against Supabase Auth');
expect(supabaseAuth.includes('assertSupabaseEmailVerifiedForMutation'), 'email verification mutation guard must stay present');

const requestScope = read('src/server/_request-scope.ts');
expect(requestScope.includes('requireSupabaseRequestContext(req)'), 'request scope must derive identity from Supabase request context');
expect(requestScope.includes('getRequestIdentity(_req') && requestScope.includes('return { userId: null, email: null, fullName: null, workspaceId: null }'), 'request scope must not trust frontend identity headers');
expect(requestScope.includes('workspace_members?user_id=eq.'), 'workspace lookup must include workspace_members');
expect(requestScope.includes('withWorkspaceFilter'), 'request scope must expose workspace filter helper');

const apiMe = read('api/me.ts');
expect(apiMe.includes('requireSupabaseAuthContext'), '/api/me must require Supabase auth context');
expect(apiMe.includes('ensureProfile'), '/api/me must ensure profile bootstrap/repair');
expect(apiMe.includes('ensureWorkspace'), '/api/me must ensure workspace bootstrap/repair');
expect(apiMe.includes('workspace_members'), '/api/me must use workspace_members');
expect(apiMe.includes('normalizeWorkspace'), '/api/me must return normalized workspace');

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a22-supabase-auth-rls-workspace'], 'package.json missing check:a22-supabase-auth-rls-workspace');

if (fail.length) {
  console.error('A22 Supabase Auth/RLS/workspace guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A22 Supabase Auth/RLS/workspace guard passed.');
