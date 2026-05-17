const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css'), 'utf8');

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

const required = [
  'cf-calendar-week-plan-entry-card',
  'cf-calendar-week-plan-entry-main',
  'cf-calendar-week-plan-entry-meta',
  'cf-calendar-week-plan-entry-title',
  'cf-calendar-week-plan-entry-relation',
  'cf-calendar-week-plan-entry-actions',
  'cf-selected-day-v9-entry-shell',
  'cf-selected-day-v9-main',
  'cf-selected-day-v9-actions'
];

const card = extractFunction(calendar, 'ScheduleEntryCard');

test('Stage99 active calendar classes have CSS contract coverage', () => {
  const missingInCalendar = required.filter((name) => !calendar.includes(name));
  const missingInCss = required.filter((name) => !css.includes('.' + name) && !css.includes(name));
  assert.deepStrictEqual(missingInCalendar, [], 'Classes missing in Calendar.tsx: ' + missingInCalendar.join(', '));
  assert.deepStrictEqual(missingInCss, [], 'Classes missing in CSS: ' + missingInCss.join(', '));
});

test('Stage99 week-plan root does not inherit legacy global calendar-entry-card class', () => {
  assert.doesNotMatch(card, /calendar-entry-card\s+cf-calendar-week-plan-entry-card/);
  assert.doesNotMatch(card, /cf-calendar-week-plan-entry-card\s+calendar-entry-card/);
});
