const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

function rejectText(source, text) {
  assert.ok(!source.includes(text), 'Unexpected text: ' + text);
}

test('Layout brand label uses compact CloseFlow name', () => {
  const layout = read('src/components/Layout.tsx');

  expectText(layout, 'CloseFlow');
  rejectText(layout, 'Close Flow');
  expectText(layout, 'CheckCircle2');
});

test('release gates include layout brand label regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  expectText(quietGate, 'tests/layout-brand-label.test.cjs');
  expectText(fullGate, 'tests/layout-brand-label.test.cjs');
});
