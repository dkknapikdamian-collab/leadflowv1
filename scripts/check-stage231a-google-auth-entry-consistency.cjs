const fs = require('fs');

const STAGE = 'STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY';
const PASS = 'STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY PASS';

function fail(message) {
  console.error('[' + STAGE + '][FAIL] ' + message);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail('Missing file: ' + filePath);
  return fs.readFileSync(filePath, 'utf8');
}

function extractTabsContent(source, value) {
  const startNeedle = '<TabsContent value="' + value + '"';
  const start = source.indexOf(startNeedle);
  if (start < 0) fail(value + ' TabsContent start missing');
  const end = source.indexOf('</TabsContent>', start);
  if (end < 0) fail(value + ' TabsContent end missing');
  return source.slice(start, end + '</TabsContent>'.length);
}

const login = read('src/pages/Login.tsx');
const loginTab = extractTabsContent(login, 'login');
const registerTab = extractTabsContent(login, 'register');
const me = read('api/me.ts');
const nextSteps = read('_project/07_NEXT_STEPS.md');

if (!loginTab.includes('onClick={handleGoogleLogin}')) fail('Login tab Google handler missing');
if (!loginTab.includes('Kontynuuj przez Google')) fail('Login tab Google copy missing');

if (!registerTab.includes('data-stage231a-register-google-entry="true"')) fail('Register Google entry marker missing');
if (!registerTab.includes('onClick={handleGoogleLogin}')) fail('Register Google handler missing');
if (!registerTab.includes('Zarejestruj przez Google')) fail('Register Google copy missing');
if (!registerTab.includes('data-stage231a-google-trial-copy="true"')) fail('Register Google trial copy marker missing');

if (!me.includes('STAGE231A_GOOGLE_AUTH_PUBLIC_TRIAL_BOOTSTRAP_DECISION')) fail('api/me public trial bootstrap marker missing');
if (!nextSteps.includes('STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY')) fail('Next steps Stage231A marker missing');
if (!nextSteps.includes('STAGE231B_SUPABASE_ONLY_SETTINGS_SECURITY')) fail('Next steps Stage231B marker missing');

console.log(PASS);
