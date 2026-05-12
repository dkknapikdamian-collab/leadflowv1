const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];
function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}
function expect(label, ok) {
  if (!ok) failures.push(label);
}

const calendar = read('src/pages/Calendar.tsx');
const css = stripCssComments(read('src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css'));
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT.generated.json');

expect('Calendar imports repair2 CSS', calendar.includes("import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';"));
expect('Calendar has repair2 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12'));
expect('CSS marker exists', read('src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css').includes('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12'));
expect('CSS scoped to calendar content', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS no shell broad scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS no sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));
expect('CSS rows are flex nowrap', css.includes('display: flex !important') && css.includes('flex-wrap: nowrap !important'));
expect('CSS rows stack with margin gap', css.includes('margin: 0 0 var(--cf-cal-month-row-gap-r2) 0 !important'));
expect('CSS badge fixed width', css.includes('flex: 0 0 var(--cf-cal-month-badge-width-r2) !important'));
expect('CSS title flexible ellipsis', css.includes('flex: 1 1 auto !important') && css.includes('text-overflow: ellipsis !important'));
expect('Audit passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_CHECK_OK');
