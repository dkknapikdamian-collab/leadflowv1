const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { execSync } = require('child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function vercelRewriteDestination(source) {
  const vercel = JSON.parse(read('vercel.json'));
  const rewrite = Array.isArray(vercel.rewrites)
    ? vercel.rewrites.find((entry) => entry && entry.source === source)
    : null;
  return rewrite ? rewrite.destination : '';
}

test('WorkItemCard delete uses the final shared trash visual source', () => {
  const card = read('src/components/work-item-card.tsx');

  assert.match(card, /STAGE232T_R1E_WORK_ITEM_TRASH_VST/);
  assert.match(card, /EntityTrashButton/);
  assert.match(card, /trashActionIconClass/);
  assert.doesNotMatch(card, /import \{ EntityActionButton/);
  assert.doesNotMatch(card, /<EntityActionButton/);
  assert.doesNotMatch(card, /<Trash2 className="h-4 w-4"/);
  assert.match(card, /data-stage232t-r1e-work-item-delete-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?onDelete\(\);/);
});

test('Today task and event edit stays in Today instead of navigating away', () => {
  const today = read('src/pages/TodayStable.tsx');

  assert.match(today, /STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST/);
  assert.match(today, /todayEditDraft/);
  assert.match(today, /openTodayTaskEditStage232TR1E/);
  assert.match(today, /openTodayEventEditStage232TR1E/);
  assert.match(today, /handleSaveTodayEditStage232TR1E/);
  assert.match(today, /data-stage232t-r1e-today-edit-modal="true"/);
  assert.doesNotMatch(today, /navigate\('\/tasks/);
  assert.doesNotMatch(today, /navigate\('\/calendar/);
  assert.doesNotMatch(today, /getTodayTaskEditHrefStage232TR1D/);
  assert.doesNotMatch(today, /getTodayEventEditHrefStage232TR1D/);
  assert.doesNotMatch(today, /editTaskId=/);
  assert.doesNotMatch(today, /editEventId/);
});

test('Today delete waits for backend helper, then prunes locally and refreshes', () => {
  const today = read('src/pages/TodayStable.tsx');

  assert.match(today, /await deleteTaskFromSupabase\(taskId\);[\s\S]*?tasks:[\s\S]*?\.filter\(\(row\) => String\(row\?\.id \|\| ''\) !== taskId\)/);
  assert.match(today, /await deleteEventFromSupabase\(eventId\);[\s\S]*?events:[\s\S]*?\.filter\(\(row\) => String\(row\?\.id \|\| ''\) !== eventId\)/);
  assert.match(today, /await refreshData\(\{ force: true, reason: 'operation' \}\);/);
  assert.match(today, /setErrorMessage\('Nie udalo sie usunac zadania: ' \+ message\);/);
  assert.match(today, /toast\.error\('Nie udalo sie usunac zadania\.'\);/);
  assert.match(today, /setErrorMessage\('Nie udalo sie usunac wydarzenia: ' \+ message\);/);
  assert.match(today, /toast\.error\('Nie udalo sie usunac wydarzenia\.'\);/);
  assert.match(today, /status === 'deleted'/);
  assert.match(today, /status === 'archived'/);
  assert.match(today, /status === 'removed'/);
  assert.doesNotMatch(today, /localStorage\.setItem\('closeflow:today:deleted/);
  assert.doesNotMatch(today, /deletedIds/);
});

test('Today task/event delete and fetch share the same system source truth route', () => {
  const supabase = read('src/lib/supabase-fallback.ts');
  const vercel = read('vercel.json');

  assert.match(supabase, /fetchTasksFromSupabase[\s\S]*\/api\/system\?apiRoute=tasks/);
  assert.match(supabase, /fetchEventsFromSupabase[\s\S]*\/api\/system\?apiRoute=events/);
  assert.match(supabase, /softDeleteTaskInSupabase[\s\S]*status: 'deleted'[\s\S]*show_in_tasks: false[\s\S]*show_in_calendar: false/);
  assert.match(supabase, /hardDeleteTaskFromSupabase[\s\S]*\/api\/system\?apiRoute=tasks&id=\$\{encodeURIComponent\(taskId\)\}/);
  assert.equal(vercelRewriteDestination('/api/tasks'), '/api/system?apiRoute=tasks');
  assert.equal(vercelRewriteDestination('/api/events'), '/api/system?apiRoute=events');
  assert.doesNotMatch(vercel, /\/api\/work-items\?kind=tasks/);
  assert.doesNotMatch(vercel, /\/api\/work-items\?kind=events/);
});

test('Stage232T R1E stays out of SQL, finance, billing and Obsidian files', () => {
  const changed = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  assert.deepEqual(
    changed.filter((file) => (
      /\.sql$/i.test(file) ||
      /^_project\/obsidian_updates\//i.test(file) ||
      /^10_PROJEKTY\//i.test(file) ||
      /(^|\/)00_OBSIDIAN_VAULT(\/|$)/i.test(file) ||
      /finance|commission|billing/i.test(file)
    )),
    [],
  );
});
