const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function compatClosed(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'complete', 'finished', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'zrobione', 'wykonane'].includes(key);
}

function compatDateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function compatGroupId(input) {
  const { status, momentRaw, todayKey } = input;
  if (compatClosed(status)) return 'done';

  const dateKey = compatDateKey(momentRaw);
  if (Boolean(dateKey) && dateKey < todayKey && !compatClosed(status)) return 'overdue';
  if (dateKey === todayKey) return 'today';

  const raw = String(momentRaw || '');
  if (!raw) return 'no_due';

  return 'upcoming';
}

test('R23 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r23-task-display-helper-compat.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R23 facade exports pure compat helper contract', () => {
  const source = read('src/lib/source-of-truth/task-display-status.ts');

  assert.ok(source.includes('export function getTaskStableGroupDateKeyCompat'));
  assert.ok(source.includes('export function isTaskStableGroupClosedCompat'));
  assert.ok(source.includes('export function isTaskStableGroupOverdueCompat'));
  assert.ok(source.includes('export function getTaskStableGroupIdCompat'));
  assert.ok(source.includes("return String(momentRaw || '').slice(0, 10);"));

  const helperSection = source.slice(source.indexOf('export type TaskStableGroupIdCompat'));
  assert.equal(helperSection.includes('TasksStable'), false);
  assert.equal(helperSection.includes('new Date('), false);
  assert.equal(helperSection.includes('document.'), false);
  assert.equal(helperSection.includes('window.'), false);
});

test('R23 compat closed status matches current TasksStable local isTaskDone behavior', () => {
  const statuses = ['todo', 'scheduled', 'in_progress', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'unknown', '', null];

  const closed = statuses
    .filter((status) => compatClosed(status))
    .map((status) => status === '' ? 'empty' : status === null ? 'null' : String(status));

  assert.deepEqual(closed, ['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed']);
  assert.equal(compatClosed('deleted'), true);
  assert.equal(compatClosed('archived'), true);
  assert.equal(compatClosed('removed'), true);
});

test('R23 compat date and group matrix preserves current TasksStable grouping behavior', () => {
  const todayKey = '2026-07-09';

  const cases = [
    ['done closed', { status: 'done', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['completed closed', { status: 'completed', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['cancelled closed', { status: 'cancelled', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['deleted is closed', { status: 'deleted', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['archived is closed', { status: 'archived', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['removed is closed', { status: 'removed', momentRaw: '2026-07-08', todayKey }, 'done'],
    ['today ISO', { status: 'todo', momentRaw: '2026-07-09T12:00:00Z', todayKey }, 'today'],
    ['empty no_due', { status: 'todo', momentRaw: '', todayKey }, 'no_due'],
    ['future upcoming', { status: 'todo', momentRaw: '2026-07-10', todayKey }, 'upcoming'],
    ['invalid local raw slice upcoming', { status: 'todo', momentRaw: 'not-a-date-like-value', todayKey }, 'upcoming'],
    ['malformed partial local raw slice upcoming', { status: 'todo', momentRaw: '2026-7-9', todayKey }, 'upcoming'],
  ];

  for (const [name, input, expected] of cases) {
    assert.equal(compatGroupId(input), expected, name);
  }
});

test('R23 compat contract now coexists with the later R24 date-key adoption only', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  assert.ok(tasks.includes('function getTaskDateKey(task: any)'));
  assert.ok(tasks.includes('function isTaskDone(task: any)'));
  assert.ok(tasks.includes('function isTaskOverdue(task: any)'));
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));

  assert.equal(tasks.includes('getTaskStableGroupDateKeyCompat'), true);
  assert.equal((tasks.match(/getTaskStableGroupDateKeyCompat\(/g) || []).length, 1);
  assert.equal(tasks.includes('isTaskStableGroupClosedCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupOverdueCompat'), false);
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
});
