const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const calendar = () => fs.readFileSync(path.join(root, 'src/pages/Calendar.tsx'), 'utf8');

test('R1I cleans failed R1G false-positive from Calendar runtime', () => {
  const src = calendar();
  assert.equal(src.includes('STAGE232G_R1G_CALENDAR_COMPLETED_VISIBLE_BOTTOM_HOTFIX'), false);
  assert.equal(src.includes('compareCalendarCompletedEntryLastStage232GR1G'), false);
});

test('R1I retains completed calendar entries after refresh for both events and tasks', () => {
  const src = calendar();
  assert.match(src, /mergeCalendarCompletedRetentionRowsStage232GR1I\('event', nextCalendarEventsStage232GR1I\)/);
  assert.match(src, /mergeCalendarCompletedRetentionRowsStage232GR1I\('task', nextCalendarTasksStage232GR1I\)/);
  assert.match(src, /retainCalendarCompletedEntryStage232GR1I\(entry\);/);
  assert.match(src, /releaseCalendarCompletedEntryStage232GR1I\(entry\);/);
});

test('R1I persists retention through reload and clears it after restore', () => {
  const src = calendar();
  assert.match(src, /window\.localStorage\.setItem\(getCalendarCompletedRetentionStorageKeyStage232GR1I\(\), JSON\.stringify\(nextRetention\)\)/);
  assert.match(src, /window\.localStorage\.removeItem\(getCalendarCompletedRetentionStorageKeyStage232GR1I\(\)\)/);
  assert.match(src, /workspace\?\.id \|\| 'default'/);
});

test('R1I uses existing completed styling and sort contract', () => {
  const src = calendar();
  assert.match(src, /function isCompletedCalendarEntry\(entry: ScheduleEntry\)/);
  assert.match(src, /function sortCalendarEntriesForDisplay\(entries: ScheduleEntry\[\]\)/);
  assert.match(src, /line-through text-slate-500/);
  assert.match(src, /calendar-entry-completed is-completed/);
});
