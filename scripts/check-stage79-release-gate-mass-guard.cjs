const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE79_RELEASE_GATE_MASS_GUARD_FAIL: ' + message); process.exit(1); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail('node --check failed for ' + file + '\n' + result.stdout + result.stderr);
}
for (const file of [
  'scripts/check-stage79-today-task-done-action.cjs',
  'tests/stage79-today-task-done-action.test.cjs',
  'scripts/check-stage79-release-gate-mass-guard.cjs',
  'tests/stage79-release-gate-mass-guard.test.cjs',
  'scripts/closeflow-release-check-quiet.cjs',
]) {
  if (fs.existsSync(path.join(root, file))) nodeCheck(file);
}
const pkg = JSON.parse(read('package.json'));
for (const [name, value] of Object.entries(pkg.scripts || {})) {
  if (name.startsWith('test:stage') && typeof value === 'string' && !value.includes('node --test tests/')) {
    fail('stage test script should point to tests/*.test.cjs: ' + name);
  }
}
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
if (quiet.includes("'test:stage")) fail('quiet requiredTests contains npm script name instead of test path');
if (quiet.includes("'check:stage")) fail('quiet requiredTests contains check script name instead of test path');
for (const required of [
  'tests/stage79-today-task-done-action.test.cjs',
  'tests/stage79-release-gate-mass-guard.test.cjs',
]) {
  if (!quiet.includes(required)) fail('quiet gate missing ' + required);
}
const today = read('src/pages/TodayStable.tsx');
if (!today.includes('data-stage79-task-done-action')) fail('TodayStable missing Stage79 DOM marker');
if (!today.includes("status: 'done'")) fail('TodayStable missing done status write');
console.log('OK stage79 release gate mass guard');
