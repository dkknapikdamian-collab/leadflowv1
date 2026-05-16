const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
function readAllMigrations(){
  const dir = path.join(root, 'supabase', 'migrations');
  if (!fs.existsSync(dir)) return '';
  return fs.readdirSync(dir)
    .filter((name) => /google_calendar.*stage11/i.test(name) && name.endsWith('.sql'))
    .map((name) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/^\uFEFF/, ''))
    .join('\n');
}
const sync = read('src/server/google-calendar-sync.ts');
const inbound = read('src/server/google-calendar-inbound.ts');
const workItems = read('api/work-items.ts');
const migration = readAllMigrations();
const pkg = JSON.parse(read('package.json'));
const hasExactOutboundReminder =
  sync.includes('GOOGLE_CALENDAR_STAGE11C_EXACT_REMINDER_OUTBOUND') ||
  sync.includes('GOOGLE_CALENDAR_STAGE11H_CODE_PARITY') ||
  sync.includes('GOOGLE_CALENDAR_STAGE11H_EXACT_REMINDER_OUTBOUND') ||
  sync.includes('normalizeExactGoogleReminderOverrides') ||
  sync.includes('googleRemindersOverrides') ||
  sync.includes('google_reminders_overrides');
const hasAllDayOutbound =
  sync.includes('GOOGLE_CALENDAR_STAGE11C_ALL_DAY_OUTBOUND') ||
  sync.includes('GOOGLE_CALENDAR_STAGE11H_ALL_DAY_OUTBOUND') ||
  sync.includes('buildGoogleTimeFields') ||
  sync.includes('googleAllDay') ||
  sync.includes('google_all_day');
assert(hasExactOutboundReminder, 'Exact outbound reminder support missing');
assert(hasAllDayOutbound, 'All-day outbound support missing');
assert(inbound.includes('GOOGLE_CALENDAR_STAGE11C_INBOUND_REMINDER_ALL_DAY_HELPERS'), 'Inbound helper marker missing');
assert(inbound.includes('google_reminders_overrides'), 'Inbound reminder overrides write missing');
assert(inbound.includes('google_all_day'), 'Inbound all-day write missing');
assert(workItems.includes('GOOGLE_CALENDAR_STAGE11C_WORK_ITEM_REMINDER_ALL_DAY_HELPERS') || workItems.includes('googleRemindersUseDefault'), 'Work-items reminder/all-day helpers missing');
assert(workItems.includes('googleRemindersUseDefault') || workItems.includes('google_reminders_use_default'), 'Work-items exact reminder mapping missing');
assert(migration.includes('google_reminders_overrides jsonb'), 'Migration reminder overrides column missing');
assert(migration.includes('google_all_day boolean'), 'Migration all-day column missing');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage11c-reminder-all-day-parity']), 'package Stage11C script missing');
if (exists('scripts/check-google-calendar-stage11h-code-parity.cjs')) {
  assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage11h-code-parity']), 'package Stage11H script missing');
}
if (problems.length) {
  console.error('Stage11C/11H reminder/all-day parity compatibility guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11C/11H reminder/all-day parity compatibility');
