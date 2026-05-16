const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const skinPath = path.join(repoRoot, 'src/styles/closeflow-calendar-skin-only-v1.css');
const releaseGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(relativeOrAbsolutePath) {
  return fs.readFileSync(relativeOrAbsolutePath, 'utf8');
}

function windowFrom(source, startMarker, charCount = 9000) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, 'Missing marker: ' + startMarker);
  return source.slice(start, start + charCount);
}

test('Stage93 removes obsolete hidden week filter render', () => {
  const source = read(calendarPath);
  assert.equal(source.includes('calendar-week-filter-list hidden'), false, 'Old hidden week filter list must not be rendered.');
  assert.equal(source.includes('calendar-week-filter-btn'), false, 'Old week filter buttons must not remain in Calendar.tsx.');
  assert.equal(source.includes('Przyszły tydzień'), false, 'Legacy future-week shortcut must not remain in the removed rail.');
});

test('Stage93 keeps one visible week rail with full date and plain count text', () => {
  const source = read(calendarPath);
  const visibleRail = windowFrom(source, 'calendar-week-visible-days-v3', 7000);
  assert.ok(visibleRail.includes('const fullDateLabel'), 'Visible week rail should build a full weekday/date label.');
  assert.ok(visibleRail.includes("weekday + ', ' + dateLabel"), 'Visible week rail should render comma-separated full date text.');
  assert.ok(visibleRail.includes('calendar-week-day-count-text'), 'Visible week rail should use text count class, not a badge class.');
  assert.ok(visibleRail.includes('formatCalendarItemCount(dayEntries.length)'), 'Visible week rail should use item-count text.');
  assert.equal(/rounded-full[^\n]+formatCalendarItemCount\(dayEntries\.length\)/.test(visibleRail), false, 'Week rail count must not be a rounded badge/plaque.');
});

test('Stage93 week rail updates selected day and current month together', () => {
  const source = read(calendarPath);
  const visibleRail = windowFrom(source, 'calendar-week-visible-days-v3', 7000);
  assert.ok(visibleRail.includes('setSelectedDate(day);'), 'Week rail click should update selected day.');
  assert.ok(visibleRail.includes('setCurrentMonth(day);'), 'Week rail click should sync current month.');
});

test('Stage93 CSS neutralizes week count badge/plaque styling', () => {
  const skin = read(skinPath);
  const countRule = windowFrom(skin, 'calendar-week-day-count-text', 3000);
  assert.ok(countRule.includes('background: transparent'), 'Week count text should have transparent background.');
  assert.ok(countRule.includes('border: 0'), 'Week count text should not have a badge border.');
  assert.ok(countRule.includes('box-shadow: none'), 'Week count text should not have plaque shadow.');
});

test('Stage93 does not use short type labels in week plan render', () => {
  const source = read(calendarPath);
  const plan = windowFrom(source, 'calendar-week-plan-list', 12000);
  assert.equal(plan.includes("'Wyd'"), false, 'Week plan should not render short Wyd labels.');
  assert.equal(plan.includes("'Zad'"), false, 'Week plan should not render short Zad labels.');
  assert.equal(plan.includes('>Wy<'), false, 'Week plan should not render Wy as visible type.');
});

test('Stage93 guard is included in quiet release gate', () => {
  const gate = read(releaseGatePath);
  assert.ok(gate.includes('tests/stage93-calendar-week-rail-cleanup.test.cjs'), 'Quiet gate must include Stage93 guard.');
});
