const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const cssPath = path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractSelectedDayRow(source) {
  const start = source.indexOf('function CalendarSelectedDayEntryRowV9(');
  assert.notEqual(start, -1, 'CalendarSelectedDayEntryRowV9 must exist.');
  const end = source.indexOf('\nfunction CalendarSelectedDayTileV9', start);
  assert.notEqual(end, -1, 'CalendarSelectedDayEntryRowV9 must end before CalendarSelectedDayTileV9.');
  return source.slice(start, end);
}

test('Stage92 selected-day row uses full labels, readable title, relation and complete actions', () => {
  const calendar = read(calendarPath);
  const row = extractSelectedDayRow(calendar);

  assert.match(row, /getCalendarEntryTypeLabel\(entry\)/, 'Selected day row must use getCalendarEntryTypeLabel(entry).');
  assert.match(row, /data-cf-entry-type-label="true"/, 'Visible entry type must be explicitly marked.');
  assert.match(row, /data-cf-entry-title="true"/, 'Entry title must have data-cf-entry-title.');
  assert.match(row, /data-cf-entry-relation="true"/, 'Entry relation must be rendered.');
  assert.match(row, /Brak powiązania/, 'Missing relation fallback must be visible.');

  for (const label of ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Przywróć', 'Usuń']) {
    assert.ok(row.includes(label), 'Missing selected-day action label: ' + label);
  }

  assert.doesNotMatch(row, />\s*Wy\s*</, 'Visible type must not be abbreviated to Wy.');
  assert.doesNotMatch(row, />\s*Zad\s*</, 'Visible type must not be abbreviated to Zad.');
  assert.match(row, /data-cf-selected-day-v9-no-bottom-bar="true"/, 'Selected day row must declare no separate bottom bar.');
  assert.doesNotMatch(row, /cf-selected-day-v9-bottom-bar|cf-selected-day-v9-empty-bar/, 'Selected day row must not render a separate bottom/empty bar.');
});

test('Stage92 legacy selected-day render is not active in Calendar.tsx', () => {
  const calendar = read(calendarPath);
  assert.doesNotMatch(calendar, /data-cf-calendar-selected-day="true"/, 'Legacy [data-cf-calendar-selected-day="true"] must not be rendered by Calendar.tsx.');
  assert.match(calendar, /data-cf-calendar-selected-day-new-tile-v9="true"/, 'V9 selected-day tile must remain active.');
});

test('Stage92 selected-day actions are responsive and not forced into a 260px strip', () => {
  const css = read(cssPath);
  assert.match(css, /STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS_START/, 'Stage92 CSS marker missing.');
  assert.doesNotMatch(css, /min-width:\s*260px\s*!important;/, 'Actions must not keep fixed min-width: 260px.');
  assert.match(css, /cf-selected-day-v9-action-row/, 'Actions must be grouped into stable rows.');
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(224px, 324px\)/, 'Desktop row must use content/action grid.');
  assert.match(css, /line-height:\s*1\.35\s*!important;/, 'Title must use readable line-height 1.35.');
  assert.match(css, /cf-selected-day-v9-action-danger[\s\S]*background:\s*#ffffff\s*!important;/, 'Delete action must be subtle, not a red blob.');
  assert.match(css, /cf-selected-day-v9-action-done[\s\S]*background:\s*#ffffff\s*!important;/, 'Done action must be subtle, not a green blob.');
});

test('Stage92 guard is included in quiet release gate', () => {
  const quietGate = read(quietGatePath);
  assert.match(quietGate, /tests\/stage92-calendar-selected-day-readable-actions\.test\.cjs/, 'Quiet gate must include Stage92 guard.');
});
