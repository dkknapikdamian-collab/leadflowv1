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

test('Today quick snooze uses real buttons with pointer and click fallback', () => {
  const source = read('src/pages/Today.tsx');

  expectText(source, 'data-today-quick-snooze-action={option.key}');
  expectText(source, 'type="button"');
  expectText(source, 'onPointerUp={(event) => handleSnoozeAction(event, option.key)}');
  expectText(source, 'onClick={(event) => handleSnoozeAction(event, option.key)}');
  expectText(source, 'quickActionLockRef');
});

test('Today quick snooze edit uses same reliable action path', () => {
  const source = read('src/pages/Today.tsx');

  expectText(source, 'data-today-quick-snooze-edit="true"');
  expectText(source, 'onPointerUp={handleEditAction}');
  expectText(source, 'onClick={handleEditAction}');
});
