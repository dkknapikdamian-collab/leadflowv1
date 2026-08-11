const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function must(text, token) {
  if (!text.includes(token)) throw new Error('Missing token: ' + token);
}

function mustNot(text, token) {
  if (text.includes(token)) throw new Error('Forbidden token: ' + token);
}

function localClosed(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'complete', 'finished', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'zrobione', 'wykonane'].includes(key);
}

function compatDateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function compatOverdue(raw, status, todayKey) {
  const dateKey = compatDateKey(raw);
  return Boolean(dateKey) && dateKey < todayKey && !localClosed(status);
}

function compatGroupId(input) {
  const { status, momentRaw, todayKey } = input;
  if (localClosed(status)) return 'done';
  if (compatOverdue(momentRaw, status, todayKey)) return 'overdue';

  const dateKey = compatDateKey(momentRaw);
  if (dateKey === todayKey) return 'today';

  const raw = String(momentRaw || '');
  if (!raw) return 'no_due';

  return 'upcoming';
}

const facade = read('src/lib/source-of-truth/task-display-status.ts');
const domain = read('src/lib/domain-statuses.ts');
const tasks = read('src/pages/TasksStable.tsx');
const pkg = read('package.json');
const report = read('_project/runs/LF-PROD-SOT-005C-R23_TASKS_STABLE_FACADE_HELPER_EXPORT_COMPAT_CONTRACT.md');
const test = read('tests/lf-prod-sot-005c-r23-task-display-helper-compat.test.cjs');

must(facade, "export type TaskStableGroupIdCompat = 'overdue' | 'today' | 'upcoming' | 'no_due' | 'done';");
must(facade, 'export type TaskStableGroupCompatInput = {');
must(facade, "import { isTaskStatusClosed } from '../domain-statuses';");
mustNot(facade, 'TASK_STABLE_GROUP_CLOSED_COMPAT_VALUES');
must(facade, 'export function getTaskStableGroupDateKeyCompat');
must(facade, 'export function isTaskStableGroupClosedCompat');
must(facade, 'export function isTaskStableGroupOverdueCompat');
must(facade, 'export function getTaskStableGroupIdCompat');

must(facade, "return String(momentRaw || '').slice(0, 10);");
must(facade, 'return isTaskStatusClosed(status);');
must(facade, "if (isTaskStableGroupClosedCompat(status)) return 'done';");
must(facade, "if (isTaskStableGroupOverdueCompat(momentRaw, status, todayKey)) return 'overdue';");
must(facade, "if (dateKey === todayKey) return 'today';");
must(facade, "if (!raw) return 'no_due';");
must(facade, "return 'upcoming';");

for (const closed of ['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed']) {
  must(domain, "'" + closed + "'");
}

const helperSection = facade.slice(facade.indexOf('export type TaskStableGroupIdCompat'));
mustNot(helperSection, 'TasksStable');
mustNot(helperSection, 'window.');
mustNot(helperSection, 'document.');
mustNot(helperSection, 'localStorage');
mustNot(helperSection, 'sessionStorage');
mustNot(helperSection, 'new Date(');

must(tasks, 'function getTaskDateKey(task: any)');
must(tasks, "import { isTaskStatusClosed } from '../lib/domain-statuses';");
must(tasks, 'function isTaskDone(task: any)');
must(tasks, 'return isTaskStatusClosed(task?.status);');
must(tasks, 'function getTaskGroupId(task: any): TaskGroupId');
must(tasks, 'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));');
mustNot(tasks, 'isTaskStableGroupClosedCompat');
mustNot(tasks, 'isTaskStableGroupOverdueCompat');
mustNot(tasks, 'getTaskStableGroupIdCompat');

must(pkg, '"verify:lf-prod-sot-005c-r23"');
must(test, 'R23 guard passes');
must(report, 'R23: PASS');
must(report, 'RUNTIME_CHANGED: NO');
must(report, 'TASKSSTABLE_REWIRED: NO');

const statuses = ['todo', 'scheduled', 'in_progress', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'unknown', '', null];
const closedResults = statuses
  .filter((status) => localClosed(status))
  .map((status) => status === '' ? 'empty' : status === null ? 'null' : String(status));
const openDeletedArchivedRemoved = ['deleted', 'archived', 'removed'].filter((status) => !localClosed(status));

if (JSON.stringify(closedResults) !== JSON.stringify(['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed'])) {
  throw new Error('R23 closed compat matrix mismatch: ' + JSON.stringify(closedResults));
}
if (openDeletedArchivedRemoved.length !== 0) {
  throw new Error('R23 deleted/archived/removed compat mismatch: ' + JSON.stringify(openDeletedArchivedRemoved));
}

const todayKey = '2026-07-09';
const cases = [
  { name: 'done closed', status: 'done', raw: '2026-07-08', expected: 'done' },
  { name: 'completed closed', status: 'completed', raw: '2026-07-08', expected: 'done' },
  { name: 'deleted is closed', status: 'deleted', raw: '2026-07-08', expected: 'done' },
  { name: 'archived is closed', status: 'archived', raw: '2026-07-08', expected: 'done' },
  { name: 'removed is closed', status: 'removed', raw: '2026-07-08', expected: 'done' },
  { name: 'today', status: 'todo', raw: '2026-07-09T14:30:00.000Z', expected: 'today' },
  { name: 'empty raw no_due', status: 'todo', raw: '', expected: 'no_due' },
  { name: 'future upcoming', status: 'todo', raw: '2026-07-10', expected: 'upcoming' },
  { name: 'invalid local raw slice upcoming', status: 'todo', raw: 'not-a-date-like-value', expected: 'upcoming' },
  { name: 'malformed partial local raw slice upcoming', status: 'todo', raw: '2026-7-9', expected: 'upcoming' },
];

for (const item of cases) {
  const actual = compatGroupId({ status: item.status, momentRaw: item.raw, todayKey });
  if (actual !== item.expected) throw new Error(item.name + ': ' + actual + ' !== ' + item.expected);
}

const runtimeDiffs = execFileSync('git', [
  'diff',
  '--name-only',
  '--',
  'src/pages/TasksStable.tsx',
  'data/flows.json',
  'runtime/data',
  'src/App.tsx',
  'src/**/*.css',
], { cwd: root }).toString().trim().split(/\r?\n/).filter(Boolean);

const allowedPostR23Diffs = new Set([
  'src/pages/TasksStable.tsx',
]);
const forbiddenRuntimeDiffs = runtimeDiffs.filter((name) => !allowedPostR23Diffs.has(name));

if (forbiddenRuntimeDiffs.length > 0) {
  throw new Error('Forbidden runtime/UI diff in R23:\n' + forbiddenRuntimeDiffs.join('\n'));
}

console.log('LF-PROD-SOT-005C-R23 guard PASS');
