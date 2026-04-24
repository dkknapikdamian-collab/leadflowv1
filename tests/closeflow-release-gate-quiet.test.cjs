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
  assert.match(source, /console\.log\('âś“ ' \+ label\)/);
  assert.match(source, /if \(result\.status !== 0\)/);
  assert.match(source, /if \(result\.stdout\) console\.error\(result\.stdout\)/);
  assert.match(source, /if \(result\.stderr\) console\.error\(result\.stderr\)/);
});

test('quiet release gate runs build and core regression tests', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(source, /runNpmScript\('production build', 'build'\)/);
  assert.match(source, /calendar-entry-relation-links\.test\.cjs/);
  assert.match(source, /today-entry-relation-links\.test\.cjs/);
  assert.match(source, /today-calendar-activity-logging\.test\.cjs/);
  assert.match(source, /activity-command-center\.test\.cjs/);
  assert.match(source, /lead-next-action-title-not-null\.test\.cjs/);
});

test('quiet release gate documentation exists', () => {
  const doc = read('docs/CLOSEFLOW_RELEASE_GATE_QUIET_2026-04-24.md');

  assert.match(doc, /verify:closeflow:quiet/);
  assert.match(doc, /PeĹ‚ny log pokazuje dopiero wtedy/);
});
