const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\\uFEFF/, ''); }
function assert(ok,msg){ if(!ok) problems.push(msg); }

const settings = read('src/pages/Settings.tsx');
const pkg = JSON.parse(read('package.json'));

assert(!/import\\s*\\{[^}]*syncGoogleCalendarOutboundInSupabase[^}]*\\}\\s*from\\s*['"]react['"]\\s*;/.test(settings), 'Settings imports syncGoogleCalendarOutboundInSupabase from React');
assert(!settings.includes('const data = await syncGoogleCalendarOutboundInSupabase('), 'Settings still calls helper through lazy shared module');
assert(settings.includes("fetch('/api/google-calendar?route=sync-outbound'"), 'Settings does not call sync-outbound endpoint directly');
assert(settings.includes("'x-workspace-id': workspace.id"), 'Settings direct sync is missing workspace header');
assert(settings.includes("'x-user-id': activeUserId"), 'Settings direct sync is missing user header');
assert(settings.includes('Synchronizuj teraz z Google Calendar'), 'Settings sync button copy missing');
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage12b-runtime-import-hotfix']), 'package Stage12B script missing');

if (problems.length) {
  console.error('Google Calendar Stage12B runtime import hotfix guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('PASS Google Calendar Stage12B runtime import hotfix');
