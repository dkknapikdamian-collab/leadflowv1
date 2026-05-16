const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const plainRowsCss = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-month-plain-text-rows-v4.css'), 'utf8');
const releaseCheck = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

test('stage103 month grid day state classes exist in active render', () => {
  assert.match(calendar, /calendar-day-cell/);
  assert.match(calendar, /is-today/);
  assert.match(calendar, /is-past/);
  assert.match(calendar, /is-selected/);
  assert.match(calendar, /is-outside/);
  assert.match(calendar, /data-calendar-month-day-cell/);
});

test('stage103 month grid does not render top count badge near date', () => {
  assert.doesNotMatch(calendar, /<Badge[^>]*>\{dayEntries\.length\}<\/Badge>/);
  assert.doesNotMatch(calendar, /data-calendar-month-day-count-badge/);
});

test('stage103 more row is a real button with click handler and selected-day target', () => {
  assert.match(calendar, /data-calendar-month-more-button/);
  assert.match(calendar, /handleShowMoreMonthDay/);
  assert.match(calendar, /onClick=\{\(event\) => handleShowMoreMonthDay\(event, day\)\}/);
  assert.match(calendar, /data-calendar-selected-day-panel/);
  assert.doesNotMatch(calendar, /<div className="calendar-more"/);
});

test('stage103 final CSS overrides old month grid layers', () => {
  assert.match(plainRowsCss, /STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3/);
  assert.match(plainRowsCss, /\.calendar-day-cell\.is-today/);
  assert.match(plainRowsCss, /\.calendar-day-cell\.is-past/);
  assert.match(plainRowsCss, /\.calendar-day-cell\.is-selected/);
  assert.match(plainRowsCss, /\.calendar-day-cell\.is-outside/);
  assert.match(plainRowsCss, /data-calendar-month-more-button/);
});

test('stage103 guard is part of quiet release check', () => {
  assert.match(releaseCheck, /tests\/stage103-calendar-month-grid-day-states\.test\.cjs/);
});
