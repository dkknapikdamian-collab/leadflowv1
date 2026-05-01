const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('ERROR:', message);
    process.exit(1);
  }
}

const requiredFiles = [
  'src/lib/supabase-auth.ts',
  'src/hooks/useSupabaseSession.ts',
  'src/server/_supabase-auth.ts',
  'src/server/_request-scope.ts',
  'supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql',
  'docs/STAGE01_SUPABASE_AUTH.md',
];

for (const file of requiredFiles) {
  assert(exists(file), `${file} is missing`);
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.dependencies && pkg.dependencies['@supabase/supabase-js'], 'package.json must include @supabase/supabase-js');
assert(pkg.scripts && pkg.scripts['verify:auth:supabase-stage01'], 'package.json must include verify:auth:supabase-stage01');

const app = read('src/App.tsx');
const login = read('src/pages/Login.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const requestScope = read('src/server/_request-scope.ts');
const apiMe = read('api/me.ts');
const envExample = read('.env.example');

assert(app.includes('useSupabaseSession'), 'App.tsx must use useSupabaseSession');
assert(!app.includes('useFirebaseSession'), 'App.tsx must not use useFirebaseSession');
assert(!app.includes("from './firebase'"), 'App.tsx must not import firebase');
assert(login.includes('signInWithGoogle'), 'Login.tsx must use Supabase Google auth');
assert(!login.includes('firebase/auth'), 'Login.tsx must not import firebase/auth');
assert(!login.includes('../firebase'), 'Login.tsx must not import firebase config');
assert(fallback.includes('Authorization: `Bearer ${accessToken}`'), 'API client must send Supabase bearer token');
assert(!fallback.includes("'x-user-id'"), 'API client must not send x-user-id');
assert(!fallback.includes("'x-user-email'"), 'API client must not send x-user-email');
assert(!fallback.includes("'x-user-name'"), 'API client must not send x-user-name');
assert(!fallback.includes("'x-workspace-id'"), 'API client must not send x-workspace-id');
assert(requestScope.includes('requireSupabaseRequestContext'), 'request scope must use verified Supabase request context');
assert(!requestScope.includes("headerValue(req, 'x-user-id')"), 'request scope must not trust x-user-id');
assert(!requestScope.includes("headerValue(req, 'x-workspace-id')"), 'request scope must not trust x-workspace-id');
assert(apiMe.includes('requireSupabaseRequestContext'), 'api/me.ts must derive identity from Supabase JWT');
assert(!apiMe.includes("req.query?.uid || req.headers?.['x-user-id']"), 'api/me.ts must not trust query/header identity');
assert(envExample.includes('VITE_SUPABASE_ANON_KEY'), '.env.example must include VITE_SUPABASE_ANON_KEY');
assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), '.env.example must include SUPABASE_SERVICE_ROLE_KEY');

console.log('OK: Stage 01 Supabase Auth guard passed.');
