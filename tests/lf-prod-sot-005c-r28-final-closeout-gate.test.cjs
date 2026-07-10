const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(
  vault,
  '10_PROJEKTY',
  'CloseFlow_Lead_App',
  '04_NAPRAWA_ZRODLA_PRAWDY',
);

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function readMap(name) {
  return fs.readFileSync(path.join(mapBase, name), 'utf8');
}

test('R28 final closeout guard passes', () => {
  execFileSync(
    process.execPath,
    ['scripts/guards/verify-lf-prod-sot-005c-r28-final-closeout-gate.cjs'],
    { cwd: root, stdio: 'pipe' },
  );
});

test('R28 package alias and prior aliases are present', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const suffix of ['r21', 'r23', 'r24', 'r25', 'r26', 'r27', 'r28']) {
    assert.equal(
      typeof pkg.scripts[`verify:lf-prod-sot-005c-${suffix}`],
      'string',
      suffix,
    );
  }
});

test('R28 closes the TasksStable lineage with allowed local exceptions', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md');
  const map = readMap('LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE_MAP.md');

  for (const doc of [report, map]) {
    assert.ok(doc.includes('R28_FINAL_STATUS: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS'));
    assert.ok(doc.includes('R24_ADOPTED_HELPER: getTaskDateKey -> getTaskStableGroupDateKeyCompat'));
    assert.ok(doc.includes('R25_BEHAVIOR_DIFF: NO_UNINTENTIONAL_DRIFT'));
    assert.ok(doc.includes('R26_FINAL: STOP_NO_SAFE_SECOND_HELPER'));
    assert.ok(doc.includes('R27_FINAL: PASS_DECISION_GATE'));
    assert.ok(doc.includes('BUILD_TASK_GROUPS: LOCAL_ALLOWED_EXCEPTION'));
    assert.ok(doc.includes('GET_TASK_GROUP_ID: LOCAL_ALLOWED_EXCEPTION'));
  }
});

test('R28 does not change TasksStable or runtime domains', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const report = read('_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md');

  assert.ok(tasks.includes('return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));'));
  assert.ok(tasks.includes('function getTaskGroupId(task: any): TaskGroupId'));
  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupClosedCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupOverdueCompat'), false);

  assert.ok(report.includes('RUNTIME_CHANGES_IN_R28: NO'));
  assert.ok(report.includes('TASKSSTABLE_CHANGED_IN_R28: NO'));
  assert.ok(report.includes('UI_CSS_SQL_API_CHANGED_IN_R28: NO'));
  assert.ok(report.includes('SUPABASE_CHANGED_IN_R28: NO'));
});

test('R28 records premature G1 without continuing G1 or creating G2', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE.md');
  const map = readMap('LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE_MAP.md');
  const router = readMap('00_MAPY_I_ZALEZNOSCI_SOT.md');

  for (const doc of [report, map]) {
    assert.ok(doc.includes('G1_STATUS: OUT_OF_ORDER_ALREADY_PRESENT'));
    assert.ok(doc.includes('G1_CONTINUATION: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS'));
    assert.ok(doc.includes('G1_ORDER_REPAIR: OUT_OF_ORDER_ALREADY_PRESENT / DO_NOT_CONTINUE_G1_UNTIL_R28_PASS'));
    assert.ok(doc.includes('G2_CREATED: NO'));
  }

  assert.ok(router.includes('SOT_ROUTER_UPDATED_THROUGH_005C_R28'));
  assert.ok(router.includes('G1 status: OUT_OF_ORDER_ALREADY_PRESENT'));
  assert.ok(router.includes('G1 continuation: DO_NOT_CONTINUE_G1_UNTIL_R28_PASS'));
});
