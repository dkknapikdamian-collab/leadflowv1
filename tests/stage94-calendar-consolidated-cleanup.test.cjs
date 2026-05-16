const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src', 'pages', 'Calendar.tsx');
const skinPath = path.join(repoRoot, 'src', 'styles', 'closeflow-calendar-skin-only-v1.css');
const releasePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function between(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  assert.notStrictEqual(start, -1, 'Missing start marker: ' + startNeedle);
  const end = text.indexOf(endNeedle, start + startNeedle.length);
  assert.notStrictEqual(end, -1, 'Missing end marker after: ' + startNeedle);
  return text.slice(start, end);
}

test('Stage94 removes wrong-source selected day variable', () => {
  const calendar = read(calendarPath);
  assert.ok(!calendar.includes('selectedDayAgendaEntriesV2'), 'selectedDayAgendaEntriesV2 must be removed; it read topicContactOptions as schedule entries.');
});

test('Stage94 keeps one selected-day renderer in month view', () => {
  const calendar = read(calendarPath);
  const monthBlock = between(calendar, "{calendarView === 'month' ? (", "{calendarView === 'week' ? (");
  assert.ok(monthBlock.includes('<CalendarSelectedDayTileV9'), 'Month view should render selected day through V9 tile.');
  assert.ok(!monthBlock.includes('selectedDayEntries.map'), 'Old selectedDayEntries ScheduleEntryCard list must not render next to V9.');
  assert.ok(!monthBlock.includes('className="h-7 px-3"'), 'Extra selected-day Badge count must not render next to V9.');
  assert.ok(!monthBlock.includes('<ScheduleEntryCard'), 'Month selected day block must not render ScheduleEntryCard after V9.');
});

test('Stage94 removes duplicate completed class expression from month pills', () => {
  const calendar = read(calendarPath);
  const needle = "calendar-entry-completed calendar-month-entry-completed' : ''} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed";
  assert.ok(!calendar.includes(needle), 'Month entry completed class expression is duplicated.');
});

test('Stage94 keeps week rail clean after Stage93', () => {
  const calendar = read(calendarPath);
  const weekBlock = between(calendar, 'calendar-week-visible-days-v3', 'calendar-week-plan');
  assert.ok(!calendar.includes('calendar-week-filter-list hidden'), 'Obsolete hidden week filter must not exist.');
  assert.ok(!calendar.includes('calendar-week-filter-btn'), 'Legacy week filter button must not exist.');
  assert.ok(weekBlock.includes('calendar-week-day-count-text'), 'Week count must be plain text count.');
  assert.ok(weekBlock.includes("setCurrentMonth(day)"), 'Week rail day click must update currentMonth with selectedDate.');
  assert.ok(weekBlock.includes("weekday + ', ' + dateLabel"), 'Week rail should show full weekday/date label.');
});

test('Stage94 fixes broken old broad calendar CSS selector', () => {
  const skin = read(skinPath);
  assert.ok(!skin.includes('old broad calendar scope'), 'Broken old broad scope selector text must be removed.');
  assert.ok(skin.includes('#root .cf-html-view.main-calendar-html'), 'Calendar page background should use a valid scoped selector.');
  assert.ok(skin.includes('STAGE94_CALENDAR_CONSOLIDATED_CLEANUP_WEEK_RAIL_TEXT_COUNT'), 'Week count text CSS safeguard missing.');
});

test('Stage94 guard is included in quiet release gate', () => {
  const release = read(releasePath);
  assert.ok(release.includes('tests/stage94-calendar-consolidated-cleanup.test.cjs'), 'Stage94 guard must be listed in quiet release gate.');
});
