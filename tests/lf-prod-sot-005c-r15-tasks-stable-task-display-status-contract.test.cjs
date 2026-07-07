const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/task-display-status.ts');
const tasksStablePath = path.join(root, 'src/pages/TasksStable.tsx');
const guardPath = path.join(root, 'scripts/guards/verify-lf-prod-sot-005c-r15-tasks-stable-task-display-status-contract.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('R15 guard passes', () => {
  execFileSync(process.execPath, [guardPath], { cwd: root, stdio: 'pipe' });
});

test('R15 contract defines expected task display labels and tones', () => {
  const source = read(contractPath);
  for (const label of ['Zrobione', 'Zalegle', 'Dzis', 'Bez terminu', 'Nadchodzace']) {
    assert.match(source, new RegExp(label), 'missing label token: ' + label);
  }
  for (const tone of ["'green'", "'red'", "'blue'", "'neutral'"]) {
    assert.ok(source.includes(tone), 'missing tone token: ' + tone);
  }
  for (const kind of ["'done'", "'overdue'", "'today'", "'no_due'", "'upcoming'"]) {
    assert.ok(source.includes(kind), 'missing kind token: ' + kind);
  }
});

test('R15 does not rewire TasksStable runtime call-sites', () => {
  const tasksStable = read(tasksStablePath);
  assert.equal(tasksStable.includes("from '../lib/source-of-truth/task-display-status'"), false);
  assert.equal(tasksStable.includes('getTaskDisplayStatus('), false);
  assert.ok(tasksStable.includes('function getStatusBadge(task: any)'));
  assert.ok(tasksStable.includes('function getTaskStatusTone(task: any)'));
});
