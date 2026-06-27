const fs = require('fs');
const { execSync } = require('child_process');

const STAGE = 'STAGE232T_R1D';

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

let failures = 0;
function pass(label) {
  console.log('PASS ' + label);
}
function fail(label) {
  failures += 1;
  console.error('FAIL ' + STAGE + ': ' + label);
}
function contains(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail('missing ' + label + ' [' + needle + ']');
}
function notContains(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail('forbidden ' + label + ' [' + needle + ']');
}

function changedFiles() {
  try {
    return execSync('git diff --name-only HEAD', { encoding: 'utf8' })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const today = read('src/pages/TodayStable.tsx');
const card = read('src/components/work-item-card.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const calendar = read('src/pages/Calendar.tsx');
const changed = changedFiles();

contains(today, 'STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH', 'Today stage marker');
contains(card, 'STAGE232T_R1D_WORK_ITEM_ACTION_EVENT_BOUNDARY', 'WorkItemCard stage marker');
contains(tasks, 'STAGE232T_R1D_TASKS_EDIT_QUERY_CONTRACT', 'Tasks edit query marker');
contains(calendar, 'STAGE232T_R1D_CALENDAR_EDIT_QUERY_CONTRACT', 'Calendar edit query marker');

contains(card, 'data-stage227g1-today-reschedule-action="true"', 'shift action marker');
contains(card, 'event.preventDefault();', 'actions prevent default');
contains(card, 'event.stopPropagation();', 'actions stop propagation');
contains(card, 'data-stage116-work-item-done-action="true"', 'done action marker');
contains(card, 'data-stage232t-r1d-work-item-edit-action="true"', 'edit action marker');
contains(card, 'data-stage232t-r1d-work-item-delete-action="true"', 'delete action marker');
contains(card, 'onEdit();', 'edit handler called after event boundary');
contains(card, 'onDelete();', 'delete handler called after event boundary');

notContains(today, "onEdit={() => navigate('/tasks')}", 'generic task edit navigation');
notContains(today, "onEdit={() => navigate('/calendar')}", 'generic event edit navigation');
contains(today, 'getTodayTaskEditHrefStage232TR1D(task)', 'task edit uses task route helper');
contains(today, 'editTaskId=', 'task edit passes taskId');
contains(today, 'getTodayEventEditHrefStage232TR1D(event)', 'event edit uses event route helper');
contains(today, 'editEventId', 'event edit passes eventId');

contains(tasks, "searchParams.get('editTaskId')", 'TasksStable reads editTaskId');
contains(tasks, 'openEditTask(task);', 'TasksStable opens existing task editor');
contains(calendar, "searchParams.get('editEventId')", 'Calendar reads editEventId');
contains(calendar, "searchParams.get('editTaskId')", 'Calendar reads editTaskId');
contains(calendar, 'setEditEntry(entry);', 'Calendar opens existing edit entry modal');
contains(calendar, 'setEditDraft(buildEditDraft(entry));', 'Calendar builds existing edit draft');

contains(today, 'await deleteTaskFromSupabase(taskId);', 'task delete uses source truth helper');
contains(today, 'await deleteEventFromSupabase(eventId);', 'event delete uses source truth helper');
contains(today, "await refreshData({ force: true, reason: 'operation' });", 'mutating actions refresh Today data');

contains(today, 'handleShiftTodayWorkItemStage227G1', 'one Today shift handler');
contains(today, 'updateTaskInSupabase({', 'task shift/done uses task update helper');
contains(today, 'scheduledAt: nextStartAt', 'task shift persists scheduledAt');
contains(today, 'dueAt: nextStartAt', 'task shift persists dueAt');
contains(today, 'updateEventInSupabase({', 'event shift/done uses event update helper');
contains(today, 'startAt: nextStartAt', 'event shift persists startAt');
contains(today, 'endAt: nextEndAt', 'event shift persists endAt');
contains(today, "status: 'done'", 'done writes done status');

const forbiddenChanged = changed.filter((file) => (
  /\.sql$/i.test(file) ||
  /^obsidian_updates\//i.test(file) ||
  /(^|\/)00_OBSIDIAN_VAULT(\/|$)/i.test(file) ||
  /finance|commission/i.test(file)
));

if (forbiddenChanged.length) {
  fail('forbidden files changed: ' + forbiddenChanged.join(', '));
} else {
  pass('no SQL/finance/commission/Obsidian files changed in git diff');
}

if (failures) {
  console.error('\n' + STAGE + ' guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH');
