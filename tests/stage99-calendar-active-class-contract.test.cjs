const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css'), 'utf8');
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

test('Stage99 active calendar classes have CSS contract coverage', () => {
  const missingInCalendar = required.filter((name) => !calendar.includes(name));
  const missingInCss = required.filter((name) => !css.includes('.' + name) && !css.includes(name));
  assert.deepStrictEqual(missingInCalendar, [], 'Classes missing in Calendar.tsx: ' + missingInCalendar.join(', '));
  assert.deepStrictEqual(missingInCss, [], 'Classes missing in CSS: ' + missingInCss.join(', '));
});

test('Stage99 active week plan has no orphan display-contents wrapper around cards', () => {
  assert.doesNotMatch(calendar, /<div\s+key=\{`week:\$\{day\.toISOString\(\)\}:\$\{entry\.id\}`}\s+style=\{\{\s*display:\s*['"]contents['"]\s*\}\}>/);
});
