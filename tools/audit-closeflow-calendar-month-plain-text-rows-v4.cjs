const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}

const calendar = read('src/pages/Calendar.tsx');
const cssRaw = read('src/styles/closeflow-calendar-month-plain-text-rows-v4.css');
const css = stripCssComments(cssRaw);
const failures = [];

const checks = [
  ['Calendar imports V4 CSS', calendar.includes("import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';")],
  ['Calendar has V4 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12')],
  ['Calendar has V4 effect', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT')],
  ['Calendar runs only in month view', calendar.includes("if (calendarView !== 'month') return;")],
  ['Calendar uses plain text row class', calendar.includes("row.className = 'cf-calendar-month-text-row';")],
  ['Calendar creates text type', calendar.includes("type.className = 'cf-calendar-month-text-type';")],
  ['Calendar creates text title', calendar.includes("title.className = 'cf-calendar-month-text-title';")],
  ['Calendar sets hover title', calendar.includes("row.setAttribute('title', fullText);")],
  ['Calendar strips mini-card children', calendar.includes('row.replaceChildren();')],
  ['CSS has V4 marker', cssRaw.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12')],
  ['CSS scoped to calendar content', css.includes('[data-cf-page-header-v2="calendar"] ~ *')],
  ['CSS no broad shell scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')],
  ['CSS no sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css)],
  ['CSS row has no mini-card border', css.includes('border: 0 !important')],
  ['CSS row is nowrap', css.includes('white-space: nowrap !important')],
  ['CSS title ellipsis', css.includes('text-overflow: ellipsis !important')],
  ['CSS row width full', css.includes('width: 100% !important')]
];

for (const [label, ok] of checks) {
  if (!ok) failures.push(label);
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  checks: Object.fromEntries(checks.map(([label, ok]) => [label, ok]))
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Month Plain Text Rows V4 Audit',
  '',
  `Generated: ${result.generatedAt}`,
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  '## Failures',
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  '',
  '## Checks',
  '',
  ...checks.map(([label, ok]) => `- ${ok ? 'PASS' : 'FAIL'} — ${label}`),
  ''
].join('\n');

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT_OK');
