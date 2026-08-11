const fs = require('fs');
const path = require('path');

const root = process.cwd();

const ACTIVE_AUTH_FILES = [
  'src/pages/Settings.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/SupportCenter.tsx',
  'api/leads.ts',
  'api/work-items.ts',
  'src/server/google-calendar-handler.ts',
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function findAuthOwnerViolations(file, content) {
  const violations = [];
  if (/from\s+['"][^'"]*firebase|firebase\/auth/.test(content)) violations.push(`${file}:firebase-auth-import`);
  if (/\bauth\.currentUser\b/.test(content)) violations.push(`${file}:firebase-current-user`);
  if (/x-(?:user-id|user-email|auth-uid|firebase-uid)/.test(content)) violations.push(`${file}:legacy-identity-header`);
  return violations;
}

function assertClientAuthSnapshotCacheOnly({ readFile = read } = {}) {
  const content = readFile('src/lib/client-auth.ts');
  if (/\bfetch\s*\(|\bXMLHttpRequest\b|\bAuthorization\b|x-(?:user-id|user-email|auth-uid|firebase-uid)/.test(content)) {
    throw new Error('client-auth snapshot must not perform request authentication or emit identity headers');
  }
  return { ok: true, mode: 'CACHE_ONLY' };
}

function assertCanonicalAuthOwner({ files = ACTIVE_AUTH_FILES, readFile = read } = {}) {
  const violations = files.flatMap((file) => findAuthOwnerViolations(file, readFile(file)));
  if (violations.length) {
    throw new Error(`ACTIVE_AUTH_OWNER_VIOLATIONS\n${violations.join('\n')}`);
  }

  const app = readFile('src/App.tsx');
  if (!app.includes('useSupabaseSession')) throw new Error('App.tsx must bootstrap from useSupabaseSession');

  const fallback = readFile('src/lib/supabase-fallback.ts');
  if (!fallback.includes('headers.Authorization = `Bearer ${accessToken}`')) throw new Error('API fallback must send Supabase bearer token');
  if (/headers\[['"]x-(?:user-id|user-email|auth-uid|firebase-uid)['"]\]/.test(fallback)) {
    throw new Error('supabase-fallback must not synthesize legacy identity headers');
  }
  assertClientAuthSnapshotCacheOnly({ readFile });

  const supabaseAuth = readFile('src/lib/supabase-auth.ts');
  for (const marker of ['signInWithPassword', 'sendPasswordReset', 'updateSupabaseUser', 'signOutFromSupabase']) {
    if (!supabaseAuth.includes(marker)) throw new Error(`Supabase Auth owner missing ${marker}`);
  }

  for (const file of ['api/leads.ts', 'api/work-items.ts', 'src/server/google-calendar-handler.ts']) {
    if (!readFile(file).includes('requireSupabaseRequestContext')) {
      throw new Error(`${file} must derive identity from verified Supabase request context`);
    }
  }

  return { ok: true, activeFiles: files.length, violations: [] };
}

if (require.main === module) {
  try {
    console.log(JSON.stringify(assertCanonicalAuthOwner(), null, 2));
  } catch (error) {
    console.error(String(error && error.message ? error.message : error));
    process.exit(1);
  }
}

module.exports = { ACTIVE_AUTH_FILES, findAuthOwnerViolations, assertClientAuthSnapshotCacheOnly, assertCanonicalAuthOwner };
