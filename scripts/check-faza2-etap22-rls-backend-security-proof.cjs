#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    fail(relativePath, 'Missing required file');
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const migrationPath = 'supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql';
const docPath = 'docs/release/FAZA2_ETAP22_RLS_BACKEND_SECURITY_PROOF_2026-05-03.md';
const sqlPath = 'docs/sql/CLOSEFLOW_RLS_WORKSPACE_SECURITY_PROOF_2026-05-03.sql';
const requestScopePath = 'src/server/_request-scope.ts';
const accessGatePath = 'src/server/_access-gate.ts';
const supabaseAuthPath = 'src/server/_supabase-auth.ts';
const pkgPath = 'package.json';
const quietPath = 'scripts/closeflow-release-check-quiet.cjs';

const migration = readRequired(migrationPath);
const migrationLower = migration.toLowerCase();
const doc = readRequired(docPath);
const sql = readRequired(sqlPath);
const requestScope = readRequired(requestScopePath);
const accessGate = readRequired(accessGatePath);
const supabaseAuth = readRequired(supabaseAuthPath);
const pkgRaw = readRequired(pkgPath);
const quiet = readRequired(quietPath);

const coreTables = ['profiles', 'workspaces', 'workspace_members'];
const businessTables = [
  'leads',
  'clients',
  'cases',
  'work_items',
  'activities',
  'ai_drafts',
  'response_templates',
  'case_items',
  'payments',
  'notifications',
  'workspace_settings',
  'client_portal_items',
  'portal_items',
  'portal_access_tokens',
  'files',
  'documents',
];

section('Required files');
for (const file of [migrationPath, docPath, sqlPath, requestScopePath, accessGatePath, supabaseAuthPath]) {
  if (exists(file)) pass(file, 'exists');
  else fail(file, 'missing');
}

section('A22 migration RLS foundation');
for (const table of coreTables) {
  assertIncludes(migrationPath, migrationLower, 'create table if not exists public.' + table, 'Migration creates/repairs ' + table);
  assertIncludes(migrationPath, migrationLower, 'alter table public.' + table + ' enable row level security', 'Migration enables RLS for ' + table);
  assertIncludes(migrationPath, migrationLower, 'alter table public.' + table + ' force row level security', 'Migration forces RLS for ' + table);
}

for (const needle of [
  'create or replace function public.closeflow_is_workspace_member',
  'create or replace function public.closeflow_is_admin',
  'auth.users',
  'after insert on auth.users',
  'business_tables text[]',
  'workspace_id::text',
]) {
  assertIncludes(migrationPath, migrationLower, needle, 'Migration contains: ' + needle);
}

for (const table of businessTables) {
  assertIncludes(migrationPath, migrationLower, "'" + table + "'", 'Migration business RLS list includes ' + table);
}

for (const policyNeedle of [
  '_workspace_member_select',
  '_workspace_member_insert',
  '_workspace_member_update',
  '_workspace_member_delete',
]) {
  assertIncludes(migrationPath, migrationLower, policyNeedle, 'Migration creates policy type ' + policyNeedle);
}

section('Manual SQL proof contract');
for (const needle of [
  'CLOSEFLOW RLS WORKSPACE SECURITY PROOF',
  'required_tables',
  'pg_policies',
  'pg_proc',
  'relrowsecurity',
  'relforcerowsecurity',
  'closeflow_is_workspace_member',
  'closeflow_is_admin',
  'rls_workspace_status',
  'table_missing',
  'fail_rls_not_enabled',
  'fail_missing_workspace_member_policy',
]) {
  assertIncludes(sqlPath, sql, needle, 'SQL proof contains: ' + needle);
}

for (const table of [...coreTables, ...businessTables]) {
  assertIncludes(sqlPath, sql, "'" + table + "'", 'SQL proof checks table ' + table);
}

section('Backend security proof markers');
for (const needle of [
  'requireSupabaseRequestContext',
  'getRequestIdentity(_req',
  'return { userId: null, email: null, fullName: null, workspaceId: null }',
  'resolveRequestWorkspaceId',
  'requireScopedRow',
  'fetchSingleScopedRow',
  'withWorkspaceFilter',
  'workspace_members?user_id=eq.',
]) {
  assertIncludes(requestScopePath, requestScope, needle, 'Request scope contains: ' + needle);
}

for (const needle of [
  'assertWorkspaceWriteAccess',
  'assertWorkspaceEntityLimit',
  'WORKSPACE_WRITE_ACCESS_REQUIRED',
]) {
  assertIncludes(accessGatePath, accessGate, needle, 'Access gate contains: ' + needle);
}

for (const needle of [
  'AUTHORIZATION_BEARER_REQUIRED',
  'INVALID_SUPABASE_ACCESS_TOKEN',
  '/auth/v1/user',
  'assertSupabaseEmailVerifiedForMutation',
]) {
  assertIncludes(supabaseAuthPath, supabaseAuth, needle, 'Supabase auth contains: ' + needle);
}

section('Documentation contract');
for (const needle of [
  'FAZA 2 - Etap 2.2 - RLS / backend security proof',
  'manual_evidence_required',
  'SQL proof',
  'User B nie widzi danych User A',
  'FAZA 3 - Etap 3.1 - Jedno źródło prawdy dla planów',
  'FAZA 2 - Etap 2.2B - RLS hardening SQL fix',
]) {
  assertIncludes(docPath, doc, needle, 'Doc contains: ' + needle);
}

section('Package and quiet gate');
let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
  pass(pkgPath, 'package.json parses');
} catch (error) {
  fail(pkgPath, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error)));
}

const scripts = pkg.scripts || {};
if (scripts['check:faza2-etap22-rls-backend-security-proof'] === 'node scripts/check-faza2-etap22-rls-backend-security-proof.cjs') {
  pass(pkgPath, 'check:faza2-etap22-rls-backend-security-proof is wired');
} else {
  fail(pkgPath, 'missing check:faza2-etap22-rls-backend-security-proof');
}

if (scripts['test:faza2-etap22-rls-backend-security-proof'] === 'node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs') {
  pass(pkgPath, 'test:faza2-etap22-rls-backend-security-proof is wired');
} else {
  fail(pkgPath, 'missing test:faza2-etap22-rls-backend-security-proof');
}

assertIncludes(quietPath, quiet, 'tests/faza2-etap22-rls-backend-security-proof.test.cjs', 'Quiet release gate includes Faza2 Etap2.2 test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 2 - Etap 2.2 RLS/backend security proof guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 2 - Etap 2.2 RLS/backend security proof guard');
