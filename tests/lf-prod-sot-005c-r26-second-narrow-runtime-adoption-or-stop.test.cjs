const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('R26 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r26-second-narrow-runtime-adoption-or-stop.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R26 stops because R25 does not name a safe second helper', () => {
  const r25Map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R25_TASKS_STABLE_RUNTIME_ADOPTION_AUTO_REVERIFY_AND_BEHAVIOR_DIFF_CHECK_MAP.md');
  const r26Report = read('_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md');
  const r26Map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md');

  assert.ok(r25Map.includes('R26_ALLOWED: YES'));
  assert.equal(r25Map.includes('SAFE_SECOND_HELPER:'), false);
  assert.ok(r26Report.includes('R26: STOP_NO_SAFE_SECOND_HELPER'));
  assert.ok(r26Map.includes('R26: STOP_NO_SAFE_SECOND_HELPER'));
});

test('R26 does not perform a second TasksStable runtime rewire', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  assert.ok(tasks.includes('return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));'));
  assert.equal((tasks.match(/getTaskStableGroupDateKeyCompat\(/g) || []).length, 1);
  assert.equal(tasks.includes('isTaskStableGroupClosedCompat'), false);
  assert.equal(tasks.includes('isTaskStableGroupOverdueCompat'), false);
  assert.equal(tasks.includes('getTaskStableGroupIdCompat'), false);
});

test('R26 keeps buildTaskGroups local and records R27 inputs', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const r26Report = read('_project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md');
  const r26Map = read('../00_OBSIDIAN_VAULT/10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md');

  assert.ok(tasks.includes('function buildTaskGroups(tasksToGroup: any[])'));
  assert.ok(tasks.includes('byId.get(getTaskGroupId(task))?.tasks.push(task);'));
  assert.ok(r26Report.includes('R27_READS_OBSIDIAN_MAP: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP_MAP.md'));
  assert.ok(r26Report.includes('R27_READS_APP_REPORT: _project/runs/LF-PROD-SOT-005C-R26_TASKS_STABLE_SECOND_NARROW_RUNTIME_ADOPTION_OR_STOP.md'));
  assert.ok(r26Map.includes('R27 must read exactly this map'));
});
