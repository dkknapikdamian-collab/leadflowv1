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

const sync = read('src/server/google-calendar-sync.ts');
for (const marker of [
  'GOOGLE_CALENDAR_SYNC_V1_STAGE05_REMINDER_METHOD_BACKEND',
  "type GoogleReminderMethod = 'default' | 'popup' | 'email' | 'popup_email'",
  'googleReminderMethod?: GoogleReminderMethod',
  'googleReminderMinutesBefore?: number',
  'normalizeGoogleReminderMethod',
  'clampGoogleReminderMinutes',
  'minutesFromReminderAt',
  "{ method: 'email', minutes }",
  "{ method: 'popup', minutes }",
  'useDefault: true',
]) {
  assert(sync.includes(marker), 'google-calendar-sync.ts missing marker: ' + marker);
}

const workItems = read('api/work-items.ts');
for (const marker of [
  'function googleReminderMethodFrom',
  'function googleReminderMinutesFrom',
  'body?.googleCalendarReminderMethod',
  'body?.reminder?.googleCalendarMethod',
  'body?.reminder?.googleMethod',
  'googleReminderMethod: googleReminderMethodFrom(row, body) || null',
  'googleReminderMinutesBefore: googleReminderMinutesFrom(row, body)',
]) {
  assert(workItems.includes(marker), 'api/work-items.ts missing marker: ' + marker);
}

const options = read('src/lib/options.ts');
for (const marker of [
  'GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS',
  'default',
  'popup',
  'email',
  'popup_email',
]) {
  assert(options.includes(marker), 'options.ts missing marker: ' + marker);
}

assert(!exists('api/google-calendar.ts'), 'must not recreate standalone api/google-calendar.ts');
const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage05-reminder-method-backend']), 'package.json missing Stage 05 reminder guard script');

if (problems.length) {
  console.error('Google Calendar Stage 05 reminder method backend guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Google Calendar Stage 05 reminder method backend');
