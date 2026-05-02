#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const apiMe = read('api/me.ts');
const useWorkspace = read('src/hooks/useWorkspace.ts');
const sql = read('supabase/migrations/20260502_p13_app_owners.sql');
const env = read('.env.example');
const pkg = JSON.parse(read('package.json'));

expect(apiMe.includes('type AppOwnerIdentity'), 'api/me must define AppOwnerIdentity');
expect(apiMe.includes('CLOSEFLOW_APP_OWNER_UIDS'), 'api/me must support CLOSEFLOW_APP_OWNER_UIDS');
expect(apiMe.includes('CLOSEFLOW_SERVER_APP_OWNER_UIDS'), 'api/me must support CLOSEFLOW_SERVER_APP_OWNER_UIDS');
expect(apiMe.includes('fetchAppOwnerGrant'), 'api/me must query app_owners table');
expect(apiMe.includes('app_owners?status=eq.active'), 'api/me must query active app_owners only');
expect(apiMe.includes('auth_uid=eq.'), 'api/me must support auth_uid owner lookup');
expect(apiMe.includes('user_id=eq.'), 'api/me must support user_id owner lookup');
expect(apiMe.includes('profile_id=eq.'), 'api/me must support profile_id owner lookup');
expect(apiMe.includes('email=eq.'), 'api/me may keep email fallback/lookup');
expect(apiMe.includes('resolveAppOwnerIdentity'), 'api/me must resolve app owner identity before profile response');
expect(apiMe.includes('await resolveAppOwnerIdentity(profileRow, uid, email)'), 'api/me must await resolved app owner identity');
expect(apiMe.includes('appOwnerSource'), 'api/me must expose appOwnerSource for diagnostics');
expect(apiMe.includes('appRole: appOwner ? appOwnerRole : \'workspace\''), 'api/me must expose appRole based on resolved owner role');
expect(!apiMe.includes("const appOwner = isServerConfiguredAdminEmail(email);"), 'api/me must not rely only on email for app owner');

expect(useWorkspace.includes('isAppOwner'), 'useWorkspace must keep app owner flag');
expect(useWorkspace.includes('buildCreatorAccessOverride'), 'useWorkspace must keep creator-only full access override');
expect(!useWorkspace.includes('const finalAccess = isAdmin ?'), 'workspace admin must not trigger full access');

expect(sql.includes('create table if not exists public.app_owners'), 'migration must create app_owners');
expect(sql.includes('alter table public.app_owners enable row level security'), 'migration must enable RLS');
expect(sql.includes('using (false)'), 'migration must block client-side RLS reads');
expect(sql.includes('auth_uid'), 'migration must include auth_uid');
expect(sql.includes('status text not null default \'active\''), 'migration must include status');
expect(sql.includes('role text not null default \'developer\''), 'migration must include role');

expect(env.includes('CLOSEFLOW_APP_OWNER_UIDS='), '.env.example must include CLOSEFLOW_APP_OWNER_UIDS');
expect(env.includes('CLOSEFLOW_SERVER_APP_OWNER_UIDS='), '.env.example must include CLOSEFLOW_SERVER_APP_OWNER_UIDS');

expect(pkg.scripts && pkg.scripts['check:p13-app-owner-identity-hardening'], 'package.json missing check:p13-app-owner-identity-hardening');

if (fail.length) {
  console.error('P13 app owner identity hardening guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P13 app owner identity hardening guard passed.');
