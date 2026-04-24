const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Calendar logs completed, restored and deleted entry activity', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /const logCalendarEntryActivity = async/);
  assert.match(source, /calendar_entry_completed/);
  assert.match(source, /calendar_entry_restored/);
  assert.match(source, /calendar_entry_deleted/);
  assert.match(source, /source: 'calendar'/);
});

test('Today logs task and event operational activity', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /const logTodayEntryActivity = async/);
  assert.match(source, /today_task_completed/);
  assert.match(source, /today_task_restored/);
  assert.match(source, /today_task_deleted/);
  assert.match(source, /today_event_completed/);
  assert.match(source, /today_event_restored/);
  assert.match(source, /today_event_deleted/);
  assert.match(source, /source: 'today'/);
});

test('Activity logging keeps lead and case relations', () => {
  const calendar = read('src/pages/Calendar.tsx');
  const today = read('src/pages/Today.tsx');

  assert.match(calendar, /leadId: entry\.raw\?\.leadId \?\? null/);
  assert.match(calendar, /caseId: entry\.raw\?\.caseId \?\? null/);
  assert.match(today, /leadId: entry\?\.raw\?\.leadId \?\? entry\?\.leadId \?\? null/);
  assert.match(today, /caseId: entry\?\.raw\?\.caseId \?\? entry\?\.caseId \?\? null/);
});

test('Activity logging documentation exists', () => {
  const doc = read('docs/TODAY_CALENDAR_ACTIVITY_LOGGING_2026-04-24.md');

  assert.match(doc, /calendar_entry_completed/);
  assert.match(doc, /today_event_deleted/);
  assert.match(doc, /historia klienta\/sprawy/);
});
