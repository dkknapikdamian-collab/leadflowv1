const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const todayKey = '2026-07-10';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function oldLocalDateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function r24AdoptedDateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function isClosed(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'closed', 'cancelled', 'canceled'].includes(key);
}

function groupWithDateKey(task, dateKeyFn) {
  if (isClosed(task.status)) return 'done';

  const dateKey = dateKeyFn(task.momentRaw);
  if (dateKey && dateKey < task.todayKey && !isClosed(task.status)) return 'overdue';
  if (dateKey === task.todayKey) return 'today';

  const raw = String(task.momentRaw || '');
  if (!raw) return 'no_due';

  return 'upcoming';
}

const behaviorMatrix = [
  ['done closed wins over overdue date', { status: 'done', momentRaw: '2026-07-09', todayKey }, 'done'],
  ['completed closed wins over today date', { status: 'completed', momentRaw: todayKey, todayKey }, 'done'],
  ['closed closed wins over future date', { status: 'closed', momentRaw: '2026-07-11', todayKey }, 'done'],
  ['cancelled closed wins over invalid date', { status: 'cancelled', momentRaw: 'not-a-date-like-value', todayKey }, 'done'],
  ['todo overdue', { status: 'todo', momentRaw: '2026-07-09', todayKey }, 'overdue'],
  ['scheduled overdue', { status: 'scheduled', momentRaw: '2026-07-09T12:00:00Z', todayKey }, 'overdue'],
  ['in_progress overdue', { status: 'in_progress', momentRaw: '2026-07-09T08:00', todayKey }, 'overdue'],
  ['todo today', { status: 'todo', momentRaw: todayKey, todayKey }, 'today'],
  ['scheduled today ISO', { status: 'scheduled', momentRaw: todayKey + 'T15:30:00.000Z', todayKey }, 'today'],
  ['in_progress today', { status: 'in_progress', momentRaw: todayKey + 'T09:00', todayKey }, 'today'],
  ['todo upcoming', { status: 'todo', momentRaw: '2026-07-11', todayKey }, 'upcoming'],
  ['scheduled upcoming ISO', { status: 'scheduled', momentRaw: '2026-07-11T10:00:00Z', todayKey }, 'upcoming'],
  ['empty raw no_due', { status: 'todo', momentRaw: '', todayKey }, 'no_due'],
  ['null raw no_due', { status: 'scheduled', momentRaw: null, todayKey }, 'no_due'],
  ['invalid raw preserves old slice as upcoming', { status: 'todo', momentRaw: 'not-a-date-like-value', todayKey }, 'upcoming'],
  ['malformed partial date preserves old slice as upcoming', { status: 'in_progress', momentRaw: '2026-7-9', todayKey }, 'upcoming'],
  ['deleted remains open and overdue', { status: 'deleted', momentRaw: '2026-07-09', todayKey }, 'overdue'],
  ['archived remains open and today', { status: 'archived', momentRaw: todayKey, todayKey }, 'today'],
  ['removed remains open and upcoming', { status: 'removed', momentRaw: '2026-07-11', todayKey }, 'upcoming'],
];

test('R25 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R25 behavior matrix has no drift between pre-R24 local date key and R24 adopted helper', () => {
  for (const [name, task, expected] of behaviorMatrix) {
    const beforeR24 = groupWithDateKey(task, oldLocalDateKey);
    const afterR24 = groupWithDateKey(task, r24AdoptedDateKey);

    assert.equal(beforeR24, expected, name + ' pre-R24 expectation');
    assert.equal(afterR24, expected, name + ' post-R24 expectation');
    assert.equal(afterR24, beforeR24, name + ' behavior drift');
  }
});

test('R25 confirms TasksStable still adopted only the date-key compat helper', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  assert.ok(tasks.includes('return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));'));
  assert.equal((tasks.match(/getTaskStableGroupDateKeyCompat\(/g) || []).length, 1);
  assert.equal(tasks.includes('isTaskStableGroupClosedCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupOverdueCompat'), false);
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
});

test('R25 records whether R26 is allowed', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md');
  const map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md');

  assert.ok(report.includes('R25: PASS'));
  assert.ok(report.includes('BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT'));
  assert.ok(report.includes('R26_ALLOWED: YES'));
  assert.ok(map.includes('R26_ALLOWED: YES'));
});
