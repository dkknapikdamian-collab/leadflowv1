const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today quick snooze section has Polish labels with correct characters', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /Szybko odłóż:/);
  assert.match(source, /label: 'Przyszły tydzień'/);
  assert.match(source, /description: 'Odłóż o godzinę\.'/);
  assert.match(source, /description: 'Odłóż na przyszły tydzień\.'/);

  assert.doesNotMatch(source, /Odloz/);
  assert.doesNotMatch(source, /Przyszly tydzien/);
});

test('Today quick snooze buttons stop parent click handlers and remain clickable', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /function TodayEntrySnoozeBar/);
  assert.match(source, /const stopInteractiveEvent = \(event: any\)/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /onPointerDown=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(source, /onMouseDown=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(source, /onClick=\{\(event\) => handleSnoozeClick\(event, option\.key\)\}/);
  assert.match(source, /void onSnooze\(entry, optionKey\)/);
  assert.match(source, /pointer-events-auto/);
});

test('Today quick snooze section exposes edit action', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /onEdit\?: \(entry: any\) => void/);
  assert.match(source, /const handleEditClick = \(event: any\)/);
  assert.match(source, /onEdit\?\.\(entry\)/);
  assert.match(source, />\s*Edytuj\s*<\/button>/);
  assert.match(source, /title="Edytuj zadanie lub wydarzenie"/);
  assert.match(source, /onEdit=\{openPreviewEntry\}/);
});
