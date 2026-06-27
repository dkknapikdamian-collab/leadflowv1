const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE = 'STAGE232T_R3_OPERATIONAL_ENTRY_STATE_MACHINE';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

let failures = 0;
function fail(label) {
  failures += 1;
  console.error('FAIL ' + STAGE + ': ' + label);
}
function pass(label) {
  console.log('PASS ' + label);
}
function contains(src, needle, label) {
  if (src.includes(needle)) pass(label);
  else fail('missing ' + label + ' [' + needle + ']');
}
function matches(src, pattern, label) {
  if (pattern.test(src)) pass(label);
  else fail('missing ' + label + ' [' + pattern + ']');
}
function notContains(src, needle, label) {
  if (!src.includes(needle)) pass(label);
  else fail('forbidden ' + label + ' [' + needle + ']');
}

const taskRoute = read('src/server/task-route-stage124f.ts');
const eventRoute = read('src/server/event-route-stage124f.ts');
const calendar = read('src/pages/Calendar.tsx');
const vercel = read('vercel.json');

contains(taskRoute, 'CALENDAR_RESTORED_TASK_STATUSES_STAGE232T_R3', 'task restore status contract marker');
contains(taskRoute, 'payload.show_in_calendar = true;', 'task restore sets show_in_calendar true');
contains(taskRoute, 'payload.show_in_tasks = true;', 'task restore sets show_in_tasks true');
matches(taskRoute, /shouldRestoreTaskVisibilityStage232T_R3[\s\S]{0,220}payload\.show_in_calendar = true;[\s\S]{0,80}payload\.show_in_tasks = true;[\s\S]{0,220}shouldHideTaskFromCalendarStage229A/, 'task restore visibility is applied before closed-status hide');
contains(taskRoute, 'preserveTaskDatePatchTimeStage232T_R3', 'task date-only patch preserves previous time helper');
contains(taskRoute, 'currentRow?.scheduled_at', 'task date-only helper reads existing scheduled_at');
contains(taskRoute, 'if (body.dueAt !== undefined) payload.scheduled_at', 'task PATCH accepts canonical dueAt');
matches(taskRoute, /if \(body\.date !== undefined\) payload\.scheduled_at = preserveTaskDatePatchTimeStage232T_R3\(body\.date, existingTaskRowStage232T_R3\);/, 'task date-only PATCH does not hard reset to 09:00');

contains(eventRoute, 'CALENDAR_RESTORED_EVENT_STATUSES_STAGE232T_R3', 'event restore status contract marker');
contains(eventRoute, 'payload.show_in_calendar = true;', 'event restore sets show_in_calendar true');
matches(eventRoute, /shouldRestoreEventVisibilityStage232T_R3[\s\S]{0,160}payload\.show_in_calendar = true;[\s\S]{0,220}shouldHideEventFromCalendarStage229A/, 'event restore visibility is applied before closed-status hide');

contains(calendar, 'calendarOperationalMutationPendingRef', 'Calendar has immediate operational mutation lock');
contains(calendar, 'getLatestCalendarEntrySnapshotStage232T_R3', 'Calendar resolves latest local row before shift');
contains(calendar, "const actionEntry = getLatestCalendarEntrySnapshotStage232T_R3(entry);", 'Calendar shift uses latest snapshot');
contains(calendar, "entry.kind + ':' + sourceId + ':shift-hours'", 'Calendar +1H lock key exists');
contains(calendar, "entry.kind + ':' + sourceId + ':shift-days'", 'Calendar +1D/+1W lock key exists');
contains(calendar, 'STAGE232T_R3_CALENDAR_SHIFT_HOURS_ACTION_CONTRACT_GUARD', 'Calendar +1H respects action policy');
contains(calendar, 'releaseCalendarOperationalMutationStage232T_R3(mutationKey);', 'Calendar releases operation lock after refresh');
contains(calendar, 'scheduledAt: taskStartAt', 'Calendar restore task sends canonical scheduledAt');
contains(calendar, 'dueAt: taskStartAt', 'Calendar restore task sends canonical dueAt');
contains(calendar, '...(wasCompleted ? { showInCalendar: true, showInTasks: true } : { showInCalendar: false })', 'Calendar task restore sends showInTasks intent without hiding tasks on complete');
contains(calendar, 'releaseCalendarCompletedEntryStage232GR1I(entry);', 'Calendar restore releases completed retention');
contains(calendar, 'releaseCalendarCompletedRetentionByKindAndIdStage232GR1I', 'Calendar delete releases completed retention');
contains(calendar, '!existingKeys.has(getCalendarRetentionKeyStage232GR1I(kind, value.row))', 'Calendar retention dedupes by kind/source id');

notContains(calendar, 'display: none', 'Calendar does not hide bug with display none');
notContains(calendar, 'STAGE232T_R3_LOCALSTORAGE_TOMBSTONE_FIX', 'Calendar does not use localStorage tombstone final fix');
contains(vercel, '"source": "/api/tasks"', 'vercel keeps /api/tasks rewrite');
contains(vercel, '"destination": "/api/system?apiRoute=tasks"', 'vercel routes tasks through api/system apiRoute');
contains(vercel, '"source": "/api/events"', 'vercel keeps /api/events rewrite');
contains(vercel, '"destination": "/api/system?apiRoute=events"', 'vercel routes events through api/system apiRoute');

if (failures) {
  console.error('\n' + STAGE + ' guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS ' + STAGE);
