const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}

const css = stripCssComments(read('src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css'));
const calendar = read('src/pages/Calendar.tsx');
const failures = [];

if (!calendar.includes("import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';")) {
  failures.push('Calendar does not import repair2 CSS.');
}
if (!calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12')) {
  failures.push('Calendar does not include repair2 marker.');
}
if (!css.includes('[data-cf-page-header-v2="calendar"] ~ *')) {
  failures.push('Repair2 CSS is not scoped to Calendar content.');
}
if (css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')) {
  failures.push('Repair2 CSS contains broad shell scope.');
}
if (/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css)) {
  failures.push('Repair2 CSS contains sidebar selectors.');
}
for (const token of [
  'display: block !important',
  'display: flex !important',
  'flex-direction: row !important',
  'flex-wrap: nowrap !important',
  'margin: 0 0 var(--cf-cal-month-row-gap-r2) 0 !important',
  'white-space: nowrap !important',
  'text-overflow: ellipsis !important',
  'flex: 0 0 var(--cf-cal-month-badge-width-r2) !important',
  'flex: 1 1 auto !important'
]) {
  if (!css.includes(token)) failures.push(`Repair2 CSS missing token: ${token}`);
}

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Month Rows No Overlap Repair2 Audit',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT_OK');
