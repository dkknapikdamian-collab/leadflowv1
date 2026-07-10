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
const report = read('_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md');
const test = read('tests/lf-prod-sot-005c-r27-build-task-groups-final-decision.test.cjs');
const r26Report = read('_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md');
const r26Map = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md');
const map = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md');
const router = readObsidian('10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md');

must(r26Report, 'R26: STOP_NO_SAFE_SECOND_HELPER');
must(r26Report, 'BUILD_TASK_GROUPS_REWIRED: NO');
must(r26Map, 'R27 must read exactly this map');

must(tasks, 'function getTaskDateKey(task: any)');
must(getFunctionBody(tasks, 'getTaskDateKey'), 'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));');
must(tasks, 'function isTaskDone(task: any)');
must(tasks, 'function isTaskToday(task: any)');
must(tasks, 'function isTaskOverdue(task: any)');
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

for (const doc of [report, map]) {
  must(doc, 'R27: PASS_DECISION_GATE');
  must(doc, 'RUNTIME_CHANGED: NO');
  must(doc, 'BUILD_TASK_GROUPS_DECISION: LOCAL_ALLOWED_EXCEPTION');
  must(doc, 'GET_TASK_GROUP_ID_DECISION: LOCAL_ALLOWED_EXCEPTION');
  must(doc, 'NEXT_STAGE_REQUIRED: NO');
  must(doc, 'No runtime change was made.');
}

for (const token of [
  'getTaskDisplayStatusLabel: SOT_ADOPTED',
  'getTaskDisplayStatusTone: SOT_ADOPTED',
  'getTaskDateKey: SOT_ADOPTED',
  'getTaskStableGroupDateKeyCompat: SOT_ADOPTED',
  'isTaskDone: LOCAL_ALLOWED_EXCEPTION',
  'isTaskToday: LOCAL_ALLOWED_EXCEPTION',
  'isTaskOverdue: LOCAL_ALLOWED_EXCEPTION',
  'getTaskGroupId: LOCAL_ALLOWED_EXCEPTION',
  'buildTaskGroups: LOCAL_ALLOWED_EXCEPTION',
  'isTaskStableGroupClosedCompat: BLOCKED_BY_BEHAVIOR_RISK',
  'isTaskStableGroupOverdueCompat: BLOCKED_BY_BEHAVIOR_RISK',
  'getTaskStableGroupIdCompat: BLOCKED_BY_BEHAVIOR_RISK',
]) {
  must(report, token);
  must(map, token);
}

must(pkg, '"verify:lf-prod-sot-005c-r27"');
must(test, 'R27 keeps buildTaskGroups and getTaskGroupId as local allowed exceptions');
must(router, 'SOT_ROUTER_MATRIX_UPDATED_THROUGH_005C_R27');
must(router, 'SOT_ROUTER_UPDATED_THROUGH_005C_R27');
must(router, 'LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md');

const diffNames = execFileSync('git', ['diff', '--name-only'], { cwd: root }).toString().trim().split(/\r?\n/).filter(Boolean);
const allowed = new Set([
  'tests/lf-prod-sot-005c-r27-build-task-groups-final-decision.test.cjs',
  'scripts/guards/verify-lf-prod-sot-005c-r27-build-task-groups-final-decision.cjs',
  'package.json',
  '_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md',
]);

const forbiddenDiffs = diffNames.filter((name) => !allowed.has(name));
if (forbiddenDiffs.length > 0) {
  throw new Error('Forbidden app diff in R27:\n' + forbiddenDiffs.join('\n'));
}

console.log('LF-PROD-SOT-005C-R27 guard PASS');
