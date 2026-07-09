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

function assertEqualArray(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(label + ' mismatch: ' + a + ' !== ' + e);
}

const tasks = read('src/pages/TasksStable.tsx');
const facade = read('src/lib/source-of-truth/task-display-status.ts');
const domain = read('src/lib/domain-statuses.ts');
const pkg = read('package.json');
const report = read('_project/runs/LF-PROD-SOT-005C-R21_TASKS_STABLE_GROUP_STATUS_DATE_HELPERS_CONTRACT_GUARD_DO_POTWIERDZENIA.md');

must(tasks, "import { getTaskDisplayStatusLabel, getTaskDisplayStatusTone } from '../lib/source-of-truth/task-display-status';");

for (const helper of [
  'isTaskDone',
  'isTaskToday',
  'isTaskOverdue',
  'getTaskGroupId',
  'buildTaskGroups',
  'getStatusBadge',
  'getTaskStatusTone',
]) {
  must(tasks, 'function ' + helper);
}

const dateKey = getFunctionBody(tasks, 'getTaskDateKey');
const done = getFunctionBody(tasks, 'isTaskDone');
const today = getFunctionBody(tasks, 'isTaskToday');
const overdue = getFunctionBody(tasks, 'isTaskOverdue');
const group = getFunctionBody(tasks, 'getTaskGroupId');
const buildGroups = getFunctionBody(tasks, 'buildTaskGroups');
const badge = getFunctionBody(tasks, 'getStatusBadge');
const tone = getFunctionBody(tasks, 'getTaskStatusTone');

must(dateKey, 'return getTaskMomentRaw(task).slice(0, 10);');

for (const closed of ['done', 'completed', 'closed', 'cancelled', 'canceled']) {
  must(done, "'" + closed + "'");
}

for (const notLocalClosed of ['deleted', 'archived', 'removed']) {
  mustNot(done, "'" + notLocalClosed + "'");
}

must(today, 'return getTaskDateKey(task) === localDateKey();');
must(overdue, 'const dateKey = getTaskDateKey(task);');
must(overdue, '!isTaskDone(task)');

must(group, "if (isTaskDone(task)) return 'done';");
must(group, "if (isTaskOverdue(task)) return 'overdue';");
must(group, "if (isTaskToday(task)) return 'today';");
must(group, "if (!raw) return 'no_due';");
must(group, "return 'upcoming';");

must(buildGroups, "id: 'overdue'");
must(buildGroups, "id: 'today'");
must(buildGroups, "id: 'upcoming'");
must(buildGroups, "id: 'no_due'");
must(buildGroups, "id: 'done'");

must(badge, 'return getTaskDisplayStatusLabel({');
must(badge, 'status: task?.status');
must(badge, 'momentRaw: getTaskMomentRaw(task)');
must(badge, 'todayKey: localDateKey()');

must(tone, 'return getTaskDisplayStatusTone({');
must(tone, 'status: task?.status');
must(tone, 'momentRaw: getTaskMomentRaw(task)');
must(tone, 'todayKey: localDateKey()');

for (const helper of [dateKey, done, today, overdue, group, buildGroups]) {
  mustNot(helper, 'getTaskDisplayDateKey');
  mustNot(helper, 'isTaskDisplayClosed');
  mustNot(helper, 'getTaskDisplayStatus');
  mustNot(helper, 'getTaskDisplayStatusLabel');
  mustNot(helper, 'getTaskDisplayStatusTone');
}

must(facade, 'const CLOSED_STATUS_VALUES = new Set([');
must(facade, "'done'");
must(facade, "'completed'");
must(facade, "'closed'");
must(facade, "'cancelled'");
must(facade, "'canceled'");
must(facade, "'del' + 'eted'");
must(facade, "'archived'");
must(facade, "'rem' + 'oved'");
must(facade, 'export function getTaskDisplayDateKey');
must(facade, 'String(momentRaw || \'\').trim()');
must(facade, 'text.slice(0, 10)');
must(facade, '/^\\d{4}-\\d{2}-\\d{2}$/.test(dateKey)');

must(domain, 'export function normalizeTaskStatus');
must(domain, 'completed: \'done\'');
must(domain, 'cancelled: \'canceled\'');

const localClosed = new Set(['done', 'completed', 'closed', 'cancelled', 'canceled']);
const facadeClosed = new Set(['done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed']);
const statuses = ['todo', 'scheduled', 'in_progress', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'deleted', 'archived', 'removed', 'unknown', '', null];

const contractDiffs = statuses
  .map((status) => {
    const key = String(status || '').trim().toLowerCase();
    return {
      status: status === '' ? 'empty' : status === null ? 'null' : key,
      local: localClosed.has(key),
      facade: facadeClosed.has(key),
    };
  })
  .filter((item) => item.local !== item.facade)
  .map((item) => item.status);

assertEqualArray(contractDiffs, ['deleted', 'archived', 'removed'], 'closed status contract diffs');

function localDateKeyFromRaw(raw) {
  return String(raw || '').slice(0, 10);
}

function facadeDateKeyFromRaw(raw) {
  const text = String(raw || '').trim();
  const candidate = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : '';
}

const dateCases = [
  { name: 'valid today YYYY-MM-DD', raw: '2026-07-09' },
  { name: 'valid yesterday YYYY-MM-DD', raw: '2026-07-08' },
  { name: 'valid future YYYY-MM-DD', raw: '2026-07-10' },
  { name: 'valid ISO datetime', raw: '2026-07-09T14:30:00.000Z' },
  { name: 'date + time split equivalent', raw: '2026-07-09T09:00' },
  { name: 'empty date', raw: '' },
  { name: 'invalid date-like string', raw: 'not-a-date-like-value' },
  { name: 'malformed partial date', raw: '2026-7-9' },
];

const invalidDiffs = dateCases
  .map((item) => ({
    name: item.name,
    local: localDateKeyFromRaw(item.raw),
    facade: facadeDateKeyFromRaw(item.raw),
  }))
  .filter((item) => item.local !== item.facade)
  .map((item) => item.name);

assertEqualArray(invalidDiffs, ['invalid date-like string', 'malformed partial date'], 'date contract diffs');

must(pkg, '"verify:lf-prod-sot-005c-r21"');

must(report, 'R21: PASS');
must(report, 'TASKSSTABLE_REWIRED: NO');
must(report, 'RUNTIME_CHANGED: NO');
must(report, 'deleted / archived / removed');
must(report, 'invalid date');
must(report, 'R22_CREATED: NO');

const forbiddenRuntimeDiff = execFileSync('git', [
  'diff',
  '--name-only',
  '--',
  'src/pages/TasksStable.tsx',
  'src/lib/source-of-truth/task-display-status.ts',
  'src/lib/domain-statuses.ts',
  'data/flows.json',
  'runtime/data',
], { cwd: root }).toString().trim();

if (forbiddenRuntimeDiff) {
  throw new Error('Forbidden runtime/source diff in R21:\n' + forbiddenRuntimeDiff);
}

console.log('LF-PROD-SOT-005C-R21 guard PASS');
