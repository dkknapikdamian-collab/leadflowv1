const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const requestScope = read('src/server/_request-scope.ts');
for (const marker of [
  'ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03',
  'profileHasAdminRole',
  'findAdminProfileForIdentity',
  'profiles?email=eq.',
  'profiles?firebase_uid=eq.',
  'profiles?auth_uid=eq.',
  'profiles?external_auth_uid=eq.',
  'profileRow = await findAdminProfileForIdentity(identity)',
  "ADMIN_ROLE_REQUIRED",
  'requireSupabaseRequestContext(req)',
  'not spoofable x-user-email headers',
]) {
  assert(requestScope.includes(marker), 'request scope missing marker: ' + marker);
}
assert(/role === 'admin'/.test(requestScope), 'backend admin gate must accept profiles.role=admin');
assert(/is_admin/.test(requestScope), 'backend admin gate must accept profiles.is_admin');
assert(/app_owner/.test(requestScope), 'backend admin gate must accept app owner role');
assert(requestScope.indexOf('requireSupabaseRequestContext(req)') < requestScope.indexOf('findAdminProfileForIdentity(identity)'), 'profiles admin lookup must happen after verified Supabase context');

const adminPage = read('src/pages/AdminAiSettings.tsx');
assert(adminPage.includes('const { isAdmin, loading } = useWorkspace()'), 'AdminAiSettings must still use useWorkspace isAdmin');
assert(adminPage.includes('if (!isAdmin)'), 'AdminAiSettings must keep non-admin conditional gate');
assert(adminPage.includes('PHASE0_AI_ADMIN_PAGE_GUARD'), 'AdminAiSettings must keep admin page guard marker');
assert(adminPage.includes('fetchAiConfigDiagnostics'), 'AdminAiSettings must fetch diagnostics only through client helper');
assert(adminPage.includes('loadDiagnostics'), 'AdminAiSettings must keep diagnostics loader');

const aiConfig = read('src/server/ai-config.ts');
assert(aiConfig.includes('requireAdminAuthContext'), 'AI config backend must still require admin auth context');
assert(aiConfig.includes('admin_only'), 'AI config diagnostics must remain admin_only');

const aiClient = read('src/lib/ai-config.ts');
assert(aiClient.includes('/api/system?kind=ai-config'), 'AI config client must keep backend route');

const system = read('api/system.ts');
assert(system.includes("kind === 'google-calendar'"), 'api/system.ts must keep google calendar consolidation route');
assert(system.includes('googleCalendarHandler'), 'api/system.ts must keep google calendar handler');

if (problems.length) {
  console.error('Admin AI role gate guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Admin AI role gate consistency guard');
