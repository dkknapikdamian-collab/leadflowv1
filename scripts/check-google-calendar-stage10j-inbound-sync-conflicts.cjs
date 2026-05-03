const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const inboundPath = path.join(root, 'src/server/google-calendar-inbound.ts');
assert(fs.existsSync(inboundPath), 'google-calendar-inbound.ts missing');
const inbound = fs.existsSync(inboundPath) ? read('src/server/google-calendar-inbound.ts') : '';
const handler = read('src/server/google-calendar-handler.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const items = read('src/lib/calendar-items.ts');
const pkg = JSON.parse(read('package.json'));
assert(inbound.includes('GOOGLE_CALENDAR_STAGE10J_INBOUND_BACKEND'), 'inbound backend marker missing');
assert(inbound.includes('GOOGLE_CALENDAR_STAGE10J_UPDATED_MIN_CURSOR'), 'updatedMin cursor marker missing');
assert(inbound.includes("params.set('updatedMin'"), 'Google updatedMin support missing');
assert(inbound.includes("source_provider: 'google_calendar'"), 'inbound source provider write missing');
assert(inbound.includes('source_external_id'), 'inbound source external id missing');
assert(inbound.includes('inbound_conflict_detected'), 'inbound conflict fields missing');
assert(inbound.includes("deleteById('work_items'"), 'inbound delete propagation missing');
assert(handler.includes('syncGoogleCalendarInbound'), 'handler does not import inbound sync');
assert(handler.includes("action === 'sync-inbound'"), 'sync-inbound route missing');
assert(fallback.includes('syncGoogleCalendarInboundToSupabase'), 'client API inbound sync helper missing');
assert(items.includes('GOOGLE_CALENDAR_STAGE10J_AUTO_PULL_BEFORE_CALENDAR_READ'), 'calendar auto pull marker missing');
assert(items.includes('syncGoogleCalendarInboundToSupabase'), 'calendar bundle does not call inbound sync');
assert(items.includes('Konflikt z Google Calendar'), 'conflict toast/copy missing');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage10j-inbound-sync-conflicts']), 'package script missing');
if (problems.length) { console.error('Stage10J inbound sync conflict guard failed:'); for (const problem of problems) console.error('- ' + problem); process.exit(1); }
console.log('PASS Google Calendar Stage10J inbound sync conflicts');
