const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { execSync } = require('child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('WorkItemCard isolates edit/delete clicks like done and shift actions', () => {
  const card = read('src/components/work-item-card.tsx');
  assert.match(card, /data-stage227g1-today-reschedule-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?action\.onClick\(\);/);
  assert.match(card, /data-stage116-work-item-done-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?onDone\(\);/);
  assert.match(card, /data-stage232t-r1d-work-item-edit-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?onEdit\(\);/);
  assert.match(card, /data-stage232t-r1d-work-item-delete-action="true"[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?onDelete\(\);/);
});

test('Today edit actions route to a concrete task/event editor intent', () => {
  const today = read('src/pages/TodayStable.tsx');
  const tasks = read('src/pages/TasksStable.tsx');
  const calendar = read('src/pages/Calendar.tsx');

  assert.doesNotMatch(today, /onEdit=\{\(\) => navigate\('\/tasks'\)\}/);
  assert.doesNotMatch(today, /onEdit=\{\(\) => navigate\('\/calendar'\)\}/);
  assert.match(today, /getTodayTaskEditHrefStage232TR1D\(task\)/);
  assert.match(today, /editTaskId=/);
  assert.match(today, /getTodayEventEditHrefStage232TR1D\(event\)/);
  assert.match(today, /editEventId/);
  assert.match(tasks, /searchParams\.get\('editTaskId'\)/);
  assert.match(tasks, /openEditTask\(task\);/);
  assert.match(calendar, /searchParams\.get\('editEventId'\)/);
  assert.match(calendar, /setEditEntry\(entry\);/);
  assert.match(calendar, /setEditDraft\(buildEditDraft\(entry\)\);/);
});

test('Today actions persist through existing task/event source truth and refresh', () => {
  const today = read('src/pages/TodayStable.tsx');

  assert.match(today, /handleShiftTodayWorkItemStage227G1/);
  assert.match(today, /shiftActions=\{buildTodayRescheduleActionsStage227G1\('task', task\)\}/);
  assert.match(today, /shiftActions=\{buildTodayRescheduleActionsStage227G1\('event', event\)\}/);
  assert.match(today, /await updateTaskInSupabase\(\{/);
  assert.match(today, /scheduledAt: nextStartAt/);
  assert.match(today, /dueAt: nextStartAt/);
  assert.match(today, /await updateEventInSupabase\(\{/);
  assert.match(today, /startAt: nextStartAt/);
  assert.match(today, /endAt: nextEndAt/);
  assert.match(today, /await deleteTaskFromSupabase\(taskId\);/);
  assert.match(today, /await deleteEventFromSupabase\(eventId\);/);
  assert.match(today, /status: 'done'/);
  assert.match(today, /await refreshData\(\{ force: true, reason: 'operation' \}\);/);
});

test('Stage232T R1D stays out of SQL, finance, commission and Obsidian files', () => {
  const changed = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  assert.deepEqual(
    changed.filter((file) => (
      /\.sql$/i.test(file) ||
      /^obsidian_updates\//i.test(file) ||
      /(^|\/)00_OBSIDIAN_VAULT(\/|$)/i.test(file) ||
      /finance|commission/i.test(file)
    )),
    [],
  );
});
