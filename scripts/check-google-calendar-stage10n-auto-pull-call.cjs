const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
const calendarItems = read('src/lib/calendar-items.ts');
const problems = [];
function assert(ok,msg){ if(!ok) problems.push(msg); }
assert(calendarItems.includes('GOOGLE_CALENDAR_STAGE10K_AUTO_PULL_BEFORE_BUNDLE'), 'Stage10K auto pull helper marker missing');
assert(calendarItems.includes('syncGoogleCalendarInboundInSupabase'), 'Inbound client helper import/call missing');
assert(/await\s+maybePullGoogleCalendarInboundBeforeBundle\s*\(\s*\)\s*;/.test(calendarItems), 'Auto pull helper is defined but not called');
assert(calendarItems.indexOf('await maybePullGoogleCalendarInboundBeforeBundle') > calendarItems.indexOf('await ensureWorkspaceContext'), 'Auto pull should run after workspace context is ready');
assert(calendarItems.indexOf('await maybePullGoogleCalendarInboundBeforeBundle') < calendarItems.indexOf('const [taskItems'), 'Auto pull should run before reading calendar bundle');
if (problems.length) {
  console.error('Stage10N auto pull call guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage10N auto pull call');
