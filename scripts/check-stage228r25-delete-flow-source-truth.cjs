const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(ok, msg) {
  if (!ok) {
    console.error('STAGE228R25_DELETE_FLOW_FIX_AND_PUSH_COMPAT_R41_FAIL: ' + msg);
    process.exit(1);
  }
}

const calendar = read('src/pages/Calendar.tsx');
const bundle = read('src/lib/calendar-items.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const taskRoute = read('src/server/task-route-stage124f.ts');
const eventRoute = read('src/server/event-route-stage124f.ts');

assert(bundle.includes('filterActiveCalendarTaskRows'), 'calendar bundle must use task active-row filter');
assert(bundle.includes('filterActiveCalendarEventRows'), 'calendar bundle must use event active-row filter');
assert(bundle.includes('deleted') && bundle.includes('archived') && bundle.includes('removed'), 'calendar bundle must hide deleted/archived/removed rows');
assert(bundle.includes('show_in_calendar') && bundle.includes('showInCalendar'), 'calendar bundle must respect show_in_calendar/showInCalendar');
assert(bundle.includes('show_in_tasks') && bundle.includes('showInTasks'), 'calendar bundle must respect show_in_tasks/showInTasks for task rows');

assert(calendar.includes('removeDeletedCalendarEntryFromLocalState'), 'Calendar must locally prune deleted entries');
assert(calendar.includes("entry.kind === 'event'") || calendar.includes('entry.kind === "event"'), 'Calendar delete must explicitly handle event entries');
assert(calendar.includes("entry.kind === 'task'") || calendar.includes('entry.kind === "task"'), 'Calendar delete must explicitly handle task entries');
assert(calendar.includes('toast.error('), 'Calendar must show an error for unsupported delete entry kinds');
assert(calendar.includes('return;'), 'Calendar unsupported delete branch must return before success handling');
assert(calendar.includes('toast.success('), 'Calendar must still show success after supported delete flow');

assert(fallback.includes('CLOSEFLOW_DELETE_DEBUG') || fallback.includes('VITE_CLOSEFLOW_DEBUG_DELETE'), 'delete debug flag must exist');
assert(fallback.includes('/api/system?apiRoute=tasks&id=') && fallback.includes("method: 'DELETE'"), 'hardDeleteTaskFromSupabase must use DELETE RequestInit against apiRoute tasks');
assert(!/callApi\s*\([^)]*,\s*['"]DELETE['"]\s*\)/.test(fallback), 'callApi must not receive raw string DELETE as init');

assert(taskRoute.includes('status') && taskRoute.includes('deleted') && taskRoute.includes('show_in_tasks') && taskRoute.includes('show_in_calendar'), 'task route must keep stable soft-delete/hide contract');
assert(eventRoute.includes('status') && eventRoute.includes('deleted') && eventRoute.includes('show_in_calendar'), 'event route must keep stable soft-delete/hide contract');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R25_DELETE_FLOW_FIX_AND_PUSH_COMPAT_R41',
  contract: 'delete flow source truth, calendar local prune, unsupported kind guard and hidden-row bundle filters'
}, null, 2));