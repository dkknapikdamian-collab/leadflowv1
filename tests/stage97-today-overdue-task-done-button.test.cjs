const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const todayPath = path.join(repoRoot, 'src/pages/TodayStable.tsx');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function sliceBetween(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  assert.notStrictEqual(start, -1, 'Missing start marker: ' + startNeedle);
  const end = text.indexOf(endNeedle, start);
  assert.notStrictEqual(end, -1, 'Missing end marker after: ' + startNeedle);
  return text.slice(start, end);
}

test('Stage97 RowLink exposes a real task done button, not text only', () => {
  const today = read(todayPath);
  const rowLink = sliceBetween(today, 'function RowLink({', 'async function loadStableTodayData');

  assert.ok(rowLink.includes('data-stage79-task-done-action="true"'), 'RowLink must keep existing Stage79 done action button.');
  assert.ok(rowLink.includes('data-stage97-overdue-task-done-action="true"'), 'RowLink must expose Stage97 marker on the task done button.');
  assert.ok(rowLink.includes("{stage79TaskDoneSaving ? 'Zapisywanie...' : 'Zrobione'}"), 'Done button must visibly render Zrobione.');
  assert.ok(rowLink.includes('markStage79TaskDoneFromRow'), 'Done button must call the existing complete handler.');
  assert.ok(rowLink.includes("updateTaskInSupabase({ id: normalizedStage79TaskId, status: 'done' } as any)"), 'Existing handler must use real updateTaskInSupabase completion.');
});

test('Stage97 operator overdue/today task rows pass task identity into RowLink', () => {
  const today = read(todayPath);
  const block = sliceBetween(
    today,
    '{operatorTasks.length ? operatorTasks.map',
    '}) : <EmptyState text="Brak zadań zaległych lub na dziś." />'
  );

  assert.ok(block.includes('to="/tasks"'), 'Task rows must still route to /tasks.');
  assert.ok(block.includes("badge={getDateKey(momentRaw) < todayKey ? 'Zaległe' : 'Dziś'}"), 'Task rows must still distinguish overdue vs today.');
  assert.ok(block.includes('onEdit={() => navigate(\'/tasks\')}'), 'Task rows must keep edit action.');
  assert.ok(block.includes('onDelete={() => void handleDeleteTask(task)}'), 'Task rows must keep delete action.');
  assert.ok(block.includes('taskId={String(task.id || \'\')}'), 'Task rows must pass taskId to RowLink.');
  assert.ok(block.includes('doneKind="task"'), 'Task rows must mark RowLink as task kind so Zrobione renders.');
});

test('Stage97 task rows are not edit-only', () => {
  const today = read(todayPath);
  const block = sliceBetween(
    today,
    '{operatorTasks.length ? operatorTasks.map',
    '}) : <EmptyState text="Brak zadań zaległych lub na dziś." />'
  );

  const editIndex = block.indexOf('onEdit={() => navigate(\'/tasks\')}');
  const taskIdIndex = block.indexOf('taskId={String(task.id || \'\')}');
  const doneKindIndex = block.indexOf('doneKind="task"');
  assert.ok(editIndex !== -1, 'Missing edit action.');
  assert.ok(taskIdIndex !== -1, 'Missing task identity for done button.');
  assert.ok(doneKindIndex !== -1, 'Missing done task kind.');
});

test('Stage97 guard is included in quiet release gate', () => {
  const quietGate = read(quietGatePath);
  assert.ok(quietGate.includes('tests/stage97-today-overdue-task-done-button.test.cjs'));
});
