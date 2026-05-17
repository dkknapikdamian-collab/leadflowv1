const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const calendarPath = path.join(repoRoot, 'src', 'pages', 'Calendar.tsx');
const quietGatePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');
const calendar = fs.readFileSync(calendarPath, 'utf8');
const quietGate = fs.readFileSync(quietGatePath, 'utf8');

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function dependencySegmentAfterMarker(marker) {
  const markerIndex = calendar.indexOf(marker);
  assert.notEqual(markerIndex, -1, `missing marker: ${marker}`);
  const depStart = calendar.indexOf('}, [', markerIndex);
  assert.notEqual(depStart, -1, `missing dependency array start after ${marker}`);
  const depEnd = calendar.indexOf(']);', depStart);
  assert.notEqual(depEnd, -1, `missing dependency array end after ${marker}`);
  return calendar.slice(depStart, depEnd + 3);
}

function sliceBetween(startNeedle, endNeedle) {
  const start = calendar.indexOf(startNeedle);
  assert.notEqual(start, -1, `missing start needle: ${startNeedle}`);
  const end = calendar.indexOf(endNeedle, start);
  assert.notEqual(end, -1, `missing end needle after ${startNeedle}: ${endNeedle}`);
  return calendar.slice(start, end);
}

test('Stage104 keeps schedule combination and day buckets memoized', () => {
  assert.match(calendar, /CALENDAR_PERFORMANCE_STAGE104F/);
  assert.match(calendar, /STAGE104_V4_SELECTED_DATE_NO_DOM_RERUN/);
  assert.match(calendar, /const\s+scheduleEntries\s*=\s*useMemo\s*\(/);
  assert.match(calendar, /const\s+weekEntries\s*=\s*useMemo\s*\(/);
  assert.match(calendar, /const\s+entriesByDayKey\s*=\s*useMemo\s*\(/);
  assert.match(calendar, /const\s+weekEntriesByDayKey\s*=\s*useMemo\s*\(/);
  assert.match(calendar, /buildEntriesByDayKey\(scheduleEntries\)/);
  assert.match(calendar, /buildEntriesByDayKey\(weekEntries\)/);
  assert.equal(countMatches(calendar, /combineScheduleEntries\s*\(\s*\{/g), 2, 'combineScheduleEntries should be called only for month and week memoized datasets');
  assert.doesNotMatch(calendar, /const\s+scheduleEntries\s*=\s*combineScheduleEntries\s*\(/);
  assert.doesNotMatch(calendar, /const\s+weekEntries\s*=\s*combineScheduleEntries\s*\(/);
});

test('Stage104 uses precomputed day maps in month, week and selected day panel', () => {
  assert.match(calendar, /getPrecomputedEntriesForDay\(entriesByDayKey,\s*day\)/);
  assert.match(calendar, /getPrecomputedEntriesForDay\(weekEntriesByDayKey,\s*day\)/);
  assert.match(calendar, /const\s+selectedDayEntries\s*=\s*useMemo\s*\(/);
  assert.match(calendar, /getPrecomputedEntriesForDay\(entriesByDayKey,\s*selectedDate\)/);
  assert.match(calendar, /entries=\{selectedDayEntries\}/);
  assert.doesNotMatch(calendar, /getEntriesForDay\s*\(/);
});

test('Stage104 allows sorting once in day-map precompute and avoids render-time full-list work', () => {
  assert.match(calendar, /function\s+buildEntriesByDayKey[\s\S]*sortCalendarEntriesForDisplay\(dayEntries\)/);
  assert.equal(countMatches(calendar, /sortCalendarEntriesForDisplay\(dayEntries\)/g), 1, 'dayEntries should only be sorted in buildEntriesByDayKey');

  const monthRender = sliceBetween('{calendarView === \'month\' ? (', '<CalendarSelectedDayTileV9');
  assert.doesNotMatch(monthRender, /scheduleEntries\s*\.\s*(filter|sort|reduce)\s*\(/, 'month render must not filter/sort/reduce the full scheduleEntries list');
  assert.match(monthRender, /getPrecomputedEntriesForDay\(entriesByDayKey,\s*day\)/);

  const weekRender = sliceBetween('{calendarView === \'week\' ? (', '<\/section>\n          <\/div>\n        ) : null}');
  assert.doesNotMatch(weekRender, /weekEntries\s*\.\s*(filter|sort|reduce)\s*\(/, 'week render must not filter/sort/reduce the full weekEntries list');
  assert.match(weekRender, /getPrecomputedEntriesForDay\(weekEntriesByDayKey,\s*day\)/);
});

test('Stage104 DOM post-processing does not rerun only because selectedDate changes', () => {
  const markers = [
    'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT',
    'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT',
    'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT',
  ];

  for (const marker of markers) {
    const deps = dependencySegmentAfterMarker(marker);
    assert.doesNotMatch(deps, /\bselectedDate\b/, `${marker} must not depend on selectedDate`);
    assert.match(deps, /\bcalendarView\b/, `${marker} should still react to view changes`);
    assert.match(deps, /\bcurrentMonth\b/, `${marker} should still react to month navigation`);
  }
});

test('Stage104 separates data loading from Calendar shell rendering', () => {
  assert.match(calendar, /data-cf-calendar-data-loading-skeleton="true"/);
  assert.doesNotMatch(calendar, /if\s*\(loading\)\s*\{\s*return\s*\(\s*<Layout>/s);
});

test('Stage104 performance guard is wired into quiet release gate exactly once', () => {
  assert.equal(countMatches(quietGate, /tests\/stage104-calendar-loading-performance-contract\.test\.cjs/g), 1);
});
