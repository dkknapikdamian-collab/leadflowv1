const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }
const guard = read('scripts/check-google-calendar-stage11c-reminder-all-day-parity.cjs');
const pkg = JSON.parse(read('package.json'));
assert(guard.includes('Stage11C/11H reminder/all-day parity compatibility'), 'Stage11C guard was not updated for Stage11H compatibility');
assert(guard.includes('GOOGLE_CALENDAR_STAGE11H') || guard.includes('normalizeExactGoogleReminderOverrides'), 'Stage11C guard still depends only on old Stage11C markers');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage11i-guard-compat']), 'package Stage11I script missing');
if (problems.length) {
  console.error('Stage11I guard compatibility repair failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11I guard compatibility repair');
