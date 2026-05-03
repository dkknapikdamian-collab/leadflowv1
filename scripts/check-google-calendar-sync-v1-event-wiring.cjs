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
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-sync-v1-event-wiring']), 'missing package script check:google-calendar-sync-v1-event-wiring');

const workItems = read('api/work-items.ts');
for (const marker of [
  'GOOGLE_CALENDAR_SYNC_V1_STAGE02_EVENT_WIRING',
  'getGoogleCalendarConnection',
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
  "syncGoogleCalendarEventAfterMutation({ action: 'create'",
  "syncGoogleCalendarEventAfterMutation({ action: 'update'",
  "syncGoogleCalendarEventAfterMutation({ action: 'delete'",
  'GOOGLE_CALENDAR_SYNC_FAILED_NON_BLOCKING',
  'google_calendar_sync_status',
  'google_calendar_event_id',
]) {
  assert(workItems.includes(marker), 'api/work-items.ts missing marker: ' + marker);
}

assert(
  !workItems.includes("throw new Error('GOOGLE_CALENDAR_SYNC_FAILED")
    && !workItems.includes('throw new Error("GOOGLE_CALENDAR_SYNC_FAILED')
    && !workItems.includes('throw new Error(`GOOGLE_CALENDAR_SYNC_FAILED'),
  'Google sync must not hard-fail CloseFlow event writes'
);

const server = read('src/server/google-calendar-sync.ts');
for (const marker of [
  'createGoogleCalendarEvent',
  'updateGoogleCalendarEvent',
  'deleteGoogleCalendarEvent',
  'reminders',
  "method: 'popup'",
]) {
  assert(server.includes(marker), 'google-calendar-sync helper missing marker: ' + marker);
}

assert(exists('docs/release/GOOGLE_CALENDAR_SYNC_V1_STAGE02_EVENT_SYNC_WIRING_2026-05-03.md'), 'missing Stage 02 release doc');

const truth = read('src/lib/product-truth.ts');
const googleIndex = truth.indexOf("key: 'google_calendar'");
const googleSlice = googleIndex >= 0 ? truth.slice(googleIndex, googleIndex + 700) : '';
assert(googleSlice.includes("status: 'coming_soon'"), 'Stage 02 backend wiring must not claim Google Calendar as active yet');

if (problems.length) {
  console.error('Google Calendar Sync V1 Stage 02 event wiring guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Sync V1 Stage 02 event wiring');
