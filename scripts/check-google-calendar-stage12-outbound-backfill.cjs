const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }

const outbound = read('src/server/google-calendar-outbound.ts');
const handler = read('src/server/google-calendar-handler.ts');
const supabaseFallback = read('src/lib/supabase-fallback.ts');
const settings = read('src/pages/Settings.tsx');
const pkg = JSON.parse(read('package.json'));

assert(outbound.includes('GOOGLE_CALENDAR_STAGE12_OUTBOUND_BACKFILL'), 'Outbound backfill marker missing');
assert(outbound.includes('syncGoogleCalendarOutbound'), 'syncGoogleCalendarOutbound export missing');
assert(handler.includes('google-calendar-outbound'), 'google-calendar-handler does not import outbound sync');
assert(handler.includes('GOOGLE_CALENDAR_STAGE12_SYNC_OUTBOUND_ROUTE'), 'sync-outbound route marker missing');
assert(handler.includes("action === 'sync-outbound'"), 'sync-outbound action missing');
assert(supabaseFallback.includes('syncGoogleCalendarOutboundInSupabase'), 'client helper missing');
assert(settings.includes('data-google-calendar-stage12="outbound-backfill"'), 'Settings Stage12 UI marker missing');
assert(settings.includes('Synchronizuj teraz z Google Calendar'), 'Settings sync button copy missing');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage12-outbound-backfill']), 'package Stage12 script missing');

if (problems.length) {
  console.error('Google Calendar Stage12 outbound backfill guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage12 outbound backfill');
