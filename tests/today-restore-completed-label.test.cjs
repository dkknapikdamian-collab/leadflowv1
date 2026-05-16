const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today completed task and event buttons expose restore label helper', () => {
  const source = read('src/pages/Today.tsx');
  const matches = source.match(/formatTodayCompleteActionLabel\(isCompleted, completePending\)/g) || [];

  assert.match(source, /function formatTodayCompleteActionLabel/);
  assert.ok(matches.length >= 2, 'Brakuje dynamicznej etykiety dla task\u00F3w i event\u00F3w.');
});

test('Today restore label helper returns Przywr\u00F3\u0107 for completed entries', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /return isCompleted \? 'Przywr\u00F3\u0107' : 'Zrobione'/);
});

test('Today restore label is backed by task and event toggle logic', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /const nextStatus = isCompletedTodayEntry\(entry\) \? 'scheduled' : 'completed'/);
  assert.match(source, /const nextStatus = isCompletedTodayEntry\(entry\) \? 'todo' : 'done'/);
});

test('Today restore label documentation exists', () => {
  const doc = read('docs/TODAY_RESTORE_COMPLETED_LABEL_2026-04-24.md');

  assert.match(doc, /aktywny wpis -> Zrobione/);
  assert.match(doc, /wykonany wpis -> Przywr\u00F3\u0107/);
  assert.match(doc, /sp\u00F3jna z kalendarzem/);
});
