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

const docPath = 'docs/release/FAZA2_ETAP21_WORKSPACE_ISOLATION_AUDIT_CHECKLIST_2026-05-03.md';
const requestScopePath = 'src/server/_request-scope.ts';
const accessGatePath = 'src/server/_access-gate.ts';
const supabaseAuthPath = 'src/server/_supabase-auth.ts';
const meApiPath = 'api/me.ts';
const serverSupabaseHelperPath = 'src/server/_supabase.ts';
const pkgPath = 'package.json';
const quietPath = 'scripts/closeflow-release-check-quiet.cjs';

const doc = readRequired(docPath);
const requestScope = readRequired(requestScopePath);
const accessGate = readRequired(accessGatePath);
const supabaseAuth = readRequired(supabaseAuthPath);
const meApi = readRequired(meApiPath);
const serverSupabaseHelper = readRequired(serverSupabaseHelperPath);
const pkgRaw = readRequired(pkgPath);
const quiet = readRequired(quietPath);

section('Required files');
for (const file of [
  docPath,
  requestScopePath,
  accessGatePath,
  supabaseAuthPath,
  meApiPath,
  serverSupabaseHelperPath,
]) {
  if (exists(file)) pass(file, 'exists');
  else fail(file, 'missing');
}

section('Checklist contract');
for (const needle of [
  'User B nie może widzieć żadnego tekstu',
  'AUDIT_A_LEAD',
  'AUDIT_A_TASK',
  'AUDIT_A_EVENT',
  'AUDIT_A_CASE',
  'bezpośredni URL do rekordu A nie działa dla User B',
  'Faza 2 - Etap 2.2 - RLS / backend security proof',
  'Nie twierdzimy, że security jest gotowe produkcyjnie',
  'body.workspaceId',
  'manual_evidence_required',
]) {
  assertIncludes(docPath, doc, needle, 'Checklist contains: ' + needle);
}

section('Request scope surface');
assertIncludes(requestScopePath, requestScope, 'requireSupabaseRequestContext', 'Request scope can use Supabase auth context');
assertIncludes(requestScopePath, requestScope, 'resolveRequestWorkspaceId', 'Request workspace resolver exists');
assertIncludes(requestScopePath, requestScope, 'requireScopedRow', 'Scoped row guard exists');
assertIncludes(requestScopePath, requestScope, 'fetchSingleScopedRow', 'Scoped row fetch exists');
assertIncludes(requestScopePath, requestScope, 'withWorkspaceFilter', 'Workspace filter helper exists');
assertIncludes(requestScopePath, requestScope, 'requireAdminAuthContext', 'Admin auth context helper exists');
assertIncludes(requestScopePath, requestScope, 'RequestAuthError', 'Request auth errors exist');
assertIncludes(requestScopePath, requestScope, 'WORKSPACE_OWNER_REQUIRED', 'Legacy P0 workspace owner marker exists');
assertIncludes(docPath, doc, 'WORKSPACE_OWNER_REQUIRED', 'Legacy P0 workspace owner marker is documented');
assertIncludes(requestScopePath, requestScope, 'body.workspaceId', 'Legacy body workspace fallback remains visible');
assertIncludes(docPath, doc, 'body.workspaceId', 'Legacy body workspace fallback is documented');

assertIncludes(serverSupabaseHelperPath, serverSupabaseHelper, 'export async function supabaseRequest', 'Server Supabase helper lives outside api function directory');
assertIncludes(serverSupabaseHelperPath, serverSupabaseHelper, 'export async function selectFirstAvailable', 'Server Supabase helper exposes selectFirstAvailable');
assertIncludes(requestScopePath, requestScope, 'getRequestIdentity(req: any, bodyInput?: any)', 'Request identity has Vercel API compatible signature');
assertIncludes(requestScopePath, requestScope, 'void req;', 'Request identity ignores spoofable req input at runtime');
assertIncludes(requestScopePath, requestScope, 'void bodyInput;', 'Request identity ignores spoofable body input at runtime');
assertIncludes(requestScopePath, requestScope, 'return { userId: null, email: null, fullName: null, workspaceId: null }', 'A22 static contract documents null frontend identity');
assertIncludes(requestScopePath, requestScope, 'workspace_members?user_id=eq.', 'Workspace membership lookup includes user_id-first query marker');


section('Access/auth surfaces');
for (const [file, content] of [
  [accessGatePath, accessGate],
  [supabaseAuthPath, supabaseAuth],
  [meApiPath, meApi],
]) {
  assertRegex(file, content, /workspace|Workspace|WORKSPACE/, file + ' references workspace');
  assertRegex(file, content, /auth|Auth|user|User|REQUEST|ACCESS|access/, file + ' references auth/access/user');
}

section('API scope indicators');
const apiDir = path.join(root, 'api');
const apiFiles = fs.existsSync(apiDir)
  ? fs.readdirSync(apiDir).filter((name) => name.endsWith('.ts')).map((name) => path.join('api', name))
  : [];

if (apiFiles.length) pass('api/*.ts', 'API files found: ' + apiFiles.length);
else fail('api/*.ts', 'No API files found');

const criticalApiFiles = [
  'api/leads.ts',
  'api/tasks.ts',
  'api/events.ts',
  'api/cases.ts',
  'api/me.ts',
  'api/ai-drafts.ts',
].filter(exists);

for (const file of criticalApiFiles) {
  const content = readRequired(file);
  const hasScopeMarker = /resolveRequestWorkspaceId|requireScopedRow|withWorkspaceFilter|requireSupabaseRequestContext|requireRequestIdentity|requireAdminAuthContext|WORKSPACE_|ACCESS_|workspace_id=eq/.test(content);
  if (hasScopeMarker) pass(file, 'critical API has scope/access marker');
  else fail(file, 'critical API missing obvious scope/access marker');
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
if (scripts['check:faza2-etap21-workspace-isolation'] === 'node scripts/check-faza2-etap21-workspace-isolation.cjs') {
  pass(pkgPath, 'check:faza2-etap21-workspace-isolation is wired');
} else {
  fail(pkgPath, 'missing check:faza2-etap21-workspace-isolation');
}

if (scripts['test:faza2-etap21-workspace-isolation'] === 'node --test tests/faza2-etap21-workspace-isolation.test.cjs') {
  pass(pkgPath, 'test:faza2-etap21-workspace-isolation is wired');
} else {
  fail(pkgPath, 'missing test:faza2-etap21-workspace-isolation');
}

assertIncludes(quietPath, quiet, 'tests/faza2-etap21-workspace-isolation.test.cjs', 'Quiet release gate includes Faza2 Etap2.1 test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 2 - Etap 2.1 workspace isolation audit guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 2 - Etap 2.1 workspace isolation audit guard');
