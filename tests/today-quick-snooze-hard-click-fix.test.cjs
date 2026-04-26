const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractComponent(source) {
  const start = source.indexOf('function TodayEntrySnoozeBar({');
  const end = source.indexOf('export default function Today() {');

  assert.ok(start > -1, 'TodayEntrySnoozeBar start missing');
  assert.ok(end > start, 'TodayEntrySnoozeBar end missing');

  return source.slice(start, end);
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

test('Today quick snooze actions use native buttons with safe parent isolation', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  expectText(component, 'type="button"');
  expectText(component, 'role="button"');
  expectText(component, 'data-today-quick-snooze-action={option.key}');
  expectText(component, 'data-today-quick-snooze-edit="true"');
  expectText(component, 'pointer-events-auto');
  expectText(component, 'z-50');
});

test('Today quick snooze actions stop parent card click and default behavior', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  expectText(component, 'const stopInteractiveEvent = (event: any) =>');
  expectText(component, 'event.preventDefault()');
  expectText(component, 'event.stopPropagation()');
  expectText(component, 'onPointerDown={stopInteractiveEvent}');
  expectText(component, 'onMouseDown={stopInteractiveEvent}');
  expectText(component, 'onTouchStart={(event) => event.stopPropagation()}');
});

test('Today quick snooze actions keep pointer, click and keyboard access', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  expectText(component, 'onPointerUp={(event) => handleSnoozeAction(event, option.key)}');
  expectText(component, 'onClick={(event) => handleSnoozeAction(event, option.key)}');
  expectText(component, 'onPointerUp={handleEditAction}');
  expectText(component, 'onClick={handleEditAction}');
  expectText(component, 'handleKeyboardAction');
  expectText(component, "event.key !== 'Enter'");
  expectText(component, 'tabIndex={isPending ? -1 : 0}');
  expectText(component, 'Edytuj zadanie lub wydarzenie');
});

test('Today quick snooze has duplicate action guard', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  expectText(component, 'quickActionLockRef');
  expectText(component, 'releaseQuickActionLock');
  expectText(component, 'runQuickAction');
});
