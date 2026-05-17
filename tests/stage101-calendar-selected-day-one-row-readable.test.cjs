const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

function sliceBetween(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  assert.notEqual(start, -1, 'Missing start token: ' + startToken);
  const end = text.indexOf(endToken, start + startToken.length);
  assert.notEqual(end, -1, 'Missing end token after: ' + startToken);
  return text.slice(start, end);
}

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-selected-day-new-tile-v9.css');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
const selectedRow = sliceBetween(calendar, 'function CalendarSelectedDayEntryRowV9', '\nfunction CalendarSelectedDayTileV9');
const selectedTile = sliceBetween(calendar, 'function CalendarSelectedDayTileV9', '\nexport default function Calendar');

test('Stage101B selected-day row uses one active V9 render and readable contract', () => {
  assert.ok(selectedRow.includes('data-cf-calendar-selected-day-entry-v9="true"'));
  assert.ok(selectedRow.includes('data-cf-selected-day-v9-no-bottom-bar="true"'));
  assert.ok(selectedRow.includes('getCalendarEntryTypeLabel(entry)'));
  assert.ok(selectedRow.includes('getCalendarEntryTimeLabel(entry)'));
  assert.ok(selectedRow.includes('getCalendarEntryStatusLabel(entry)'));
  assert.ok(selectedRow.includes('data-cf-entry-title="true"'));
  assert.ok(selectedRow.includes('data-cf-entry-relation="true"'));
  assert.ok(selectedRow.includes('data-cf-selected-day-action-group="single-row"'));
});

test('Stage101B selected-day actions are one group, not two stacked micro rows', () => {
  for (const label of ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione']) {
    assert.ok(selectedRow.includes(label), 'Missing action label: ' + label);
  }
  assert.doesNotMatch(selectedRow, /cf-selected-day-v9-action-row-primary|cf-selected-day-v9-action-row-secondary/);
  assert.ok(selectedRow.includes('trashActionButtonClass'));
});

test('Stage101B selected-day tile sorts completed entries through display sorter', () => {
  assert.match(selectedTile, /displayEntries\s*=\s*sortCalendarEntriesForDisplay\(safeEntries\)/);
  assert.match(selectedTile, /displayEntries\.length/);
  assert.match(selectedTile, /displayEntries\.map/);
});

test('Stage101B CSS uses selected-day contract based on compact week-plan card behavior', () => {
  assert.ok(css.includes('[data-cf-calendar-selected-day-entry-v9="true"].cf-selected-day-v9-entry-shell'));
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto\s*!important/);
  assert.match(css, /background:\s*#f8fafc\s*!important/);
  assert.ok(css.includes('[data-cf-selected-day-action-group="single-row"].cf-selected-day-v9-actions'));
  assert.doesNotMatch(css, /cf-selected-day-v9-empty-bar|cf-selected-day-v9-bottom-bar/);
});

test('Stage101B completed selected-day entries are grey and crossed out', () => {
  assert.ok(selectedRow.includes("isCompletedEntry ? 'calendar-entry-completed is-completed' : ''"));
  assert.match(css, /data-calendar-entry-completed="true"/);
  assert.match(css, /text-decoration:\s*line-through\s*!important/);
  assert.match(css, /#f1f5f9/);
});

test('Stage101B quiet release gate includes this guard once', () => {
  const needle = 'tests/stage101-calendar-selected-day-one-row-readable.test.cjs';
  const count = quiet.split(needle).length - 1;
  assert.equal(count, 1);
});
