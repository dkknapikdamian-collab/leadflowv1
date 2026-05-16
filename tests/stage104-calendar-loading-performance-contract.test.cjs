const fs = require('fs');
const path = require('path');
const assert = require('assert');

const repoRoot = process.cwd();
const calendarPath = path.join(repoRoot, 'src', 'pages', 'Calendar.tsx');
const calendar = fs.readFileSync(calendarPath, 'utf8');

function fail(message) {
  throw new Error(`STAGE104_CALENDAR_PERFORMANCE_CONTRACT_FAIL: ${message}`);
}

function expectIncludes(value, message) {
  if (!calendar.includes(value)) fail(message);
}

function expectNotMatches(regex, message) {
  if (regex.test(calendar)) fail(message);
}

expectIncludes('CALENDAR_PERFORMANCE_STAGE104F', 'missing Stage104F marker');
expectIncludes('const scheduleEntries = useMemo(', 'scheduleEntries must be memoized');
expectIncludes('const weekEntries = useMemo(', 'weekEntries must be memoized');
expectIncludes('const entriesByDayKey = useMemo(', 'entriesByDayKey must exist and be memoized');
expectIncludes('const weekEntriesByDayKey = useMemo(', 'weekEntriesByDayKey must exist and be memoized');
expectIncludes('buildEntriesByDayKey(scheduleEntries)', 'schedule entries must be bucketed once per scheduleEntries change');
expectIncludes('buildEntriesByDayKey(weekEntries)', 'week entries must be bucketed once per weekEntries change');
expectIncludes('getPrecomputedEntriesForDay(entriesByDayKey, day)', 'month day entries must use precomputed day map');
expectIncludes('getPrecomputedEntriesForDay(weekEntriesByDayKey, day)', 'week day entries must use precomputed day map');
expectIncludes('entries={selectedDayEntries}', 'selected day panel must use memoized selectedDayEntries');
expectIncludes('data-cf-calendar-data-loading-skeleton="true"', 'loading state must be data-panel skeleton, not full-page blocker');

expectNotMatches(/const\s+scheduleEntries\s*=\s*combineScheduleEntries\s*\(/, 'scheduleEntries combines data directly in render without useMemo');
expectNotMatches(/const\s+weekEntries\s*=\s*combineScheduleEntries\s*\(/, 'weekEntries combines data directly in render without useMemo');
expectNotMatches(/getEntriesForDay\s*\(/, 'Calendar.tsx must not call getEntriesForDay in render path');
expectNotMatches(/fetchCalendarBundleFromSupabase\(\),\s*fetchCasesFromSupabase\(\)/s, 'Calendar.tsx still double-fetches cases outside the calendar bundle');
expectNotMatches(/if\s*\(loading\)\s*{\s*return\s*\(\s*<Layout>/s, 'loading must not block the whole Calendar page');

assert.ok(true);
console.log('OK: Stage104 Calendar loading performance contract passed.');
