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

const pref = 'src/lib/google-calendar-reminder-preferences.ts';
assert(exists(pref), 'missing Google Calendar reminder preference lib');
const prefContent = exists(pref) ? read(pref) : '';
for (const marker of [
  'GOOGLE_CALENDAR_SYNC_V1_STAGE06_REMINDER_METHOD_UI',
  'GOOGLE_CALENDAR_REMINDER_METHOD_STORAGE_KEY',
  'getGoogleCalendarReminderPreference',
  'setGoogleCalendarReminderPreference',
  'applyGoogleCalendarReminderPreferenceToEventPayload',
  'googleCalendarReminderMethod',
  'googleCalendarReminderMinutesBefore',
]) {
  assert(prefContent.includes(marker), 'preference lib missing marker: ' + marker);
}

const settings = read('src/pages/Settings.tsx');
for (const marker of [
  'GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS',
  'getGoogleCalendarReminderPreference',
  'setGoogleCalendarReminderPreference',
  'googleCalendarReminderMethod',
  'googleCalendarReminderMinutes',
  'handleSaveGoogleCalendarReminderPreference',
  'data-google-calendar-reminder-ui="stage06"',
  'Zapisz przypomnienia Google',
]) {
  assert(settings.includes(marker), 'Settings.tsx missing marker: ' + marker);
}

const fallback = read('src/lib/supabase-fallback.ts');
assert(fallback.includes("google-calendar-reminder-preferences"), 'supabase fallback missing reminder preference import');
assert(fallback.includes('applyGoogleCalendarReminderPreferenceToEventPayload(input as unknown as Record<string, unknown>)'), 'insertEventToSupabase must apply Google reminder preference');
assert(fallback.includes('applyGoogleCalendarReminderPreferenceToEventPayload(input)'), 'updateEventInSupabase must apply Google reminder preference');

const workItems = read('api/work-items.ts');
for (const marker of [
  'function googleReminderMethodFrom',
  'function googleReminderMinutesFrom',
  'googleReminderMethod: googleReminderMethodFrom(row, body) || null',
  'googleReminderMinutesBefore: googleReminderMinutesFrom(row, body)',
]) {
  assert(workItems.includes(marker), 'api/work-items.ts missing existing Stage 05 backend marker: ' + marker);
}

const sync = read('src/server/google-calendar-sync.ts');
for (const marker of [
  'GOOGLE_CALENDAR_SYNC_V1_STAGE05_REMINDER_METHOD_BACKEND',
  'normalizeGoogleReminderMethod',
  "{ method: 'email', minutes }",
  "{ method: 'popup', minutes }",
]) {
  assert(sync.includes(marker), 'google-calendar-sync.ts missing backend reminder marker: ' + marker);
}

const options = read('src/lib/options.ts');
assert(options.includes('GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS'), 'options.ts missing Google Calendar reminder method options');

assert(!exists('api/google-calendar.ts'), 'must not recreate standalone api/google-calendar.ts');

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage06-reminder-method-ui']), 'package.json missing Stage 06 reminder UI guard script');

if (problems.length) {
  console.error('Google Calendar Stage 06 reminder method UI guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 06 reminder method UI');
