const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, file + '\n' + result.stdout + result.stderr);
}
test('Stage79 checker and quiet runner are syntactically valid', () => {
  nodeCheck('scripts/check-stage79-today-task-done-action.cjs');
  nodeCheck('scripts/closeflow-release-check-quiet.cjs');
});
test('RowLink owns task done action without route-only custom event dependency', () => {
  const text = read('src/pages/TodayStable.tsx');
  assert.ok(text.includes('normalizedStage79TaskId'));
  assert.ok(text.includes('markStage79TaskDoneFromRow'));
  assert.ok(text.includes("status: 'done'"));
  assert.ok(text.includes('updateTaskInSupabase'));
  assert.ok(text.includes('data-stage79-task-done-action'));
  assert.ok(text.includes('setStage79TaskDoneLocal(true)'));
});
test('Stage79 guard passes current repo and is wired into package scripts', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage79-today-task-done-action.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage79-today-task-done-action'], 'node scripts/check-stage79-today-task-done-action.cjs');
  assert.equal(pkg.scripts['test:stage79-today-task-done-action'], 'node --test tests/stage79-today-task-done-action.test.cjs');
});
