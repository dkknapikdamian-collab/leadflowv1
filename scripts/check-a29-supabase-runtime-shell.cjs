const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing required file: ${relPath}`);
  return fs.readFileSync(fullPath, 'utf8');
}

const failures = [];
function assert(condition, message) {
  if (!condition) failures.push(message);
}

const layout = read('src/components/Layout.tsx');
const today = read('src/pages/Today.tsx');
const supabaseAuth = read('src/lib/supabase-auth.ts');
const supabaseSessionHook = read('src/hooks/useSupabaseSession.ts');
const workspaceHook = read('src/hooks/useWorkspace.ts');
const firebase = fs.existsSync(path.join(root, 'src/firebase.ts')) ? read('src/firebase.ts') : '';

assert(!layout.includes("../firebase"), 'Layout.tsx must not import ../firebase');
assert(!layout.includes('auth.currentUser'), 'Layout.tsx must not use auth.currentUser');
assert(!layout.includes('auth.signOut'), 'Layout.tsx must not call auth.signOut');
assert(layout.includes("import { useSupabaseSession } from '../hooks/useSupabaseSession';"), 'Layout.tsx must import useSupabaseSession');
assert(layout.includes("import { signOutFromSupabase } from '../lib/supabase-auth';"), 'Layout.tsx must import signOutFromSupabase');
assert(layout.includes('const [supabaseUser] = useSupabaseSession();'), 'Layout.tsx must read Supabase session user');
assert(layout.includes('const { workspace, hasAccess, profile } = useWorkspace();'), 'Layout.tsx must read Supabase workspace profile');
assert(layout.includes('const userEmail = profile?.email || supabaseUser?.email'), 'Layout.tsx must derive email from profile/session');
assert(layout.includes('const userName = profile?.fullName || supabaseUser?.displayName'), 'Layout.tsx must derive user name from profile/session');
assert(layout.includes('const handleSignOut = async () =>'), 'Layout.tsx must define Supabase sign-out handler');
assert(layout.includes('await signOutFromSupabase();'), 'Layout.tsx sign-out handler must call signOutFromSupabase');
assert(layout.includes('email={userEmail}'), 'Layout.tsx user cards must display Supabase email value');
assert(layout.includes('onClick={() => void handleSignOut()}'), 'Layout.tsx logout buttons must call Supabase sign-out handler');

assert(!today.includes("../firebase"), 'Today.tsx must not import ../firebase');
assert(!/\bauth\s*\./.test(today), 'Today.tsx must not use Firebase auth runtime');

assert(supabaseAuth.includes('export async function signOutFromSupabase'), 'supabase-auth.ts must export signOutFromSupabase');
assert(supabaseSessionHook.includes('export function useSupabaseSession'), 'useSupabaseSession.ts must export useSupabaseSession');
assert(workspaceHook.includes('profile,'), 'useWorkspace.ts must expose profile');
assert(firebase.includes('A29_LEGACY_FIREBASE_RUNTIME_MARKER') || firebase.includes('Firebase runtime is legacy compatibility'), 'src/firebase.ts must be marked as legacy compatibility');

if (failures.length > 0) {
  console.error('A29 Supabase runtime shell guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A29 Supabase runtime shell/Today guard passed.');
