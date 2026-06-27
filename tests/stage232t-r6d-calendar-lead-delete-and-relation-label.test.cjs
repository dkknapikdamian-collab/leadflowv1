const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }

test('calendar relation is the linked record name, not a generic open button', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /CalendarEntryRelationTargetStage232T_R6/);
  assert.match(calendar, /enrichCalendarEntryRelationsStage232T_R6/);
  assert.match(calendar, /<Link to=\{relationTargetStage232T_R6\.href\} title=\{relationLabel\}>\{relationLabel\}<\/Link>/);
  assert.match(calendar, /<Link to=\{relationTargetSelectedStage232T_R6\.href\} title=\{relationFallback\}>\{relationFallback\}<\/Link>/);
  assert.doesNotMatch(calendar, />Otwórz lead<\/Link>/);
  assert.doesNotMatch(calendar, />Otwórz klienta<\/Link>/);
  assert.doesNotMatch(calendar, />Otwórz sprawę<\/Link>/);
});

test('delete on retained completed lead shadow removes durable completed task too', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /completedLeadTaskIdStage232T_R6/);
  assert.match(calendar, /await deleteTaskFromSupabase\(completedLeadTaskIdStage232T_R6\)/);
  assert.match(calendar, /releaseCalendarCompletedRetentionByKindAndIdStage232GR1I\('task', completedLeadTaskIdStage232T_R6\)/);
});

test('delete on task clears completed lead-shadow retention', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /deletedTaskLeadIdStage232T_R6/);
  assert.match(calendar, /releaseCompletedLeadShadowEntryStage232T_R5\(deletedTaskLeadIdStage232T_R6\)/);
});

test('lead is still not deleted and planned action clear remains intact', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.doesNotMatch(calendar, /deleteLeadFromSupabase/);
  assert.match(calendar, /calendar_lead_next_action_deleted/);
  assert.match(calendar, /nextActionAt: null/);
});
