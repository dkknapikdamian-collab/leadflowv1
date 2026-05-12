#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendar = fs.readFileSync(path.join(root, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-calendar-selected-day-full-text-repair12.css'), 'utf8');

const requiredCalendarMarkers = [
  "closeflow-calendar-month-plain-text-rows-v4.css",
  "closeflow-calendar-selected-day-full-text-repair12.css",
  "CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12",
  'data-cf-calendar-selected-day="true"',
  'data-cf-calendar-entry-card-repair12="true"',
  'data-cf-entry-type-label="true"',
  'data-cf-entry-title="true"',
  'SELECTED_DAY_FULL_TEXT_REPAIR12_TOOLTIP_GUARD',
  'SELECTED_DAY_FULL_TEXT_REPAIR12_STRUCTURAL_GUARD'
];
const forbiddenCalendarMarkers = [
  "closeflow-calendar-selected-day-full-text-repair11.css",
  "closeflow-calendar-selected-day-readability-v5.css",
  "closeflow-calendar-selected-day-full-labels-v6.css",
  "closeflow-calendar-text-ellipsis-selected-day-repair5.css",
  "closeflow-calendar-v6-repair1-scope-text.css",
  "closeflow-calendar-render-pipeline-repair3.css",
  "closeflow-calendar-month-tooltip-actions-repair4.css",
  "closeflow-calendar-month-light-selected-day-real-entries-repair2.css"
];
const requiredCssMarkers = [
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12',
  '[data-cf-calendar-selected-day="true"]',
  '[data-cf-entry-type-label="true"]',
  '[data-cf-entry-title="true"]',
  'content: none !important'
];

let failures = 0;
for (const marker of requiredCalendarMarkers) {
  if (!calendar.includes(marker)) {
    console.error(`[FAIL] Calendar.tsx is missing required marker: ${marker}`);
    failures += 1;
  }
}
for (const marker of forbiddenCalendarMarkers) {
  if (calendar.includes(marker)) {
    console.error(`[FAIL] Calendar.tsx contains forbidden marker/import: ${marker}`);
    failures += 1;
  }
}
for (const marker of requiredCssMarkers) {
  if (!css.includes(marker)) {
    console.error(`[FAIL] Repair12 CSS is missing required marker: ${marker}`);
    failures += 1;
  }
}

if (failures > 0) process.exit(1);
console.log('[OK] check:closeflow:calendar-selected-day-full-text-repair12 passed');
