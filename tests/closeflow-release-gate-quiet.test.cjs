const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('package exposes quiet CloseFlow release verification script', () => {
  const pkg = JSON.parse(read('package.json'));

  assert.equal(pkg.scripts['verify:closeflow:quiet'], 'node scripts/closeflow-release-check-quiet.cjs');
});

test('quiet release gate keeps output compact and prints details only on failure', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(source, /function runQuiet/);
  assert.match(source, /console\.log\('OK ' \+ label\)/);
  assert.match(source, /if \(result\.status !== 0\)/);
  assert.match(source, /if \(result\.stdout\) console\.error\(result\.stdout\)/);
  assert.match(source, /if \(result\.stderr\) console\.error\(result\.stderr\)/);
});

test('quiet release gate runs build and core regression tests', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(source, /CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13/);
  assert.match(source, /scripts\/closeflow-vite-build-runner\.mjs/);
  assert.equal(source.includes("runNpmScript('production build', 'build');"), false);
  assert.match(source, /calendar-entry-relation-links\.test\.cjs/);
  assert.match(source, /today-entry-relation-links\.test\.cjs/);
  assert.match(source, /today-calendar-activity-logging\.test\.cjs/);
  assert.match(source, /activity-command-center\.test\.cjs/);
  assert.match(source, /tests\/lead-service-mode-v1\.test\.cjs/);
  assert.match(source, /panel-delete-actions-v1\.test\.cjs/);
  assert.match(source, /case-lifecycle-v1-foundation\.test\.cjs/);
  assert.match(source, /cases-v1-lifecycle-command-board\.test\.cjs/);
  assert.match(source, /case-detail-v1-command-center\.test\.cjs/);
  assert.match(source, /client-detail-v1-operational-center\.test\.cjs/);
  assert.match(source, /today-v1-final-action-board\.test\.cjs/);
  assert.match(source, /today-priority-reasons-runtime\.test\.cjs/);
  assert.match(source, /lead-next-action-title-not-null\.test\.cjs/);
});

test('quiet release gate documentation exists', () => {
  const doc = read('docs/CLOSEFLOW_RELEASE_GATE_QUIET_2026-04-24.md');

  assert.match(doc, /verify:closeflow:quiet/);
  assert.match(doc, /build albo test/);
});



test('quiet release gate includes Cases FileText runtime guard', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(source, /cases-filetext-runtime\.test\.cjs/);
});
