#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const failures = [];

function mustInclude(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) failures.push(`${label}: ${file} missing ${needle}`);
}

function mustNotInclude(file, needle, label) {
  const text = read(file);
  if (text.includes(needle)) failures.push(`${label}: ${file} contains forbidden ${needle}`);
}

for (const file of [
  'src/lib/admin.ts',
  'src/hooks/useWorkspace.ts',
  'api/me.ts',
  'api/system.ts',
  'src/server/ai-config.ts',
  'src/server/_request-scope.ts',
]) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing checked file: ${file}`);
}

mustNotInclude('src/lib/admin.ts', 'dk.knapikdamian', 'no hardcoded admin email in frontend helper');
mustNotInclude('src/lib/admin.ts', 'DEFAULT_ADMIN_EMAILS', 'no frontend admin allowlist');
mustNotInclude('src/hooks/useWorkspace.ts', 'isAdminEmail(', 'frontend cannot compute admin from email');
mustNotInclude('api/me.ts', 'dk.knapikdamian', 'api/me cannot hardcode admin email');
mustNotInclude('api/system.ts', 'dk.knapikdamian', 'system admin endpoint cannot hardcode admin email');
mustNotInclude('src/server/ai-config.ts', 'dk.knapikdamian', 'ai config cannot hardcode admin email');
mustNotInclude('src/server/ai-config.ts', 'ADMIN_EMAILS', 'ai config cannot use env admin email allowlist');
mustNotInclude('api/system.ts', 'ADMIN_API_SECRET', 'admin endpoint cannot use query/body admin secret');
mustNotInclude('api/system.ts', 'adminSecret', 'admin endpoint cannot use query/body adminSecret');

mustInclude('src/server/_request-scope.ts', 'requireAdminAuthContext', 'server admin guard');
mustInclude('src/server/_request-scope.ts', "role === 'admin'", 'server role admin check');
mustInclude('src/index.css', "stageA19v2-sidebar-nav-contrast-fix.css", 'sidebar contrast import');
mustInclude('supabase/migrations/2026-05-01_stageA19v2_admin_role_schema_repair.sql', 'add column if not exists role', 'profiles role migration');
mustInclude('supabase/migrations/2026-05-01_stageA19v2_admin_role_schema_repair.sql', 'add column if not exists is_admin', 'profiles is_admin migration');

if (failures.length) {
  console.error('A19 v2 admin schema/sidebar guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A19 v2 admin schema/sidebar guard passed.');
