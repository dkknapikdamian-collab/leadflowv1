const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const obsidianRoot = path.join(root, '..', '00_OBSIDIAN_VAULT');
const todayKey = '2026-07-10';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function readObsidian(rel) {
  return fs.readFileSync(path.join(obsidianRoot, rel), 'utf8');
}

function must(text, token) {
  if (!text.includes(token)) throw new Error('Missing token: ' + token);
}

function mustNot(text, token) {
  if (text.includes(token)) throw new Error('Forbidden token: ' + token);
}

function getFunctionBody(source, name) {
  const needle = 'function ' + name;
  const start = source.indexOf(needle);
  if (start < 0) throw new Error('Function not found: ' + name);

  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) throw new Error('Opening brace not found: ' + name);

  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, i);
  }

  throw new Error('Closing brace not found: ' + name);
}

function dateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function isClosed(status) {
  const key = String(status || '').trim().toLowerCase();
  return ['done', 'completed', 'closed', 'cancelled', 'canceled'].includes(key);
}

function groupId(task) {
  if (isClosed(task.status)) return 'done';

  const key = dateKey(task.momentRaw);
  if (key && key < task.todayKey && !isClosed(task.status)) return 'overdue';
  if (key === task.todayKey) return 'today';

  const raw = String(task.momentRaw || '');
  if (!raw) return 'no_due';

  return 'upcoming';
}

const matrix = [
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
  ['invalid raw remains upcoming via raw slice', { status: 'todo', momentRaw: 'not-a-date-like-value', todayKey }, 'upcoming'],
  ['malformed partial date remains upcoming via raw slice', { status: 'in_progress', momentRaw: '2026-7-9', todayKey }, 'upcoming'],
  ['deleted remains open overdue', { status: 'deleted', momentRaw: '2026-07-09', todayKey }, 'overdue'],
  ['archived remains open today', { status: 'archived', momentRaw: todayKey, todayKey }, 'today'],
  ['removed remains open upcoming', { status: 'removed', momentRaw: '2026-07-11', todayKey }, 'upcoming'],
];

for (const [name, task, expected] of matrix) {
  const actual = groupId(task);
  if (actual !== expected) throw new Error(name + ': ' + actual + ' !== ' + expected);
}

const tasks = read('src/pages/TasksStable.tsx');
const facade = read('src/lib/source-of-truth/task-display-status.ts');
const pkg = read('package.json');
const report = read('_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md');
const test = read('tests/lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.test.cjs');
const map = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md');
const router = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md');

must(tasks, "getTaskStableGroupDateKeyCompat } from '../lib/source-of-truth/task-display-status';");
must(tasks, 'function getTaskDateKey(task: any)');
must(getFunctionBody(tasks, 'getTaskDateKey'), 'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));');
must(tasks, 'function isTaskDone(task: any)');
must(tasks, 'function isTaskOverdue(task: any)');
must(tasks, 'function isTaskToday(task: any)');
must(tasks, 'function getTaskGroupId(task: any): TaskGroupId');
must(tasks, 'function buildTaskGroups(tasksToGroup: any[])');

for (const forbidden of [
  'isTaskStableGroupClosedCompat',
  'isTaskStableGroupOverdueCompat',
  'getTaskStableGroupIdCompat',
]) {
  mustNot(tasks, forbidden);
}

const dateHelperCalls = tasks.match(/getTaskStableGroupDateKeyCompat\(/g) || [];
if (dateHelperCalls.length !== 1) {
  throw new Error('Expected exactly one getTaskStableGroupDateKeyCompat runtime call, found: ' + dateHelperCalls.length);
}

must(facade, 'export function getTaskStableGroupDateKeyCompat');
must(facade, "return String(momentRaw || '').slice(0, 10);");
must(pkg, '"verify:lf-prod-sot-005c-r25"');
must(test, 'R25 behavior matrix has no drift');

for (const doc of [report, map]) {
  must(doc, 'R25: PASS');
  must(doc, 'BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT');
  must(doc, 'R26_ALLOWED: YES');
  must(doc, 'No new runtime rewire.');
  must(doc, 'deleted / archived / removed: preserved as open statuses');
  must(doc, 'invalid dates: preserved via raw slice behavior');
}

must(router, 'SOT_ROUTER_MATRIX_UPDATED_THROUGH_005C_R25');
must(router, 'SOT_ROUTER_UPDATED_THROUGH_005C_R25');
must(router, 'LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md');

const diffNames = execFileSync('git', ['diff', '--name-only'], { cwd: root }).toString().trim().split(/\r?\n/).filter(Boolean);
const allowed = new Set([
  'tests/lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.test.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r25-runtime-adoption-behavior-diff.cjs',
  'package.json',
  '_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md',
]);

const forbiddenDiffs = diffNames.filter((name) => !allowed.has(name));
if (forbiddenDiffs.length > 0) {
  throw new Error('Forbidden app diff in R25:\n' + forbiddenDiffs.join('\n'));
}

console.log('LF-PROD-SOT-005C-R25 guard PASS');
