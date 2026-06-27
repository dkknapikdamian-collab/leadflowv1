const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('completed lead action suppresses active planned duplicate in calendar entries', () => {
  const calendar = read('src/pages/Calendar.tsx');

  assert.match(calendar, /dedupeCalendarLeadActionRowsStage232T_R6E/);
  assert.match(calendar, /getCalendarLeadActionDedupKeyStage232T_R6E/);
  assert.match(calendar, /getCalendarLeadActionDedupeRankStage232T_R6E/);
  assert.match(calendar, /if \(completed\) return 20;/);
  assert.match(calendar, /winner !== entry/);
  assert.match(calendar, /emitted\.has\(key\)/);
});

test('dedupe is applied to both month and week entry lists after relation enrichment', () => {
  const calendar = read('src/pages/Calendar.tsx');

  assert.match(calendar, /const scheduleEntries = useMemo\([\s\S]{0,500}dedupeCalendarLeadActionRowsStage232T_R6E\(enrichCalendarEntryRelationsStage232T_R6\(\[/);
  assert.match(calendar, /const weekEntries = useMemo\([\s\S]{0,500}dedupeCalendarLeadActionRowsStage232T_R6E\(enrichCalendarEntryRelationsStage232T_R6\(\[/);
});

test('R6D relation-name and delete fixes remain in place', () => {
  const calendar = read('src/pages/Calendar.tsx');

  assert.match(calendar, /data-stage232t-r6d-calendar-week-relation-name-link="true"/);
  assert.match(calendar, /data-stage232t-r6d-calendar-selected-relation-name-link="true"/);
  assert.match(calendar, /completedLeadTaskIdStage232T_R6/);
  assert.match(calendar, /deletedTaskLeadIdStage232T_R6/);
});
