const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const sync = read('src/server/google-calendar-sync.ts');
assert(sync.includes('GOOGLE_CALENDAR_STAGE10D_INBOUND_LIST_EVENTS'), 'Google inbound list events helper missing');
assert(sync.includes('updatedMin'), 'Google updatedMin cursor support missing');
const handler = read('src/server/google-calendar-handler.ts');
assert(handler.includes('GOOGLE_CALENDAR_STAGE10D_INBOUND_SYNC_BACKEND'), 'Inbound sync backend marker missing');
assert(handler.includes("action === 'sync-inbound'"), 'Inbound sync route missing');
assert(handler.includes("deleteById('work_items'"), 'Inbound delete propagation missing');
assert(handler.includes("source_provider: 'google_calendar'"), 'Inbound source provider write missing');
assert(handler.includes('source_external_id'), 'Inbound source external id missing');
assert(handler.includes('findInboundGoogleConflicts'), 'Inbound conflict scanner missing');
const client = read('src/lib/supabase-fallback.ts');
assert(client.includes('GOOGLE_CALENDAR_STAGE10D_CLIENT_INBOUND_SYNC_HELPER'), 'Client API inbound sync helper missing');
const calendar = read('src/pages/Calendar.tsx');
assert(calendar.includes('GOOGLE_CALENDAR_STAGE10D_CALENDAR_AUTO_PULL_SYNC'), 'Calendar auto pull marker missing');
assert(calendar.includes('syncGoogleCalendarInboundFromSupabase'), 'Calendar does not call inbound sync');
assert(calendar.includes('Konflikt terminu z Google Calendar'), 'Conflict toast/copy missing');
const migration = read('supabase/migrations/20260503_google_calendar_stage10d_inbound_source_columns.sql');
assert(migration.includes('GOOGLE_CALENDAR_STAGE10D_INBOUND_SOURCE_COLUMNS'), 'Inbound source columns migration missing');
const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage10d-inbound-sync-conflicts']), 'package script missing');
if (problems.length) {
  console.error('Stage10D inbound sync conflict guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage10D inbound sync conflicts');
