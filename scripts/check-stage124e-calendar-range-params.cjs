const fs = require('fs');
const assert = require('assert');

const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
const calendar = fs.readFileSync('src/lib/calendar-items.ts', 'utf8');

assert.ok(fallback.includes('STAGE124E_CALENDAR_RANGE_QUERY_PARAMS'), 'fallback must contain Stage124E marker');
assert.ok(fallback.includes('type TaskEventRangeParamsStage124E'), 'fallback must define task/event range params type');
assert.ok(fallback.includes('function buildTaskEventRangeQueryStage124E'), 'fallback must build task/event range query');
assert.ok(fallback.includes("query.set('from', params.from)"), 'fallback must forward from param');
assert.ok(fallback.includes("query.set('to', params.to)"), 'fallback must forward to param');
assert.ok(fallback.includes("query.set('limit', String(Math.min(Math.floor(params.limit), 200)))"), 'fallback must cap and forward limit param');
assert.ok(fallback.includes('export async function fetchTasksFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'tasks fetcher must accept range params');
assert.ok(fallback.includes('export async function fetchEventsFromSupabase(params?: TaskEventRangeParamsStage124E)'), 'events fetcher must accept range params');
assert.ok(fallback.includes("'/api/tasks' + buildTaskEventRangeQueryStage124E(params)"), 'tasks fetcher must call /api/tasks with range query builder');
assert.ok(fallback.includes("'/api/events' + buildTaskEventRangeQueryStage124E(params)"), 'events fetcher must call /api/events with range query builder');
assert.ok(!fallback.includes("callApi<Record<string, unknown>[]>('/api/tasks').then"), 'tasks fetcher must not use bare /api/tasks');
assert.ok(!fallback.includes("callApi<Record<string, unknown>[]>('/api/events').then"), 'events fetcher must not use bare /api/events');

assert.ok(calendar.includes('export type CalendarBundleRangeOptions'), 'calendar bundle must expose range options type');
assert.ok(calendar.includes('fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})'), 'calendar bundle must accept range options');
assert.ok(calendar.includes('fetchTasksFromSupabase(options)'), 'calendar bundle must pass options to task fetcher');
assert.ok(calendar.includes('fetchEventsFromSupabase(options)'), 'calendar bundle must pass options to event fetcher');

console.log('✔ Stage124E calendar task/event range params contract holds');
