const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Calendar treats completed events as completed entries', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /function isCompletedCalendarEntry/);
  assert.match(source, /entry\.kind === 'event'/);
  assert.match(source, /status === 'completed'/);
  assert.match(source, /isCompletedCalendarEntry\(a\)/);
  assert.match(source, /isCompletedCalendarEntry\(b\)/);
});

test('Calendar no longer limits completed visual state to tasks only', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.doesNotMatch(source, /const isCompletedTask = entry\.kind === 'task' && entry\.raw\?\.status === 'done'/);
  assert.match(source, /const isCompletedEntry = isCompletedCalendarEntry\(entry\)/);
  assert.match(source, /isCompletedEntry \? 'opacity-60' : ''/);
  assert.match(source, /isCompletedEntry \? 'text-slate-500 line-through' : 'text-slate-900'/);
});

test('Completed calendar behavior documentation exists', () => {
  const doc = read('docs/CALENDAR_COMPLETED_EVENT_BEHAVIOR_2026-04-24.md');

  assert.match(doc, /event\.status = completed/);
  assert.match(doc, /wyszarzony/);
  assert.match(doc, /przekreślony/);
  assert.match(doc, /dół listy dnia/);
});
