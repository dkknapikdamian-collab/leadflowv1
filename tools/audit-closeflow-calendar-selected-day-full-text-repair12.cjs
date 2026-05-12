#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-calendar-selected-day-full-text-repair12.css');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function stripCssComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '');
}
function pass(label) { console.log(`[OK] ${label}`); }
function fail(label) { console.log(`[FAIL] ${label}`); failures += 1; }
function requireCheck(label, value) { value ? pass(label) : fail(label); }

let failures = 0;
const calendar = read(calendarPath);
const css = read(cssPath);
const cssNoComments = stripCssComments(css);

console.log('\n== CloseFlow Calendar Selected Day Repair12 Hard Audit ==');
requireCheck('V4 month baseline import remains active', calendar.includes("closeflow-calendar-month-plain-text-rows-v4.css"));
requireCheck('Repair12 css import is active', calendar.includes("closeflow-calendar-selected-day-full-text-repair12.css"));
requireCheck('Repair11 css import is inactive', !calendar.includes("closeflow-calendar-selected-day-full-text-repair11.css"));
requireCheck('Selected day wrapper marker exists', calendar.includes('data-cf-calendar-selected-day="true"'));
requireCheck('Selected day card marker exists', calendar.includes('data-cf-calendar-entry-card-repair12="true"'));
requireCheck('Full type label hook exists', calendar.includes('data-cf-entry-type-label="true"'));
requireCheck('Full title hook exists', calendar.includes('data-cf-entry-title="true"'));
requireCheck('Tooltip normalizer skips selected-day cards', calendar.includes('SELECTED_DAY_FULL_TEXT_REPAIR12_TOOLTIP_GUARD'));
requireCheck('Structural normalizer skips selected-day cards', calendar.includes('SELECTED_DAY_FULL_TEXT_REPAIR12_STRUCTURAL_GUARD'));
requireCheck('CSS disables acronym pseudo elements', css.includes('content: none !important'));
requireCheck('CSS is scoped to selected day wrapper', css.includes('[data-cf-calendar-selected-day="true"]'));

const activeCalendarCssImports = Array.from(calendar.matchAll(/import ['"]\.\.\/styles\/(closeflow-calendar-[^'"]+\.css)['"];?/g)).map((m) => m[1]);
console.log('\nActive calendar CSS imports:');
for (const item of activeCalendarCssImports) console.log(`- ${item}`);

const forbiddenImports = [
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css',
  'closeflow-calendar-v6-repair1-scope-text.css',
  'closeflow-calendar-selected-day-full-text-repair11.css'
].filter((item) => activeCalendarCssImports.includes(item));

if (forbiddenImports.length) {
  console.log('\nForbidden active calendar imports detected:');
  for (const item of forbiddenImports) console.log(`- ${item}`);
  failures += 1;
} else {
  pass('No forbidden selected-day or post-V4 imports are active');
}

const selectedDayCssHasMonthSelectors = /month-(?:plain|rows|entry|chip)|calendar-month|cf-calendar-month/.test(cssNoComments);
requireCheck('Repair12 CSS has no live month-grid selectors', !selectedDayCssHasMonthSelectors);

const nonScopedSelectedDayRules = cssNoComments
  .split('}')
  .map((block) => block.trim())
  .filter(Boolean)
  .filter((block) => block.includes('calendar-entry-card') || block.includes('cf-entity-type-pill') || block.includes('cf-calendar-type-badge'))
  .filter((block) => !block.includes('[data-cf-calendar-selected-day="true"]') && !block.startsWith('@media'));
requireCheck('Selected-day CSS rules stay scoped', nonScopedSelectedDayRules.length === 0);

if (failures > 0) {
  console.error(`\n[FAIL] Repair12 hard audit failed with ${failures} issue(s).`);
  process.exit(1);
}
console.log('\n[OK] Repair12 hard audit passed.');
