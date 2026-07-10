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

const tasks = read('src/pages/TasksStable.tsx');
const facade = read('src/lib/source-of-truth/task-display-status.ts');
const pkg = read('package.json');
const report = read('_project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md');

must(tasks, "getTaskStableGroupDateKeyCompat } from '../lib/source-of-truth/task-display-status';");
must(tasks, 'function getTaskDateKey(task: any)');

const dateKey = getFunctionBody(tasks, 'getTaskDateKey');
must(dateKey, 'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));');
mustNot(dateKey, 'getTaskMomentRaw(task).slice(0, 10)');

for (const helper of [
  'isTaskDone',
  'isTaskToday',
  'isTaskOverdue',
  'getTaskGroupId',
  'buildTaskGroups',
]) {
  must(tasks, 'function ' + helper);
}

const done = getFunctionBody(tasks, 'isTaskDone');
const today = getFunctionBody(tasks, 'isTaskToday');
const overdue = getFunctionBody(tasks, 'isTaskOverdue');
const group = getFunctionBody(tasks, 'getTaskGroupId');
const buildGroups = getFunctionBody(tasks, 'buildTaskGroups');

must(today, 'return getTaskDateKey(task) === localDateKey();');
must(overdue, 'const dateKey = getTaskDateKey(task);');
must(overdue, '!isTaskDone(task)');
must(group, "if (isTaskDone(task)) return 'done';");
must(group, "if (isTaskOverdue(task)) return 'overdue';");
must(group, "if (isTaskToday(task)) return 'today';");
must(group, "if (!raw) return 'no_due';");
must(group, "return 'upcoming';");
must(buildGroups, 'byId.get(getTaskGroupId(task))?.tasks.push(task);');

for (const body of [done, today, overdue, group, buildGroups]) {
  mustNot(body, 'isTaskStableGroupClosedCompat');
  mustNot(body, 'isTaskStableGroupOverdueCompat');
  mustNot(body, 'getTaskStableGroupIdCompat');
}

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
must(pkg, '"verify:lf-prod-sot-005c-r24"');

must(report, 'R24: PASS');
must(report, 'RUNTIME_CHANGED: YES');
must(report, 'TASKSSTABLE_REWIRED_HELPER: getTaskDateKey');
must(report, 'SOT_COMPAT_HELPER: getTaskStableGroupDateKeyCompat');
must(report, 'BUILD_TASK_GROUPS_REWIRED: NO');
must(report, 'UI_CSS_SQL_API_CHANGED: NO');
must(report, 'R25_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md');

const diffNames = execFileSync('git', ['diff', '--name-only'], { cwd: root }).toString().trim().split(/\r?\n/).filter(Boolean);
const allowed = new Set([
  'src/pages/TasksStable.tsx',
  'tests/lf-prod-sot-005c-r24-first-narrow-runtime-adoption.test.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r24-first-narrow-runtime-adoption.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.cjs',
  'tests/lf-prod-sot-005c-r21-tasks-stable-group-status-date-helpers-contract.test.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r23-task-display-helper-compat.cjs',
  'tests/lf-prod-sot-005c-r23-task-display-helper-compat.test.cjs',
  'package.json',
  '_project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md',
]);

const forbiddenDiffs = diffNames.filter((name) => !allowed.has(name));
if (forbiddenDiffs.length > 0) {
  throw new Error('Forbidden app diff in R24:\n' + forbiddenDiffs.join('\n'));
}

console.log('LF-PROD-SOT-005C-R24 guard PASS');
