#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-calendar-selected-day-full-text-repair11.css');
const pkgPath = path.join(root, 'package.json');

function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[OK] ${msg}`);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

const calendar = read(calendarPath);
const css = read(cssPath);
const pkg = JSON.parse(read(pkgPath));

const requiredCalendar = [
  "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';",
  "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';",
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_2026_05_12',
  'data-cf-calendar-selected-day="true"',
  'data-cf-entry-type-label="true"',
  'data-cf-entry-title="true"',
  "if (entry.kind === 'event') return 'Wydarzenie';",
  "if (entry.kind === 'task') return 'Zadanie';",
  "return 'Lead';",
  'SELECTED_DAY_FULL_TEXT_REPAIR11_TOOLTIP_GUARD',
  'SELECTED_DAY_FULL_TEXT_REPAIR11_STRUCTURAL_GUARD'
];

for (const needle of requiredCalendar) {
  if (!calendar.includes(needle)) fail(`Calendar.tsx is missing required marker: ${needle}`);
}
ok('Calendar.tsx has selected-day marker, full labels, and normalizer guards');

const forbidden = [
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css',
  'closeflow-calendar-v6-repair1-scope-text.css'
];
for (const item of forbidden) {
  if (calendar.includes(item)) fail(`Calendar.tsx reactivates old post-V4 import: ${item}`);
}
ok('No old V5/V6/Repair2-5 layers reactivated in Calendar.tsx');


const activeCalendarCssImports = Array.from(calendar.matchAll(/import ['"]\.\.\/styles\/(closeflow-calendar-[^'"]+\.css)['"];?/g)).map((m) => m[1]);
const allowedCalendarCssImports = new Set([
  'closeflow-calendar-skin-only-v1.css',
  'closeflow-calendar-color-tooltip-v2.css',
  'closeflow-calendar-month-chip-overlap-fix-v1.css',
  'closeflow-calendar-month-rows-no-overlap-repair2.css',
  'closeflow-calendar-month-entry-structural-fix-v3.css',
  'closeflow-calendar-month-plain-text-rows-v4.css',
  'closeflow-calendar-selected-day-full-text-repair11.css'
]);
const unknownCalendarCssImports = activeCalendarCssImports.filter((item) => !allowedCalendarCssImports.has(item));
if (unknownCalendarCssImports.length) {
  fail(`Unknown active calendar CSS imports: ${unknownCalendarCssImports.join(', ')}`);
}
ok('Active calendar CSS imports are expected');

if (/month-(?:plain|rows|entry|chip)|calendar-month|cf-calendar-month/.test(css)) {
  fail('Repair11 CSS contains month-grid selectors. It must not touch monthly V4 grid.');
}
ok('Repair11 CSS contains no month-grid selectors');

const requiredCss = [
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_2026_05_12',
  '[data-cf-calendar-selected-day="true"] .calendar-entry-card',
  '[data-cf-entry-type-label="true"]',
  '[data-cf-entry-title="true"]',
  'content: none !important',
  'white-space: normal !important'
];
for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`Repair11 CSS is missing: ${needle}`);
}
ok('Repair11 CSS is scoped to selected-day section');

const scriptName = 'check:closeflow:calendar-selected-day-full-text-repair11';
if (!pkg.scripts || pkg.scripts[scriptName] !== 'node scripts/check-closeflow-calendar-selected-day-full-text-repair11.cjs') {
  fail(`package.json is missing script ${scriptName}`);
}
ok('package.json has Repair11 check script');

console.log('[OK] CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_CHECK_PASS');
