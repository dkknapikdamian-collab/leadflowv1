const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, file + '\n' + result.stdout + result.stderr);
}
test('Stage80 checker is syntactically valid', () => {
  nodeCheck('scripts/check-stage80-today-task-done-desktop-visibility.cjs');
});
test('Stage80 guard passes current repo', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage80-today-task-done-desktop-visibility.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('Today RowLink exposes desktop-visible task done action', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.ok(today.includes('cf-today-row-actions'));
  assert.ok(today.includes('cf-today-task-done-button'));
  assert.ok(today.includes('isStage80TaskBadge'));
  assert.ok(today.includes("status: 'done'"));
});
test('Stage80 CSS forces desktop visibility instead of mobile-only action', () => {
  const css = read('src/styles/stage80-today-task-done-desktop-visibility.css');
  assert.ok(css.includes('@media (min-width: 640px)'));
  assert.ok(css.includes('display: inline-flex !important'));
  assert.ok(css.includes('visibility: visible !important'));
  assert.ok(css.includes('opacity: 1 !important'));
});
