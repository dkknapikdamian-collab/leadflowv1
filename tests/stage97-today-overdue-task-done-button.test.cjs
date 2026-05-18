const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const todayPath = path.join(repoRoot, 'src/pages/TodayStable.tsx');
const workItemCardPath = path.join(repoRoot, 'src/components/work-item-card.tsx');
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

test('Stage97 WorkItemCard exposes a real task done button, not text only', () => {
  const card = read(workItemCardPath);
  assert.ok(card.includes('data-stage116-work-item-done-action="true"'), 'WorkItemCard must expose the shared done action marker.');
  assert.ok(card.includes("{doneBusy ? 'Zapisywanie...' : <><CheckCircle2"), 'Done action must render busy state and real Zrobione label.');
  assert.ok(card.includes('onDone();'), 'Done button must call the provided completion handler.');
  assert.ok(card.includes('event.preventDefault();'), 'Done action must not accidentally open the row link.');
  assert.ok(card.includes('event.stopPropagation();'), 'Done action must not bubble into card navigation.');
});

test('Stage97 operator overdue/today task rows use WorkItemCard with task identity and /tasks route', () => {
  const today = read(todayPath);
  const block = sliceBetween(
    today,
    '{operatorTasks.length ? operatorTasks.map',
    '}) : <EmptyState text="Brak zadań zaległych lub na dziś." />'
  );

  assert.ok(block.includes('<WorkItemCard'), 'Today task rows must render through WorkItemCard after Stage116.');
  assert.ok(block.includes('kind="task"'), 'Task rows must pass WorkItemCard kind=task.');
  assert.ok(block.includes('href="/tasks"'), 'Task rows must still route to /tasks.');
  assert.ok(block.includes("statusLabel={getTodayWorkItemStatusLabel('task'"), 'Task rows must keep overdue/today status label source.');
  assert.ok(block.includes('tone={getTodayWorkItemTone(task?.status, momentRaw, todayKey)}'), 'Task rows must keep red overdue tone source.');
  assert.ok(block.includes("onDone={() => void handleMarkTaskDone(String(task.id || ''))}"), 'Task rows must pass task identity into done handler.');
  assert.ok(block.includes('doneBusy={actionPendingId === `task-done:'), 'Task rows must expose done busy state keyed by task id.');
  assert.ok(block.includes("onEdit={() => navigate('/tasks')}"), 'Task rows must keep edit action.');
  assert.ok(block.includes('onDelete={() => void handleDeleteTask(task)}'), 'Task rows must keep delete action.');
});

test('Stage97 task rows are not edit-only after WorkItemCard migration', () => {
  const today = read(todayPath);
  const block = sliceBetween(
    today,
    '{operatorTasks.length ? operatorTasks.map',
    '}) : <EmptyState text="Brak zadań zaległych lub na dziś." />'
  );

  const editIndex = block.indexOf("onEdit={() => navigate('/tasks')}");
  const doneIndex = block.indexOf("onDone={() => void handleMarkTaskDone(String(task.id || ''))}");
  const hrefIndex = block.indexOf('href="/tasks"');
  assert.ok(editIndex !== -1, 'Missing edit action.');
  assert.ok(doneIndex !== -1, 'Missing done action with task identity.');
  assert.ok(hrefIndex !== -1, 'Missing /tasks route.');
});

test('Stage97 guard is included in quiet release gate', () => {
  const quietGate = read(quietGatePath);
  assert.ok(quietGate.includes('tests/stage97-today-overdue-task-done-button.test.cjs'));
});
