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
const css = stripCssComments(read('src/styles/closeflow-calendar-month-plain-text-rows-v4.css'));
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT.generated.json');

expect('Calendar imports V4 CSS', calendar.includes("import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';"));
expect('Calendar has V4 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12'));
expect('Calendar has V4 effect', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT'));
expect('V4 creates plain row class', calendar.includes("row.className = 'cf-calendar-month-text-row';"));
expect('V4 creates type and title spans', calendar.includes('cf-calendar-month-text-type') && calendar.includes('cf-calendar-month-text-title'));
expect('V4 sets title hover', calendar.includes("row.setAttribute('title', fullText);"));
expect('V4 replaces children', calendar.includes('row.replaceChildren();'));
expect('CSS row exists', css.includes('.cf-calendar-month-text-row'));
expect('CSS title exists', css.includes('.cf-calendar-month-text-title'));
expect('CSS no mini-card border', css.includes('border: 0 !important'));
expect('CSS no wrap', css.includes('white-space: nowrap !important'));
expect('CSS ellipsis', css.includes('text-overflow: ellipsis !important'));
expect('CSS scoped calendar only', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('Audit pass', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_CHECK_OK');
