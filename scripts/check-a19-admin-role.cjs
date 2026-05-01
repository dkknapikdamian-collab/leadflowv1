#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const filesToScan = [
  'src/lib/admin.ts',
  'src/hooks/useWorkspace.ts',
  'api/me.ts',
  'api/system.ts',
  'src/server/_request-scope.ts',
  'src/server/_access-gate.ts',
  'src/server/ai-config.ts',
];

for (const file of filesToScan) {
  const content = read(file);
  expect(!content.includes('dk.knapikdamian@gmail.com'), `${file}: contains hardcoded admin email`);
  expect(!/DEFAULT_ADMIN_EMAILS/.test(content), `${file}: contains DEFAULT_ADMIN_EMAILS`);
}

const adminClient = read('src/lib/admin.ts');
expect(!/\[[^\]]*@[^]*\]/.test(adminClient), 'src/lib/admin.ts: client-side admin allowlist still present');
expect(/isAdminProfile/.test(adminClient), 'src/lib/admin.ts: missing isAdminProfile helper');

const useWorkspace = read('src/hooks/useWorkspace.ts');
expect(!/isAdminEmail\s*\(/.test(useWorkspace), 'src/hooks/useWorkspace.ts: still derives admin from email');
expect(!/import\s+\{\s*isAdminEmail\s*\}/.test(useWorkspace), 'src/hooks/useWorkspace.ts: still imports isAdminEmail');
expect(/profile\?\.role\s*===\s*['"]admin['"]/.test(useWorkspace), 'src/hooks/useWorkspace.ts: missing backend profile.role admin check');
expect(/profile\?\.isAdmin\s*===\s*true/.test(useWorkspace), 'src/hooks/useWorkspace.ts: missing backend profile.isAdmin check');

const apiMe = read('api/me.ts');
expect(!/function\s+isAdminEmail/.test(apiMe), 'api/me.ts: contains isAdminEmail helper');
expect(/isAdminProfileRow/.test(apiMe), 'api/me.ts: missing Supabase profile role helper');
expect(/role:\s*asString\(row\?\.role/.test(apiMe), 'api/me.ts: profile role is not returned from backend');
expect(/isAdmin:\s*admin/.test(apiMe), 'api/me.ts: isAdmin is not returned from backend profile model');
expect(/CLOSEFLOW_SERVER_ADMIN_EMAILS/.test(apiMe), 'api/me.ts: optional server-only admin config is not documented in code');

const requestScope = read('src/server/_request-scope.ts');
expect(/requireAdminAuthContext/.test(requestScope), 'src/server/_request-scope.ts: missing server-side admin guard');
expect(/ADMIN_ROLE_REQUIRED/.test(requestScope), 'src/server/_request-scope.ts: missing ADMIN_ROLE_REQUIRED error');
expect(/profiles\?select=role/.test(requestScope), 'src/server/_request-scope.ts: role is not loaded from Supabase profiles');

const system = read('api/system.ts');
expect(/requireAdminAuthContext/.test(system), 'api/system.ts: admin endpoint is not using server role guard');
expect(!/adminSecret/.test(system), 'api/system.ts: adminSecret query/body path still exists');
expect(!/ADMIN_API_SECRET/.test(system), 'api/system.ts: ADMIN_API_SECRET fallback still exists');

const aiConfig = read('src/server/ai-config.ts');
expect(/requireAdminAuthContext/.test(aiConfig), 'src/server/ai-config.ts: AI diagnostics not protected by server role guard');
expect(!/isAdminEmail/.test(aiConfig), 'src/server/ai-config.ts: still uses email-derived admin check');

const envExample = read('.env.example');
expect(/CLOSEFLOW_SERVER_ADMIN_EMAILS=/.test(envExample), '.env.example: missing server-only optional admin bootstrap env');
expect(!/VITE_.*ADMIN/i.test(envExample), '.env.example: admin env must not be public VITE_*');

const migrationDir = path.join(root, 'supabase', 'migrations');
const migrations = fs.readdirSync(migrationDir).filter((name) => name.endsWith('.sql'));
const hasAdminRoleMigration = migrations.some((name) => {
  const content = fs.readFileSync(path.join(migrationDir, name), 'utf8');
  return /profiles/.test(content) && /role/.test(content) && /admin/.test(content);
});
expect(hasAdminRoleMigration, 'supabase/migrations: missing profiles.role admin migration/guard');

if (fail.length) {
  console.error('A19 admin role guard failed.');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('OK: A19 admin role guard passed.');
