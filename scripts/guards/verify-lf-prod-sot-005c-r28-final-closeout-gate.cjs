const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(
  vault,
  '10_PROJEKTY',
  'CloseFlow_Lead_App',
  '04_NAPRAWA_ZRODLA_PRAWDY',
);

function readApp(rel) {
  const target = path.join(root, rel);
  assert.equal(fs.existsSync(target), true, `missing app file: ${rel}`);
  return fs.readFileSync(target, 'utf8');
}

function readMap(name) {
  const target = path.join(mapBase, name);
  assert.equal(fs.existsSync(target), true, `missing Obsidian map: ${name}`);
  return fs.readFileSync(target, 'utf8');
}

function must(text, token, label) {
  assert.equal(text.includes(token), true, `${label}: missing token ${token}`);
}

function mustNot(text, token, label) {
  assert.equal(text.includes(token), false, `${label}: forbidden token ${token}`);
}

function gitNames(args) {
  const output = execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

const pkg = JSON.parse(readApp('package.json'));
const scripts = pkg.scripts || {};
const expectedAliases = [
  'verify:lf-prod-sot-005c-r21',
  'verify:lf-prod-sot-005c-r23',
  'verify:lf-prod-sot-005c-r24',
  'verify:lf-prod-sot-005c-r25',
  'verify:lf-prod-sot-005c-r26',
  'verify:lf-prod-sot-005c-r27',
  'verify:lf-prod-sot-005c-r28',
];

for (const alias of expectedAliases) {
  assert.equal(typeof scripts[alias], 'string', `missing package alias: ${alias}`);
}

assert.equal(
  scripts['verify:lf-prod-sot-005c-r28'],
  'node scripts/guards/verify-lf-prod-sot-005c-r28-final-closeout-gate.cjs && node --test tests/lf-prod-sot-005c-r28-final-closeout-gate.test.cjs',
  'R28 package alias must be exact',
);

const tasks = readApp('src/pages/TasksStable.tsx');
must(tasks, 'getTaskStableGroupDateKeyCompat', 'TasksStable');
must(
  tasks,
  'return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));',
  'TasksStable R24 adoption',
);
must(tasks, 'function getTaskGroupId(task: any): TaskGroupId', 'TasksStable local getTaskGroupId');
must(tasks, 'function buildTaskGroups(tasksToGroup: any[])', 'TasksStable local buildTaskGroups');
must(tasks, 'byId.get(getTaskGroupId(task))?.tasks.push(task);', 'TasksStable local grouping route');
mustNot(tasks, 'getTaskStableGroupIdCompat', 'TasksStable');
mustNot(tasks, 'isTaskStableGroupClosedCompat', 'TasksStable');
mustNot(tasks, 'isTaskStableGroupOverdueCompat', 'TasksStable');

const r24 = readApp('_project/runs/LF-PROD-SOT-005C-R24_TASKS_STABLE_FIRST_NARROW_GROUP_STATUS_DATE_RUNTIME_ADOPTION.md');
must(r24, 'R24: PASS', 'R24 report');
must(r24, 'TASKSSTABLE_REWIRED_HELPER: getTaskDateKey', 'R24 report');
must(r24, 'SOT_COMPAT_HELPER: getTaskStableGroupDateKeyCompat', 'R24 report');
must(r24, 'BUILD_TASK_GROUPS_REWIRED: NO', 'R24 report');

const r25 = readApp('_project/runs/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK.md');
must(r25, 'R25: PASS', 'R25 report');
must(r25, 'BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT', 'R25 report');
must(r25, 'RUNTIME_CHANGED: NO', 'R25 report');
must(r25, 'TASKSSTABLE_REWIRED: NO', 'R25 report');

const r26 = readApp('_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md');
must(r26, 'R26: STOP_NO_SAFE_SECOND_HELPER', 'R26 report');
must(r26, 'RUNTIME_CHANGED: NO', 'R26 report');
must(r26, 'TASKSSTABLE_REWIRED: NO', 'R26 report');
must(r26, 'BUILD_TASK_GROUPS_REWIRED: NO', 'R26 report');

const r27 = readApp('_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md');
must(r27, 'R27: PASS_DECISION_GATE', 'R27 report');
must(r27, 'BUILD_TASK_GROUPS_DECISION: LOCAL_ALLOWED_EXCEPTION', 'R27 report');
must(r27, 'GET_TASK_GROUP_ID_DECISION: LOCAL_ALLOWED_EXCEPTION', 'R27 report');
must(r27, 'NEXT_STAGE_REQUIRED: NO', 'R27 report');

const report = readApp('_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md');
const map = readMap('LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE_MAP.md');
const router = readMap('00_MAPY_I_ZALEZNOSCI_SOT.md');

const commonTokens = [
  'R28_FINAL_STATUS: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS',
  'R24_ADOPTED_HELPER: getTaskDateKey -> getTaskStableGroupDateKeyCompat',
  'R25_BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT',
  'R26_FINAL: STOP_NO_SAFE_SECOND_HELPER',
  'R27_FINAL: PASS_DECISION_GATE',
  'BUILD_TASK_GROUPS: LOCAL_ALLOWED_EXCEPTION',
  'GET_TASK_GROUP_ID: LOCAL_ALLOWED_EXCEPTION',
  'RUNTIME_CHANGES_IN_R28: NO',
  'TASKSSTABLE_CHANGED_IN_R28: NO',
  'UI_CSS_SQL_API_CHANGED_IN_R28: NO',
  'SUPABASE_CHANGED_IN_R28: NO',
  'G1_STATUS: OUT_OF_ORDER_ALREADY_PRESENT',
  'G1_CONTINUATION: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS',
  'G1_ORDER_REPAIR: OUT_OF_ORDER_ALREADY_PRESENT / DO_NOT_CONTINUE_G1_UNTIL_R28_PASS',
  'G2_CREATED: NO',
];

for (const token of commonTokens) {
  must(report, token, 'R28 app report');
  must(map, token, 'R28 Obsidian map');
}

must(router, 'SOT_ROUTER_MATRIX_UPDATED_THROUGH_005C_R28', 'SOT router');
must(router, 'SOT_ROUTER_UPDATED_THROUGH_005C_R28', 'SOT router');
must(router, 'R28 final status: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS', 'SOT router');
must(router, 'G1 status: OUT_OF_ORDER_ALREADY_PRESENT', 'SOT router');
must(router, 'G1 continuation: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS', 'SOT router');
must(router, 'ordering status: OUT_OF_ORDER_ALREADY_PRESENT', 'SOT router');
must(router, 'continuation gate: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS', 'SOT router');

const allowedChanges = new Set([
  'package.json',
  'scripts/guards/verify-lf-prod-sot-005c-r28-final-closeout-gate.cjs',
  'tests/lf-prod-sot-005c-r28-final-closeout-gate.test.cjs',
  '_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md',
]);

const changed = new Set([
  ...gitNames(['diff', '--name-only']),
  ...gitNames(['diff', '--cached', '--name-only']),
]);

for (const file of changed) {
  assert.equal(allowedChanges.has(file), true, `R28 forbidden app change: ${file}`);
}

const tasksWorktreeDiff = execFileSync(
  'git',
  ['diff', '--', 'src/pages/TasksStable.tsx'],
  { cwd: root, encoding: 'utf8' },
);
const tasksCachedDiff = execFileSync(
  'git',
  ['diff', '--cached', '--', 'src/pages/TasksStable.tsx'],
  { cwd: root, encoding: 'utf8' },
);

assert.equal(tasksWorktreeDiff, '', 'TasksStable changed in R28 worktree');
assert.equal(tasksCachedDiff, '', 'TasksStable changed in R28 index');

console.log('LF-PROD-SOT-005C-R28 FINAL CLOSEOUT GATE: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS');
