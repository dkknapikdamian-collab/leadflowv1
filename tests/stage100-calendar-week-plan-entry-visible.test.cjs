const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css'), 'utf8');
const quietGate = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');
function extractFunction(source, name) {
  const marker = 'function ' + name + '(';
  const start = source.indexOf(marker);
  assert.notStrictEqual(start, -1, 'Missing function: ' + name);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') { depth -= 1; if (depth === 0) return source.slice(start, i + 1); }
  }
  throw new Error('Could not close function: ' + name);
}
const card = extractFunction(calendar, 'ScheduleEntryCard');

test('Stage100 keeps exactly one ScheduleEntryCard component', () => {
  assert.equal((calendar.match(/function ScheduleEntryCard\(/g) || []).length, 1);
});

test('Stage100 ScheduleEntryCard exposes one visible week-plan DOM model', () => {
  for (const needle of ['data-cf-calendar-week-plan-entry-card="true"', 'cf-calendar-week-plan-entry-card', 'cf-calendar-week-plan-entry-main', 'cf-calendar-week-plan-entry-meta', 'cf-calendar-week-plan-entry-title', 'data-cf-entry-title="true"', 'cf-calendar-week-plan-entry-relation', 'cf-calendar-week-plan-entry-actions']) assert.ok(card.includes(needle), 'Missing ' + needle);
});

test('Stage100 ScheduleEntryCard uses full labels, not short-only type chips', () => {
  assert.ok(card.includes('getCalendarEntryTypeLabel(entry)'));
  assert.ok(card.includes('getCalendarEntryTimeLabel(entry)'));
  assert.ok(card.includes('getCalendarEntryStatusLabel(entry)'));
  assert.doesNotMatch(card, />\s*Zad\s*</);
  assert.doesNotMatch(card, />\s*Wy\s*</);
});

test('Stage100 CSS has one active week-plan entry selector contract', () => {
  assert.ok(css.includes('CLOSEFLOW_STAGE100_CALENDAR_WEEK_PLAN_ENTRY_VISIBLE'));
  assert.ok(css.includes('[data-cf-calendar-week-plan-entry-card="true"]'));
  assert.ok(css.includes('.cf-calendar-week-plan-entry-title'));
});

test('Stage100 removes competing legacy week-plan CSS class families and markers', () => {
  assert.doesNotMatch(css, /\.cf-week-plan-entry-/);
  assert.doesNotMatch(css, /\.cf-calendar-week-entry-/);
  assert.doesNotMatch(css, /CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2/);
  assert.doesNotMatch(css, /CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3/);
  assert.doesNotMatch(css, /CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4/);
});

test('Stage100 guard is included in quiet release gate', () => {
  assert.ok(quietGate.includes('tests/stage100-calendar-week-plan-entry-visible.test.cjs'));
});
