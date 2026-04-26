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

test('Today quick snooze actions are not nested native buttons', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  assert.match(component, /role="button"/);
  assert.match(component, /data-today-quick-snooze-action=\{option\.key\}/);
  assert.match(component, /data-today-quick-snooze-edit="true"/);
  assert.doesNotMatch(component, /<button\b/);
  assert.doesNotMatch(component, /<\/button>/);
});

test('Today quick snooze actions stop parent card click and default behavior', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  assert.match(component, /const stopInteractiveEvent = \(event: any\) =>/);
  assert.match(component, /event\.preventDefault\(\)/);
  assert.match(component, /event\.stopPropagation\(\)/);
  assert.match(component, /onPointerDown=\{stopInteractiveEvent\}/);
  assert.match(component, /onMouseDown=\{stopInteractiveEvent\}/);
  assert.match(component, /onTouchStart=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(component, /onPointerUp=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(component, /pointer-events-auto/);
  assert.match(component, /z-50/);
});

test('Today quick snooze keeps edit and keyboard access', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractComponent(source);

  assert.match(component, /handleEditAction/);
  assert.match(component, /onEdit\?\.\(entry\)/);
  assert.match(component, /handleKeyboardAction/);
  assert.match(component, /event\.key !== 'Enter'/);
  assert.match(component, /tabIndex=\{isPending \? -1 : 0\}/);
  assert.match(component, /Edytuj zadanie lub wydarzenie/);
});
