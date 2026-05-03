const fs = require('fs');
const path = require('path');
const root = process.cwd();
const problems = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, ''); }
function assert(ok, msg) { if (!ok) problems.push(msg); }
const global = read('src/components/GlobalQuickActions.tsx');
assert(global.includes('subscribeGlobalQuickAction'), 'GlobalQuickActions missing event bus subscription export');
assert(global.includes('to="/leads?quick=lead"'), 'Global lead action must open quick lead route');
assert(global.includes('to="/tasks?quick=task"'), 'Global task action must open quick task route');
assert(global.includes('to="/calendar?quick=event"'), 'Global event action must open quick event route');
const calendar = read('src/pages/Calendar.tsx');
assert(calendar.includes('subscribeGlobalQuickAction'), 'Calendar must subscribe to same-route global actions');
assert(calendar.includes('GLOBAL_QUICK_ACTIONS_STAGE08D_CALENDAR_QUERY_FIX'), 'Calendar missing query quick action fix');
assert(!calendar.includes('if (!auth.currentUser || workspaceLoading || !workspace?.id)'), 'Calendar must not block data load on Firebase auth.currentUser');
const tasks = read('src/pages/Tasks.tsx');
assert(tasks.includes('subscribeGlobalQuickAction'), 'Tasks must subscribe to same-route global actions');
assert(!tasks.includes('if (!auth.currentUser || workspaceLoading || !workspace?.id)'), 'Tasks must not block data load on Firebase auth.currentUser');
const leads = read('src/pages/Leads.tsx');
assert(leads.includes('subscribeGlobalQuickAction'), 'Leads must subscribe to same-route global actions');
const sync = read('src/server/google-calendar-sync.ts');
assert(sync.includes('GOOGLE_CALENDAR_STAGE08D_WORKSPACE_CONNECTION_FALLBACK'), 'Google Calendar connection fallback missing');
const workItems = read('api/work-items.ts');
assert(workItems.includes('GOOGLE_CALENDAR_STAGE08D_TASK_CREATE_SYNC'), 'Task create Google sync missing');
assert(workItems.includes('GOOGLE_CALENDAR_STAGE08D_TASK_EVENT_UPDATE_SYNC'), 'Task/event update Google sync missing');
assert(workItems.includes('GOOGLE_CALENDAR_STAGE08D_TASK_EVENT_DELETE_SYNC'), 'Task/event delete Google sync missing');
const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:google-calendar-stage08d-runtime-ui-sync']), 'package.json missing stage08d check');
if (problems.length) {
  console.error('Google Calendar Stage 08D runtime UI sync guard failed:');
  for (const p of problems) console.error('- ' + p);
  process.exit(1);
}
console.log('PASS Google Calendar Stage 08D runtime UI sync');
