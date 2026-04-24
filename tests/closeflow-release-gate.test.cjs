const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('package exposes CloseFlow release verification script', () => {
  const pkg = JSON.parse(read('package.json'));

  assert.equal(pkg.scripts['verify:closeflow'], 'node scripts/closeflow-release-check.cjs');
});

test('release gate runs production build before targeted tests', () => {
  const source = read('scripts/closeflow-release-check.cjs');

  assert.match(source, /run\('production build', 'npm\.cmd', \['run', 'build'\]\)/);
});

test('release gate includes calendar and today restore regression tests', () => {
  const source = read('scripts/closeflow-release-check.cjs');

  assert.match(source, /calendar-completed-event-behavior\.test\.cjs/);
  assert.match(source, /calendar-restore-completed-entries\.test\.cjs/);
  assert.match(source, /today-completed-entries-behavior\.test\.cjs/);
  assert.match(source, /today-restore-completed-label\.test\.cjs/);
});

test('release gate includes lead client path and next action guards', () => {
  const source = read('scripts/closeflow-release-check.cjs');

  assert.match(source, /lead-next-action-title-not-null\.test\.cjs/);
  assert.match(source, /lead-client-path-contract\.test\.cjs/);
  assert.match(source, /client-relation-command-center\.test\.cjs/);
});

test('release gate documentation exists', () => {
  const doc = read('docs/CLOSEFLOW_RELEASE_GATE_2026-04-24.md');

  assert.match(doc, /npm\.cmd run verify:closeflow/);
  assert.match(doc, /nie robimy commita/);
  assert.match(doc, /dev-rollout-freeze/);
});
