const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('R15 guard passes in post-R17 current state', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R15 contract keeps expected task display labels and tones', () => {
  const facade = read('src/lib/source-of-truth/task-display-status.ts');

  for (const token of [
    "label: 'Zrobione'",
    "label: 'Zalegle'",
    "label: 'Dzis'",
    "label: 'Bez terminu'",
    "label: 'Nadchodzace'",
    "tone: 'green'",
    "tone: 'red'",
    "tone: 'blue'",
    "tone: 'neutral'",
  ]) {
    assert.ok(facade.includes(token), token);
  }
});

test('R15 contract now coexists with R17 TasksStable runtime adoption', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const today = read('src/pages/TodayStable.tsx');
  const card = read('src/components/work-item-card.tsx');

  assert.ok(tasks.includes("from '../lib/source-of-truth/task-display-status'"));
  assert.equal((tasks.match(/getTaskDisplayStatusLabel\(/g) || []).length, 1);
  assert.equal((tasks.match(/getTaskDisplayStatusTone\(/g) || []).length, 1);
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));
  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.ok(!today.includes('task-display-status'));
  assert.ok(!card.includes('task-display-status'));
});
