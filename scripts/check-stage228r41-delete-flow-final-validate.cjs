const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(ok, msg) {
  if (!ok) {
    console.error('STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH_FAIL: ' + msg);
    process.exit(1);
  }
}

const calendar = read('src/pages/Calendar.tsx');
const bundle = read('src/lib/calendar-items.ts');
const pkg = JSON.parse(read('package.json'));

assert(bundle.includes('filterActiveCalendarTaskRows'), 'missing task active-row bundle filter');
assert(bundle.includes('filterActiveCalendarEventRows'), 'missing event active-row bundle filter');
for (const token of ['deleted', 'archived', 'removed', 'show_in_calendar', 'showInCalendar', 'show_in_tasks', 'showInTasks']) {
  assert(bundle.includes(token), 'calendar-items.ts missing token: ' + token);
}

assert(calendar.includes('removeDeletedCalendarEntryFromLocalState'), 'Calendar.tsx missing local prune helper/call');
assert(calendar.includes('toast.error('), 'Calendar.tsx missing unsupported-kind error toast');
assert(calendar.includes('toast.success('), 'Calendar.tsx missing supported-delete success toast');
assert(calendar.includes("entry.kind === 'event'") || calendar.includes('entry.kind === "event"'), 'Calendar.tsx missing explicit event delete branch');
assert(calendar.includes("entry.kind === 'task'") || calendar.includes('entry.kind === "task"'), 'Calendar.tsx missing explicit task delete branch');

const prebuild = String(pkg.scripts?.prebuild || '');
assert(prebuild.includes('check-stage228r25-delete-flow-source-truth.cjs'), 'prebuild missing R25 guard');
assert(prebuild.includes('check-stage228r41-delete-flow-final-validate.cjs'), 'prebuild missing R41 guard');
assert(!/check-stage228r(2[6-9]|3[0-9]|40)-/.test(prebuild), 'prebuild still references failed R26-R40 guard chain');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH',
  contract: 'final delete flow validation uses existing filters, local prune and unsupported-kind protection without brittle Polish toast text'
}, null, 2));