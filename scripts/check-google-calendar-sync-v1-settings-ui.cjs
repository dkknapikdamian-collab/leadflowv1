const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-sync-v1-settings-ui']), 'missing package script check:google-calendar-sync-v1-settings-ui');

const settings = read('src/pages/Settings.tsx');
for (const marker of [
  'GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT',
  'data-google-calendar-sync-v1-stage03="true"',
  '/api/google-calendar?route=status',
  '/api/google-calendar?route=connect',
  '/api/google-calendar?route=disconnect',
  'Połącz Google',
  'Rozłącz Google',
  'Brakujące ENV',
  'CloseFlow jest źródłem prawdy',
]) {
  assert(settings.includes(marker), 'Settings.tsx missing marker: ' + marker);
}

assert(settings.includes('CalendarDays'), 'Settings.tsx must import/use CalendarDays icon');
assert(settings.includes('setGoogleCalendarStatus'), 'Settings.tsx must keep Google Calendar status state');
assert(settings.includes('canUseGoogleCalendarByPlan'), 'Settings.tsx must include paid-plan/admin gate copy');

const truth = read('src/lib/product-truth.ts');
const googleIndex = truth.indexOf("key: 'google_calendar'");
const googleSlice = googleIndex >= 0 ? truth.slice(googleIndex, googleIndex + 800) : '';
assert(googleSlice.includes("status: 'requires_config'"), 'Google Calendar product truth must be requires_config after Settings UI exists');
assert(googleSlice.includes('wymaga OAuth'), 'Google Calendar product truth must mention OAuth requirement');

for (const guardFile of [
  'scripts/check-google-calendar-sync-v1-foundation.cjs',
  'scripts/check-google-calendar-sync-v1-event-wiring.cjs',
]) {
  const guard = read(guardFile);
  assert(guard.includes("coming_soon|requires_config"), guardFile + ' must allow requires_config status');
}

assert(exists('docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT_2026-05-03.md'), 'missing Stage 03 release doc');

if (problems.length) {
  console.error('Google Calendar Sync V1 Stage 03 Settings UI guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Sync V1 Stage 03 Settings UI Connect');
