const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today treats completed events and done tasks as completed entries', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /function isCompletedTodayEntry/);
  assert.match(source, /entry\?\.kind === 'task' && status === 'done'/);
  assert.match(source, /entry\?\.kind === 'event' && \(status === 'completed' \|\| status === 'done'\)/);
});

test('Today sorts completed entries below active entries', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /function sortTodayEntriesForDisplay/);
  assert.match(source, /const aDone = isCompletedTodayEntry\(a\)/);
  assert.match(source, /const bDone = isCompletedTodayEntry\(b\)/);
  assert.match(source, /const todayEntries = sortTodayEntriesForDisplay\(combineScheduleEntries/);
});

test('Today task and event toggles use completed-entry helper', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /const nextStatus = isCompletedTodayEntry\(entry\) \? 'scheduled' : 'completed'/);
  assert.match(source, /const nextStatus = isCompletedTodayEntry\(entry\) \? 'todo' : 'done'/);
});

test('Today completed behavior documentation exists', () => {
  const doc = read('docs/TODAY_COMPLETED_ENTRIES_BEHAVIOR_2026-04-24.md');

  assert.match(doc, /event\.status = completed/);
  assert.match(doc, /task\.status = done/);
  assert.match(doc, /aktywne wpisy/);
});
