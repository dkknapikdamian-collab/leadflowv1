const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const calendarPath = path.join(repo, 'src/pages/Calendar.tsx');
const calendar = fs.readFileSync(calendarPath, 'utf8');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

const forbidden = [
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-v6-repair1-scope-text.css',
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12',
  'CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_2026_05_12',
  'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12',
  'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12',
  'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12',
  'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12',
  'cf-calendar-route-active',
  'cf-cal-r5-month-entry'
];

expect('Calendar imports V4 CSS', calendar.includes("import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';"));
expect('Calendar has V4 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12'));
for (const needle of forbidden) {
  expect(`post-V4 marker/import removed: ${needle}`, !calendar.includes(needle));
}

const generatedPath = path.join(repo, 'docs/ui/CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_2026-05-12.generated.json');
const generated = fs.existsSync(generatedPath) ? fs.readFileSync(generatedPath, 'utf8') : '';
expect('restore report pass', generated.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_CHECK_OK');
