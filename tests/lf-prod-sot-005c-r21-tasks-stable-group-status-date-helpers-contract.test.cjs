const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function localClosed(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'closed', 'cancelled', 'canceled'].includes(key);
}

function facadeClosedModel(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed'].includes(key);
}

function localDateKeyFromRaw(raw) {
  return String(raw || '').slice(0, 10);
}

function facadeDateKeyFromRaw(raw) {
  const text = String(raw || '').trim();
  const candidate = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : '';
}

test('R21 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R21 status matrix captures real closed-status differences before runtime adoption', () => {
  const statuses = ['todo', 'scheduled', 'in_progress', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'unknown', '', null];

  const diffs = statuses
    .map((status) => {
      const name = status === '' ? 'empty' : status === null ? 'null' : String(status);
      return { name, local: localClosed(status), facade: facadeClosedModel(status) };
    })
    .filter((item) => item.local !== item.facade);

  assert.deepEqual(diffs.map((item) => item.name), ['deleted', 'archived', 'removed']);
  for (const item of diffs) {
    assert.equal(item.local, false);
    assert.equal(item.facade, true);
  }
});

test('R21 date matrix captures invalid-date difference before runtime adoption', () => {
  const cases = [
    ['valid today YYYY-MM-DD', '2026-07-09', false],
    ['valid yesterday YYYY-MM-DD', '2026-07-08', false],
    ['valid future YYYY-MM-DD', '2026-07-10', false],
    ['valid ISO datetime', '2026-07-09T14:30:00.000Z', false],
    ['date + time split', '2026-07-09T09:00', false],
    ['empty date', '', false],
    ['invalid date-like string', 'not-a-date-like-value', true],
    ['malformed partial date', '2026-7-9', true],
  ];

  for (const [name, raw, shouldDiffer] of cases) {
    const local = localDateKeyFromRaw(raw);
    const facade = facadeDateKeyFromRaw(raw);
    assert.equal(local !== facade, shouldDiffer, name + ': ' + local + ' vs ' + facade);
  }
});

test('R21 contract guard coexists with the later R24 date-key helper adoption', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  assert.ok(tasks.includes('function isTaskDone(task: any)'));
  assert.ok(tasks.includes('function isTaskToday(task: any)'));
  assert.ok(tasks.includes('function isTaskOverdue(task: any)'));
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));
  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.ok(tasks.includes('getTaskStableGroupDateKeyCompat'));

  const forbiddenRuntimeHelpers = [
    'getTaskDisplayDateKey',
    'isTaskDisplayClosed',
    'isTaskDisplayOverdue',
    'getTaskDisplayStatus(',
    'isTaskStableGroupClosedCompat',
    'isTaskStableGroupOverdueCompat',
    'getTaskStableGroupIdCompat',
  ];

  for (const token of forbiddenRuntimeHelpers) {
    assert.equal(tasks.includes(token), false, token);
  }

  assert.equal((tasks.match(/getTaskDisplayStatusLabel\(/g) || []).length, 1);
  assert.equal((tasks.match(/getTaskDisplayStatusTone\(/g) || []).length, 1);
});

test('R21 documents the next decision gate before any runtime adoption', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA.md');

  assert.ok(report.includes('R22 decision required before runtime adoption'));
  assert.ok(report.includes('deleted / archived / removed'));
  assert.ok(report.includes('invalid date'));
  assert.ok(report.includes('R22_CREATED: NO'));
});
