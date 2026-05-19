const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Stage124E forwards calendar task/event range params', () => {
  const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
  const calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');
  assert.match(fallback, /STAGE124E_CALENDAR_RANGE_QUERY_PARAMS/);
  assert.match(fallback, /buildTaskEventRangeQueryStage124E/);
  assert.match(fallback, /fetchTasksFromSupabase\(params\?: TaskEventRangeParamsStage124E\)/);
  assert.match(fallback, /fetchEventsFromSupabase\(params\?: TaskEventRangeParamsStage124E\)/);
  assert.ok(fallback.includes("'/api/tasks' + buildTaskEventRangeQueryStage124E(params)"));
  assert.ok(fallback.includes("'/api/events' + buildTaskEventRangeQueryStage124E(params)"));
  assert.ok(calendar.includes('fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})'));
  assert.ok(calendar.includes('fetchTasksFromSupabase(options)'));
  assert.ok(calendar.includes('fetchEventsFromSupabase(options)'));
});
