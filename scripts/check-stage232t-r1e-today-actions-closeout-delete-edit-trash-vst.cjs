const fs = require('fs');
const { execSync } = require('child_process');

const STAGE = 'STAGE232T_R1E';

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
function matches(text, pattern, label) {
  if (pattern.test(text)) pass(label);
  else fail('missing pattern ' + label + ' [' + pattern + ']');
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
const changed = changedFiles();

contains(today, 'STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST', 'Today R1E marker');
contains(card, 'STAGE232T_R1E_WORK_ITEM_TRASH_VST', 'WorkItemCard R1E marker');

contains(card, 'EntityTrashButton', 'WorkItemCard uses shared trash button');
contains(card, 'trashActionIconClass', 'WorkItemCard uses shared trash icon class');
notContains(card, "import { EntityActionButton", 'WorkItemCard does not import generic entity action button');
notContains(card, '<EntityActionButton', 'WorkItemCard does not render generic entity action button');
notContains(card, '<Trash2 className="h-4 w-4"', 'WorkItemCard has no raw trash icon class');
matches(card, /data-stage232t-r1e-work-item-delete-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?onDelete\(\);/, 'delete click stays inside card');

contains(today, 'todayEditDraft', 'Today owns local edit draft state');
contains(today, 'openTodayTaskEditStage232TR1E', 'Today opens task edit locally');
contains(today, 'openTodayEventEditStage232TR1E', 'Today opens event edit locally');
contains(today, 'handleSaveTodayEditStage232TR1E', 'Today saves edit locally');
contains(today, 'data-stage232t-r1e-today-edit-modal="true"', 'Today renders local edit modal');
notContains(today, "navigate('/tasks", 'Today task edit does not navigate to Tasks');
notContains(today, "navigate('/calendar", 'Today event edit does not navigate to Calendar');
notContains(today, 'getTodayTaskEditHrefStage232TR1D', 'Today task edit query helper removed from primary path');
notContains(today, 'getTodayEventEditHrefStage232TR1D', 'Today event edit query helper removed from primary path');
notContains(today, 'editTaskId=', 'Today does not pass editTaskId from work item edit');
notContains(today, 'editEventId', 'Today does not pass editEventId from work item edit');

contains(today, 'await deleteTaskFromSupabase(taskId);', 'task delete uses source truth helper');
contains(today, 'await deleteEventFromSupabase(eventId);', 'event delete uses source truth helper');
matches(today, /await deleteTaskFromSupabase\(taskId\);[\s\S]*?setData\(\(current\) => \(\{[\s\S]*?tasks:[\s\S]*?\.filter\(\(row\) => String\(row\?\.id \|\| ''\) !== taskId\)/, 'task delete prunes local Today rows');
matches(today, /await deleteEventFromSupabase\(eventId\);[\s\S]*?setData\(\(current\) => \(\{[\s\S]*?events:[\s\S]*?\.filter\(\(row\) => String\(row\?\.id \|\| ''\) !== eventId\)/, 'event delete prunes local Today rows');
contains(today, "await refreshData({ force: true, reason: 'operation' });", 'delete/edit actions refresh Today data');
contains(today, "toast.success('Zadanie usuni", 'task delete confirms success');
contains(today, "toast.success('Wydarzenie usuni", 'event delete confirms success');
contains(today, "status === 'deleted'", 'deleted status is closed');
contains(today, "status === 'archived'", 'archived status is closed');
contains(today, "status === 'removed'", 'removed status is closed');

const forbiddenChanged = changed.filter((file) => (
  /\.sql$/i.test(file) ||
  /^_project\/obsidian_updates\//i.test(file) ||
  /^10_PROJEKTY\//i.test(file) ||
  /(^|\/)00_OBSIDIAN_VAULT(\/|$)/i.test(file) ||
  /finance|commission|billing/i.test(file)
));

if (forbiddenChanged.length) {
  fail('forbidden files changed: ' + forbiddenChanged.join(', '));
} else {
  pass('no SQL/finance/commission/billing/Obsidian files changed in git diff');
}

if (failures) {
  console.error('\n' + STAGE + ' guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST');
