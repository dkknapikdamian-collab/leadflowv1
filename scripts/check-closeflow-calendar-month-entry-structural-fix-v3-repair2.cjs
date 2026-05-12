const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];
const read = (rel) => {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};
const stripCssComments = (input) => input.replace(/\/\*[\s\S]*?\*\//g, '');
const expect = (label, ok) => { if (!ok) failures.push(label); };

const calendar = read('src/pages/Calendar.tsx');
const css = stripCssComments(read('src/styles/closeflow-calendar-month-entry-structural-fix-v3.css'));
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT.generated.json');

expect('Calendar imports structural CSS', calendar.includes("import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';"));
expect('Calendar has Repair2 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12'));
expect('Calendar has Repair2 effect', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT'));
expect('Calendar has no old Repair1 effect', !calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR1_EFFECT'));
expect('Calendar uses escapeRegExp', calendar.includes('const escapeRegExp ='));
expect('Calendar replaces children', calendar.includes('candidate.replaceChildren();'));
expect('Calendar sets native title', calendar.includes("candidate.setAttribute('title', fullText);"));
expect('Calendar runs only in month view', calendar.includes("if (calendarView !== 'month') return;"));
expect('CSS structural class exists', css.includes('.cf-month-entry-chip-structural'));
expect('CSS scoped to calendar', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS no shell broad scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS no sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));
expect('CSS has fixed badge and ellipsis', css.includes('flex: 0 0 34px !important') && css.includes('text-overflow: ellipsis !important'));
expect('Audit passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_CHECK_OK');
