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

test('Stage113 CloseFlow logo source contract uses inline CF source of truth', () => {
  const layout = read('src/components/Layout.tsx');

  expectText(layout, 'className="brand-logo"');
  expectText(layout, 'CF');
  expectText(layout, '<strong>CloseFlow</strong>');
  expectText(layout, 'aria-label="CloseFlow - przejdź do Dziś"');
  expectText(layout, 'className="mobile-brand"');

  rejectText(layout, 'Close Flow');
  rejectText(layout, '<img');
  rejectText(layout, 'logo.svg');
  rejectText(layout, 'logo.png');
});

test('Stage113 CloseFlow logo test remains required by quiet release gate', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

  expectText(quietGate, 'tests/stage113-closeflow-logo-source-contract.test.cjs');
});
