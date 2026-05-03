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

const settings = read('src/pages/Settings.tsx');

for (const marker of [
  "import { useClientAuthSnapshot } from '../hooks/useClientAuthSnapshot';",
  'const authSnapshot = useClientAuthSnapshot();',
  'GOOGLE_CALENDAR_STAGE07C_SUPABASE_AUTH_SNAPSHOT',
  "const activeUserId = auth.currentUser?.uid || authSnapshot.uid || workspaceProfile?.id || '';",
  "const activeUserEmail = auth.currentUser?.email || authSnapshot.email || workspaceProfile?.email || '';",
  "const canUseGoogleCalendarByPlan = isAdmin || isAppOwner || access?.isPaidActive || access?.status === 'paid_active';",
  "'x-user-id': activeUserId,",
  "'x-user-email': activeUserEmail,",
  "}, [workspace?.id, activeUserId, activeUserEmail]);",
]) {
  assert(settings.includes(marker), 'Settings.tsx missing marker: ' + marker);
}

const googleBlockStart = settings.indexOf('GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT');
const googleBlockEnd = settings.indexOf('const handleSaveGoogleCalendarReminderPreference', googleBlockStart);
const googleBlock = googleBlockStart >= 0 && googleBlockEnd > googleBlockStart
  ? settings.slice(googleBlockStart, googleBlockEnd)
  : '';

assert(Boolean(googleBlock), 'Google Calendar settings block not found');
assert(!/auth\.currentUser\??\.uid/.test(googleBlock), 'Google Calendar block must not use Firebase auth.currentUser uid');
assert(!/auth\.currentUser\??\.email\s*\|\|\s*workspaceProfile\?\.email\s*\|\|\s*''/.test(googleBlock), 'Google Calendar block must not send Firebase-only email fallback directly');
assert(googleBlock.includes('!workspace?.id || !activeUserId'), 'Google Calendar block must gate on activeUserId');
assert(googleBlock.includes("'x-user-id': activeUserId,"), 'Google Calendar block must send activeUserId');
assert(googleBlock.includes("'x-user-email': activeUserEmail,"), 'Google Calendar block must send activeUserEmail');

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage07c-settings-auth-snapshot']), 'package.json missing Stage 07c guard script');

if (problems.length) {
  console.error('Google Calendar Stage 07c Settings auth snapshot guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 07c Settings auth snapshot');
