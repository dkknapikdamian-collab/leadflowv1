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

const today = read('src/pages/Today.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const calendar = read('src/pages/Calendar.tsx');

assert(today.includes('data-today-tile-header="true"'), 'Today tile headers are not marked');
assert(today.includes('openOnlyTodayTile'), 'Today does not open only one tile');
assert(today.includes('data-today-shortcut-expands-section="true"'), 'Today shortcuts do not expand local sections');
assert(today.includes('event.stopImmediatePropagation();'), 'Today shortcut capture does not stop competing captures');
assert(today.includes('data-today-pipeline-shortcut="urgent"'), 'Today urgent shortcut is not marked');
assert(today.includes('data-today-pipeline-shortcut="without_action"'), 'Today without-action shortcut is not marked');
assert(today.includes('data-today-pipeline-shortcut="without_movement"'), 'Today without-movement shortcut is not marked');
assert(today.includes('data-today-pipeline-shortcut="blocked"'), 'Today blocked shortcut is not marked');

assert(!clientDetail.includes('Edytuj dane klienta'), 'ClientDetail still contains duplicate edit-client label');

assert(calendar.includes('clientId?: string;'), 'Calendar edit draft should support optional clientId');
assert(calendar.includes('status?: string;'), 'Calendar edit draft should support optional status');
assert(calendar.includes('clientId: editDraft.clientId || null'), 'Calendar edit event save does not persist clientId');
assert(calendar.includes("status: editDraft.status || 'scheduled'"), 'Calendar edit event save does not persist status');
assert(calendar.includes('data-calendar-event-edit-status="true"'), 'Calendar event edit status UI missing');
assert(calendar.includes('reminderAt = toReminderAtIso(editDraft.startAt, editDraft.reminder)'), 'Calendar edit event save does not calculate reminder');
assert(calendar.includes('reminderAt,'), 'Calendar edit event save does not persist reminderAt');
assert(calendar.includes('recurrenceRule: editDraft.recurrence.mode'), 'Calendar edit event save does not persist recurrence');
assert(calendar.includes('caseId: editDraft.caseId || null'), 'Calendar edit event save does not persist caseId');
assert(calendar.includes('leadId: editDraft.leadId || null'), 'Calendar edit event save does not persist leadId');

console.log('OK: Today tile expansion, client duplicate edit cleanup and event edit are guarded.');
