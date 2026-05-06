const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('outbound sync creates or updates by googleCalendarEventId without duplicates', () => {
  const outbound = read('src/server/google-calendar-outbound.ts');
  assert.match(outbound, /googleEventIdFrom/);
  assert.match(outbound, /existingGoogleEventId\s*\?/);
  assert.match(outbound, /updateGoogleCalendarEvent/);
  assert.match(outbound, /createGoogleCalendarEvent/);
  assert.match(outbound, /google_calendar_event_id/);
});

test('inbound sync finds existing work items before inserting', () => {
  const inbound = read('src/server/google-calendar-inbound.ts');
  assert.match(inbound, /findExistingWorkItem/);
  assert.match(inbound, /google_calendar_event_id=eq/);
  assert.match(inbound, /source_external_id=eq/);
  assert.match(inbound, /safePatchWorkItem/);
  assert.match(inbound, /safeInsertWorkItem/);
});

test('Google reminders preserve exact overrides and CloseFlow reminderAt parity', () => {
  const sync = read('src/server/google-calendar-sync.ts');
  const outbound = read('src/server/google-calendar-outbound.ts');
  const inbound = read('src/server/google-calendar-inbound.ts');
  assert.match(sync, /buildReminderOverrides/);
  assert.match(sync, /minutesFromReminderAt/);
  assert.match(sync, /googleCalendarReminders/);
  assert.match(sync, /googleRemindersUseDefault/);
  assert.match(sync, /googleRemindersOverrides/);
  assert.match(outbound, /google_calendar_reminders/);
  assert.match(inbound, /normalizeGoogleReminderOverridesFromEvent/);
  assert.match(inbound, /googleReminderAtForLegacyField/);
});
