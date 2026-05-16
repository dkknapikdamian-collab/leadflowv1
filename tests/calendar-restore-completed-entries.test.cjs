const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Calendar completed action label switches to restore for completed entries', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /isCompletedEntry \? 'Przywr\u00F3\u0107' : 'Zrobione'/);
});

test('Calendar complete action toggles event status both ways', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /const wasCompleted = isCompletedCalendarEntry\(entry\)/);
  assert.match(source, /status: wasCompleted \? 'scheduled' : 'completed'/);
});

test('Calendar complete action toggles task status both ways', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /status: wasCompleted \? 'todo' : 'done'/);
});

test('Calendar restore behavior documentation exists', () => {
  const doc = read('docs/CALENDAR_RESTORE_COMPLETED_ENTRIES_2026-04-24.md');

  assert.match(doc, /Przywr\u00F3\u0107/);
  assert.match(doc, /completed event -> scheduled/);
  assert.match(doc, /done task -> todo/);
});
