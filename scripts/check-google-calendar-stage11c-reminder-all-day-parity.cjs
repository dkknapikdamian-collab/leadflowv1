const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const sync = read('src/server/google-calendar-sync.ts');
const inbound = read('src/server/google-calendar-inbound.ts');
const workItems = read('api/work-items.ts');
const migration = read('supabase/migrations/20260503_google_calendar_stage11c_reminder_all_day_parity.sql');
const pkg = JSON.parse(read('package.json'));
assert(sync.includes('GOOGLE_CALENDAR_STAGE11C_EXACT_REMINDER_OUTBOUND'), 'Exact outbound reminder marker missing');
assert(sync.includes('GOOGLE_CALENDAR_STAGE11C_ALL_DAY_OUTBOUND'), 'All-day outbound marker missing');
assert(sync.includes('googleRemindersOverrides'), 'CloseFlow event reminder overrides type missing');
assert(inbound.includes('GOOGLE_CALENDAR_STAGE11C_INBOUND_REMINDER_ALL_DAY_HELPERS'), 'Inbound helper marker missing');
assert(inbound.includes('google_reminders_overrides'), 'Inbound reminder overrides write missing');
assert(inbound.includes('google_all_day'), 'Inbound all-day write missing');
assert(workItems.includes('GOOGLE_CALENDAR_STAGE11C_WORK_ITEM_REMINDER_ALL_DAY_HELPERS'), 'Work-items reminder/all-day helpers missing');
assert(workItems.includes('googleRemindersUseDefault'), 'Work-items exact reminder mapping missing');
assert(migration.includes('google_reminders_overrides jsonb'), 'Migration reminder overrides column missing');
assert(migration.includes('google_all_day boolean'), 'Migration all-day column missing');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage11c-reminder-all-day-parity']), 'package script missing');
if (problems.length) {
  console.error('Stage11C reminder/all-day parity guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11C reminder/all-day parity');
