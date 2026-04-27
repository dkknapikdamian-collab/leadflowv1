const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const tasks = read('src/pages/Tasks.tsx');
const today = read('src/pages/Today.tsx');
const calendar = read('src/pages/Calendar.tsx');

assert(tasks.includes('function TaskReminderEditor('), 'Tasks missing TaskReminderEditor');
assert(tasks.includes('data-task-edit-reminder-panel="true"'), 'Tasks missing edit reminder panel marker');
assert(tasks.includes("setEditTask((prev: any) => prev ? { ...prev, reminder } : prev)"), 'Edit task reminder does not update editTask.reminder');
assert(tasks.includes('toReminderAtIso(payload.dueAt, payload.reminder)'), 'Task edit/save does not use payload reminder');
assert(today.includes('shouldOpenWeeklyCalendarTile'), 'Today missing weekly calendar tile detector');
assert(today.includes("window.localStorage.setItem('closeflow:calendar:view:v1', 'week')"), 'Today does not force week view before opening calendar');
assert(today.includes("'/calendar?view=week'") || today.includes('"/calendar?view=week"'), 'Today does not point to weekly calendar URL');
assert(calendar.includes('useSearchParams'), 'Calendar does not read search params');
assert(calendar.includes("const forcedCalendarView = searchParams.get('view');"), 'Calendar missing view query handling');
assert(calendar.includes("setCalendarView(forcedCalendarView);"), 'Calendar does not apply forced weekly view');

console.log('OK: task edit reminder and Today week calendar are guarded.');
