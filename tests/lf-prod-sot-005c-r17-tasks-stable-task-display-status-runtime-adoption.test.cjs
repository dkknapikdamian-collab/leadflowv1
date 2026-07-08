const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('R17 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r17-tasks-stable-task-display-status-runtime-adoption.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R17 facade contract labels and tones remain explicit', () => {
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

test('R17 TasksStable uses facade only for badge and tone helpers', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  assert.equal((tasks.match(/getTaskDisplayStatusLabel\(/g) || []).length, 1);
  assert.equal((tasks.match(/getTaskDisplayStatusTone\(/g) || []).length, 1);
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));
  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.ok(!tasks.includes("return 'Aktywne';"));
});
