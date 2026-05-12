#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-calendar-selected-day-full-text-repair11.css');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const calendar = read(calendarPath);
const css = read(cssPath);

function has(needle) {
  return calendar.includes(needle) || css.includes(needle);
}

const rows = [
  ['V4 month baseline import', has("closeflow-calendar-month-plain-text-rows-v4.css")],
  ['Repair11 css import', has("closeflow-calendar-selected-day-full-text-repair11.css")],
  ['Selected day wrapper marker', has('data-cf-calendar-selected-day="true"')],
  ['Type label hook', has('data-cf-entry-type-label="true"')],
  ['Title hook', has('data-cf-entry-title="true"')],
  ['Tooltip guard skips cards', has('SELECTED_DAY_FULL_TEXT_REPAIR11_TOOLTIP_GUARD')],
  ['Structural guard skips cards', has('SELECTED_DAY_FULL_TEXT_REPAIR11_STRUCTURAL_GUARD')],
  ['CSS kills acronym pseudo elements', has('content: none !important')],
];

console.log('\n== CloseFlow Calendar Selected Day Repair11 Audit ==');
for (const [label, value] of rows) {
  console.log(`${value ? '[OK]' : '[FAIL]'} ${label}`);
}

const oldImports = [
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css',
  'closeflow-calendar-v6-repair1-scope-text.css'
].filter((item) => calendar.includes(item));


const activeCalendarCssImports = Array.from(calendar.matchAll(/import ['"]\.\.\/styles\/(closeflow-calendar-[^'"]+\.css)['"];?/g)).map((m) => m[1]);
console.log('\nActive calendar CSS imports:');
for (const item of activeCalendarCssImports) console.log(`- ${item}`);

const allowedLegacyVisualLayers = new Set([
  'closeflow-calendar-skin-only-v1.css',
  'closeflow-calendar-color-tooltip-v2.css',
  'closeflow-calendar-month-chip-overlap-fix-v1.css',
  'closeflow-calendar-month-rows-no-overlap-repair2.css',
  'closeflow-calendar-month-entry-structural-fix-v3.css',
  'closeflow-calendar-month-plain-text-rows-v4.css',
  'closeflow-calendar-selected-day-full-text-repair11.css'
]);
const unknownCalendarCssImports = activeCalendarCssImports.filter((item) => !allowedLegacyVisualLayers.has(item));
if (unknownCalendarCssImports.length) {
  console.log('\nUnknown active calendar CSS imports detected:');
  for (const item of unknownCalendarCssImports) console.log(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log('\n[OK] Active calendar CSS import list is expected and does not reactivate old V5/V6/Repair2-5 selected-day layers');
}

const selectedDayCssHasMonthSelectors = /month-(?:plain|rows|entry|chip)|calendar-month|cf-calendar-month/.test(css);
if (selectedDayCssHasMonthSelectors) {
  console.log('\n[FAIL] Repair11 CSS contains month-grid selectors. It must stay scoped to selected day only.');
  process.exitCode = 1;
} else {
  console.log('[OK] Repair11 CSS has no month-grid selectors');
}

if (oldImports.length) {
  console.log('\nOld active post-V4 imports in Calendar.tsx:');
  for (const item of oldImports) console.log(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log('\n[OK] No active old post-V4 imports in Calendar.tsx');
}
