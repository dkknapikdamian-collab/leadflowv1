const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readClean(rel){ return read(rel).replace(/^\uFEFF/, ''); }
const problems = [];
function assert(ok,msg){ if(!ok) problems.push(msg); }
const pkgRaw = read('package.json');
assert(pkgRaw.charCodeAt(0) !== 0xFEFF, 'package.json still has UTF-8 BOM');
try { JSON.parse(pkgRaw); } catch (error) { problems.push('package.json is not valid JSON without BOM stripping: ' + error.message); }
const sync = readClean('src/server/google-calendar-sync.ts');
for (const name of ['normalizeExactGoogleReminderOverrides','normalizeGoogleDateOnly','addOneGoogleDateOnly','buildGoogleTimeFields']) {
  const count = (sync.match(new RegExp('function\\s+' + name + '\\s*\\(', 'g')) || []).length;
  assert(count <= 1, name + ' duplicate implementation count=' + count);
}
assert(sync.includes('normalizeExactGoogleReminderOverrides'), 'Stage11 exact reminder helper missing');
assert(sync.includes('buildGoogleTimeFields'), 'Stage11 all-day time helper missing');
const inbound = readClean('src/server/google-calendar-inbound.ts');
const workItems = readClean('api/work-items.ts');
assert(inbound.includes('google_reminders_overrides') || workItems.includes('google_reminders_overrides') || sync.includes('google_reminders_overrides'), 'google_reminders_overrides support missing');
assert(inbound.includes('google_all_day') || workItems.includes('google_all_day') || sync.includes('google_all_day'), 'google_all_day support missing');
if (problems.length) {
  console.error('Stage11F BOM/duplicate helper guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11F BOM and duplicate helper repair');

