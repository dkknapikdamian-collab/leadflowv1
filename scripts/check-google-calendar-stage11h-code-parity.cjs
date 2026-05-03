const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
const sync = read('src/server/google-calendar-sync.ts');
const inbound = read('src/server/google-calendar-inbound.ts');
const workItems = read('api/work-items.ts');
const problems = [];
function assert(ok,msg){ if(!ok) problems.push(msg); }
function countFn(src,name){ return (src.match(new RegExp('function\\s+' + name + '\\s*\\(', 'g')) || []).length; }
for (const name of ['buildReminderOverrides','normalizeExactGoogleReminderOverrides','normalizeGoogleDateOnly','addOneGoogleDateOnly','buildGoogleTimeFields']) {
  assert(countFn(sync, name) === 1, 'Expected exactly one function ' + name);
}
assert(sync.includes('GOOGLE_CALENDAR_STAGE11H_EXACT_REMINDER_AND_ALL_DAY_SYNC'), 'Stage11H sync helper marker missing');
assert(sync.includes('GOOGLE_CALENDAR_STAGE11H_EXACT_REMINDER_AND_ALL_DAY_BODY'), 'Stage11H Google body marker missing');
assert(sync.includes('googleCalendarReminders?:'), 'CloseFlowCalendarEvent exact reminder type missing');
assert(sync.includes('googleAllDay?:'), 'CloseFlowCalendarEvent all-day type missing');
assert(/...timeFields/.test(sync), 'Google body does not use shared time fields');
assert(workItems.includes('googleCalendarReminders'), 'work-items does not pass exact Google reminder payload');
assert(workItems.includes('googleAllDay'), 'work-items does not pass all-day fields');
assert(inbound.includes('google_calendar_reminders'), 'inbound does not persist Google reminder payload');
assert(inbound.includes('google_reminders_overrides'), 'inbound does not persist Google reminder overrides');
assert(inbound.includes('google_all_day'), 'inbound does not persist Google all-day flag');
if (problems.length) {
  console.error('Stage11H code parity guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11H code parity');
