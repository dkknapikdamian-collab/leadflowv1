#!/usr/bin/env node
/* Bounded C1 repository-only schema, RLS and service-role boundary guard. */
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    failures.push(`MISSING:${relativePath}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function requireText(value, needle, scope) {
  if (!value.toLowerCase().includes(needle.toLowerCase())) {
    failures.push(`${scope}: missing ${needle}`);
  }
}

const migrationsRoot = path.join(root, 'supabase', 'migrations');
const migrationFiles = fs.existsSync(migrationsRoot)
  ? fs.readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort()
  : [];

const strictMigrations = migrationFiles.filter((name) => /^\d{14}_/.test(name));
const strictPrefixes = strictMigrations.map((name) => name.slice(0, 14));
if (new Set(strictPrefixes).size !== strictPrefixes.length) {
  failures.push('MIGRATION_LEDGER: duplicate strict timestamp prefix');
}
for (let index = 1; index < strictPrefixes.length; index += 1) {
  if (strictPrefixes[index] < strictPrefixes[index - 1]) {
    failures.push(`MIGRATION_LEDGER: non-monotonic strict order ${strictMigrations[index - 1]} -> ${strictMigrations[index]}`);
  }
}

const foundation = read('supabase/migrations/20260501012200_stageA22_supabase_auth_rls_workspace_foundation.sql');
const p0 = read('supabase/migrations/20260501194000_p0_supabase_rls_schema_confirmation.sql');
const storage = read('supabase/migrations/20260502100000_portal_uploads_storage_bucket.sql');
const publicGrantBoundary = read('supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql');
const serviceRole = read('src/server/_supabase.ts');
const records = read('src/server/records.ts');
const activities = read('src/server/activities-handler.ts');

for (const table of ['profiles', 'workspaces', 'workspace_members']) {
  requireText(foundation, `create table if not exists public.${table}`, 'A22_FOUNDATION');
  requireText(foundation, `alter table public.${table} enable row level security`, 'A22_FOUNDATION');
  requireText(foundation, `alter table public.${table} force row level security`, 'A22_FOUNDATION');
}
for (const marker of [
  'closeflow_is_workspace_member',
  'closeflow_is_admin',
  'after insert on auth.users',
  'business_tables text[]',
  'force row level security',
]) {
  requireText(foundation, marker, 'A22_FOUNDATION');
}
for (const table of ['leads', 'clients', 'cases', 'work_items', 'activities', 'ai_drafts', 'response_templates', 'case_items']) {
  requireText(foundation, `'${table}'`, 'A22_BUSINESS_RLS');
}
for (const marker of ['enable row level security', 'force row level security', 'workspace_id::text']) {
  requireText(p0, marker, 'P0_RLS_CONFIRMATION');
}
requireText(storage, "'portal-uploads'", 'STORAGE_BUCKET');
requireText(storage, 'public,', 'STORAGE_BUCKET');
requireText(storage, 'public = false', 'STORAGE_BUCKET');
requireText(publicGrantBoundary, 'revoke all on all tables in schema public from public, anon', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'revoke all on all tables in schema storage from public, anon', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'alter default privileges for role postgres in schema public', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'alter default privileges for role postgres in schema storage', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'alter default privileges for role supabase_admin in schema public', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'alter default privileges for role supabase_admin in schema storage', 'PUBLIC_GRANT_BOUNDARY');
requireText(publicGrantBoundary, 'alter default privileges for role supabase_storage_admin in schema storage', 'PUBLIC_GRANT_BOUNDARY');

const c1BoundaryIndex = migrationFiles.indexOf('20260811180000_c1_revoke_public_anon_grants.sql');
if (c1BoundaryIndex >= 0) {
  for (const filename of migrationFiles.slice(c1BoundaryIndex + 1)) {
    const laterMigration = read(path.join('supabase', 'migrations', filename));
    if (/\bgrant\b[\s\S]*?\bto\s+(?:public|anon)\b/i.test(laterMigration)) {
      failures.push(`PUBLIC_GRANT_BOUNDARY: later migration re-grants PUBLIC/anon privileges: ${filename}`);
    }
  }
}

requireText(serviceRole, 'SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE');
if (/VITE_SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/.test(serviceRole)) {
  failures.push('SERVICE_ROLE: public service-role environment name');
}
for (const marker of ['updateByIdScoped', 'deleteByIdScoped']) {
  requireText(records, marker, 'RECORDS_HANDLER');
  requireText(activities, marker, 'ACTIVITIES_HANDLER');
}
if (/await\s+(?:updateById|deleteById)\s*\(\s*['"]activities['"]/.test(records)) {
  failures.push('RECORDS_HANDLER: unscoped activities mutation');
}

if (failures.length) {
  console.error('C1_SUPABASE_BOUNDARY_GUARD_FAILED');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log(`C1_SUPABASE_BOUNDARY_GUARD_PASS: migrations=${migrationFiles.length}; strict=${strictMigrations.length}; historical=${migrationFiles.length - strictMigrations.length}`);
