
const fs = require('fs');
const STAGE = 'STAGE231D_GOOGLE_AUTH_INTENT_GATE';
function fail(message) { console.error('[' + STAGE + '][FAIL] ' + message); process.exit(1); }
function read(file) { if (!fs.existsSync(file)) fail('Missing file: ' + file); return fs.readFileSync(file, 'utf8'); }
const authIntent = read('src/lib/auth-intent.ts');
const supabaseAuth = read('src/lib/supabase-auth.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const login = read('src/pages/Login.tsx');
const app = read('src/App.tsx');
const me = read('api/me.ts');
const nextSteps = read('_project/07_NEXT_STEPS.md');
const sqlDoc = read('docs/sql/STAGE231C_AUTH_TRIGGER_NOOP_REPAIR.md');
if (!authIntent.includes('setCloseFlowAuthIntent') || !authIntent.includes('consumeCloseFlowAuthNotice')) fail('auth intent helpers missing');
if (!supabaseAuth.includes("signInWithGoogle(intent") || !supabaseAuth.includes('setCloseFlowAuthIntent(intent)')) fail('signInWithGoogle intent setter missing');
if (!fallback.includes("x-closeflow-auth-intent") || !fallback.includes('getCloseFlowAuthIntent')) fail('supabase-fallback auth intent header missing');
if (!login.includes("handleGoogleLogin('login')")) fail('Google login button intent missing');
if (!login.includes("handleGoogleLogin('register')")) fail('Google register button intent missing');
if (!login.includes('getDefaultAuthTab')) fail('register tab URL default helper missing');
if (!app.includes('REGISTER_FIRST_REQUIRED') || !app.includes('setCloseFlowAuthNotice')) fail('App register-first signout handler missing');
if (!app.includes('<Route path="/" element={isLoggedIn ? <Today /> : <Login />} />')) fail('root route must show Login for logged-out users');
if (!me.includes('REGISTER_FIRST_REQUIRED') || !me.includes('getCloseFlowAuthIntentFromRequest')) fail('api/me register-first gate missing');
if (!nextSteps.includes('STAGE231E_EMAIL_COPY_REPAIR') || !nextSteps.includes('STAGE231F_INVITE_ONLY_TEST_MODE')) fail('future auth stages missing from next steps');
if (!sqlDoc.includes('STAGE231C_R7_NOOP_ALL_AUTH_USERS_BOOTSTRAP_TRIGGERS')) fail('Stage231C SQL repair documentation missing');
console.log(STAGE + ' PASS');
