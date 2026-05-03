const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }

const sync = read('src/server/google-calendar-sync.ts');
assert(sync.includes('GOOGLE_CALENDAR_STAGE09E_SAFE_SOURCE_URL'), 'safe source URL marker missing');
assert(sync.includes('function normalizeGoogleCalendarSourceUrl'), 'source URL normalizer missing');
assert(sync.includes("env('VERCEL_URL')"), 'VERCEL_URL fallback missing');
assert(sync.includes('if (sourceUrl) body.source ='), 'Google source must be conditional');
assert(!sync.includes("url: event.sourceUrl || env('APP_URL') || env('RELEASE_PREVIEW_URL') || ''"), 'unsafe empty source.url expression still present');
assert(sync.includes('GOOGLE_CALENDAR_STAGE09B_FULL_BODY_PARITY'), 'Stage09B body parity marker must remain');
assert(sync.includes('normalizeGoogleCalendarRecurrence'), 'recurrence mapper must remain');
assert(sync.includes('recurrenceEndType?: string | null;'), 'CloseFlowCalendarEvent recurrenceEndType type missing');
const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage09e-safe-source-url']), 'package script missing');
if (problems.length) {
  console.error('Stage09E safe source URL guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage09E safe source URL');
