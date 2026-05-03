const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const sync = read('src/server/google-calendar-sync.ts');
const inbound = read('src/server/google-calendar-inbound.ts');
const handler = read('src/server/google-calendar-handler.ts');
const client = read('src/lib/supabase-fallback.ts');
const calendarItems = read('src/lib/calendar-items.ts');
const migration = read('supabase/migrations/20260503_google_calendar_stage10k_inbound_source_columns.sql');
const pkg = JSON.parse(read('package.json'));
assert(sync.includes('GOOGLE_CALENDAR_STAGE10K_INBOUND_LIST_EVENTS'), 'Google inbound list events helper missing');
assert(sync.includes('updatedMin'), 'Google updatedMin cursor support missing');
assert(sync.includes('showDeleted'), 'Google deleted event read support missing');
assert(inbound.includes('GOOGLE_CALENDAR_STAGE10K_INBOUND_SYNC_BACKEND'), 'Inbound sync backend marker missing');
assert(inbound.includes('source_provider'), 'Inbound source provider write missing');
assert(inbound.includes('source_external_id'), 'Inbound source external id missing');
assert(inbound.includes('inbound_conflict_message'), 'Inbound conflict message write missing');
assert(inbound.includes('deleteById'), 'Inbound delete propagation missing');
assert(handler.includes('sync-inbound'), 'Google Calendar sync-inbound route missing');
assert(client.includes('syncGoogleCalendarInboundInSupabase'), 'Client API inbound sync helper missing');
assert(calendarItems.includes('GOOGLE_CALENDAR_STAGE10K_AUTO_PULL_BEFORE_BUNDLE'), 'Calendar auto pull marker missing');
assert(calendarItems.includes('Konflikt z Google Calendar'), 'Conflict toast/copy missing');
assert(migration.includes('source_provider') && migration.includes('inbound_conflict_count'), 'Stage10K migration incomplete');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage10k-inbound-sync-global']), 'package script missing');
if (problems.length) {
  console.error('Stage10K inbound sync global guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage10K inbound sync global');
