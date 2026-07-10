const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const obsidianRoot = path.join(root, '..', '00_OBSIDIAN_VAULT');

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

const tasks = read('src/pages/TasksStable.tsx');
const facade = read('src/lib/source-of-truth/task-display-status.ts');
const pkg = read('package.json');
const r25Report = read('_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md');
const r26Report = read('_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md');
const r26Test = read('tests/lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.test.cjs');
const r25Map = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md');
const r26Map = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md');
const router = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md');

must(r25Map, 'R26_ALLOWED: YES');
mustNot(r25Map, 'SAFE_SECOND_HELPER:');
mustNot(r25Map, 'safe second helper');
must(r25Report, 'R26_ALLOWED: YES');

must(tasks, "getTaskStableGroupDateKeyCompat } from '../lib/source-of-truth/task-display-status';");
must(tasks, 'function getTaskDateKey(task: any)');
must(getFunctionBody(tasks, 'getTaskDateKey'), 'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));');
must(tasks, 'function isTaskDone(task: any)');
must(tasks, 'function isTaskOverdue(task: any)');
must(tasks, 'function isTaskToday(task: any)');
must(tasks, 'function getTaskGroupId(task: any): TaskGroupId');
must(tasks, 'function buildTaskGroups(tasksToGroup: any[])');
must(getFunctionBody(tasks, 'buildTaskGroups'), 'byId.get(getTaskGroupId(task))?.tasks.push(task);');

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
must(facade, 'export function isTaskStableGroupClosedCompat');
must(facade, 'export function isTaskStableGroupOverdueCompat');
must(facade, 'export function getTaskStableGroupIdCompat');

for (const doc of [r26Report, r26Map]) {
  must(doc, 'R26: STOP_NO_SAFE_SECOND_HELPER');
  must(doc, 'RUNTIME_CHANGED: NO');
  must(doc, 'TASKSSTABLE_REWIRED: NO');
  must(doc, 'BUILD_TASK_GROUPS_REWIRED: NO');
  must(doc, 'No runtime change was made.');
  must(doc, 'R25 map allows R26 but does not name a safe second helper.');
}

must(pkg, '"verify:lf-prod-sot-005c-r26"');
must(r26Test, 'R26 stops because R25 does not name a safe second helper');
must(router, 'SOT_ROUTER_MATRIX_UPDATED_THROUGH_005C_R26');
must(router, 'SOT_ROUTER_UPDATED_THROUGH_005C_R26');
must(router, 'LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md');

const diffNames = execFileSync('git', ['diff', '--name-only'], { cwd: root }).toString().trim().split(/\r?\n/).filter(Boolean);
const allowed = new Set([
  'tests/lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.test.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.cjs',
  'package.json',
  '_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md',
]);

const forbiddenDiffs = diffNames.filter((name) => !allowed.has(name));
if (forbiddenDiffs.length > 0) {
  throw new Error('Forbidden app diff in R26:\n' + forbiddenDiffs.join('\n'));
}

console.log('LF-PROD-SOT-005C-R26 guard PASS');
