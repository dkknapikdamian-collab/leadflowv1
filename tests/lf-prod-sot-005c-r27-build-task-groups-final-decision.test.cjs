const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('R27 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r27-build-task-groups-final-decision.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R27 keeps buildTaskGroups and getTaskGroupId as local allowed exceptions', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md');
  const map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md');

  for (const doc of [report, map]) {
    assert.ok(doc.includes('R27: PASS_DECISION_GATE'));
    assert.ok(doc.includes('BUILD_TASK_GROUPS_DECISION: LOCAL_ALLOWED_EXCEPTION'));
    assert.ok(doc.includes('GET_TASK_GROUP_ID_DECISION: LOCAL_ALLOWED_EXCEPTION'));
    assert.ok(doc.includes('NEXT_STAGE_REQUIRED: NO'));
  }
});

test('R27 helper matrix marks adopted, local exception, and blocked helpers', () => {
  const report = read('_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md');

  const expectedTokens = [
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
  ];

  for (const token of expectedTokens) {
    assert.ok(report.includes(token), token);
  }
});

test('R27 makes no TasksStable runtime change and records R28 inputs', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const report = read('_project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md');
  const map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md');

  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.ok(tasks.includes('byId.get(getTaskGroupId(task))?.tasks.push(task);'));
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupClosedCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupOverdueCompat'), false);
  assert.ok(report.includes('RUNTIME_CHANGED: NO'));
  assert.ok(report.includes('R28_READS_OBSIDIAN_MAP: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION_MAP.md'));
  assert.ok(report.includes('R28_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R27_TASKS_STABLE_BUILD_TASK_GROUPS_FINAL_DECISION.md'));
  assert.ok(map.includes('R28 must read exactly this map'));
});
