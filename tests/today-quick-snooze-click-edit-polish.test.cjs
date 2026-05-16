const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractTodayEntrySnoozeBar(source) {
  const start = source.indexOf('function TodayEntrySnoozeBar({');
  const end = source.indexOf('export default function Today() {');

  assert.ok(start > -1, 'TodayEntrySnoozeBar component is missing');
  assert.ok(end > start, 'TodayEntrySnoozeBar component end marker is missing');

  return source.slice(start, end);
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

function expectPattern(source, pattern, label) {
  assert.ok(pattern.test(source), 'Missing pattern: ' + label);
}

function rejectPattern(source, pattern, label) {
  assert.ok(!pattern.test(source), 'Unexpected pattern: ' + label);
}

test('Today quick snooze section has Polish labels with correct characters', () => {
  const source = read('src/pages/Today.tsx');

  expectText(source, 'Szybko od\u0142\u00F3\u017C:');
  expectText(source, "label: 'Przysz\u0142y tydzie\u0144'");
  expectText(source, "description: 'Od\u0142\u00F3\u017C o godzin\u0119.'");
  expectText(source, "description: 'Od\u0142\u00F3\u017C na przysz\u0142y tydzie\u0144.'");

  rejectPattern(source, /Odloz/, 'Odloz');
  rejectPattern(source, /Przyszly tydzien/, 'Przyszly tydzien');
});

test('Today quick snooze actions stop parent click handlers and remain clickable', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractTodayEntrySnoozeBar(source);

  expectText(component, 'function TodayEntrySnoozeBar');
  expectText(component, 'const stopInteractiveEvent = (event: any) =>');
  expectText(component, 'event.preventDefault();');
  expectText(component, 'event.stopPropagation();');
  expectText(component, 'onPointerDown={stopInteractiveEvent}');
  expectText(component, 'onMouseDown={stopInteractiveEvent}');
  expectText(component, 'data-today-quick-snooze-action={option.key}');
  expectText(component, 'role="button"');
  expectText(component, 'pointer-events-auto');
  expectText(component, 'z-50');
  expectText(component, 'void onSnooze(entry, optionKey)');
});

test('Today quick snooze section exposes edit action', () => {
  const source = read('src/pages/Today.tsx');
  const component = extractTodayEntrySnoozeBar(source);

  expectPattern(source, /onEdit\?: \(entry: any\) => void/, 'onEdit prop type');
  expectText(component, 'const handleEditAction = (event: any) =>');
  expectText(component, 'onEdit?.(entry);');
  expectText(component, 'data-today-quick-snooze-edit="true"');
  expectText(component, 'Edytuj zadanie lub wydarzenie');
  expectText(source, 'onEdit={openPreviewEntry}');
});
