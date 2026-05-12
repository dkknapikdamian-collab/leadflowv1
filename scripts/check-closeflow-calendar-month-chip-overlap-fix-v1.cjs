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
const css = stripCssComments(read('src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css'));
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT.generated.json');

expect('Calendar imports overlap fix CSS', calendar.includes("import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';"));
expect('Calendar has overlap marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12'));
expect('CSS marker exists', read('src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css').includes('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12'));
expect('CSS scoped to calendar content', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS has no broad shell scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS has no sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));
expect('CSS forces single horizontal chip row', css.includes('grid-template-columns: auto minmax(0, 1fr)'));
expect('CSS prevents chip wrap', css.includes('white-space: nowrap'));
expect('CSS forces ellipsis', css.includes('text-overflow: ellipsis'));
expect('Audit generated and passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_CHECK_OK');
