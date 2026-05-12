const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const read = (rel) => {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};
const stripCssComments = (input) => input.replace(/\/\*[\s\S]*?\*\//g, '');

const calendar = read('src/pages/Calendar.tsx');
const css = stripCssComments(read('src/styles/closeflow-calendar-month-entry-structural-fix-v3.css'));
const failures = [];

const checks = [
  ['Calendar imports structural CSS', calendar.includes("import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';")],
  ['Calendar has Repair2 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12')],
  ['Calendar has repaired Repair2 effect marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT')],
  ['Calendar has no old Repair1 effect marker', !calendar.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR1_EFFECT')],
  ['Calendar uses escapeRegExp helper', calendar.includes('const escapeRegExp =')],
  ['Calendar replaces children', calendar.includes('candidate.replaceChildren();')],
  ['Calendar creates badge', calendar.includes("badge.className = 'cf-month-entry-chip-structural__badge';")],
  ['Calendar creates title', calendar.includes("title.className = 'cf-month-entry-chip-structural__title';")],
  ['Calendar sets title attribute', calendar.includes("candidate.setAttribute('title', fullText);")],
  ['Calendar only runs in month view', calendar.includes("if (calendarView !== 'month') return;")],
  ['CSS has repair2 marker', read('src/styles/closeflow-calendar-month-entry-structural-fix-v3.css').includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12')],
  ['CSS has structural class', css.includes('.cf-month-entry-chip-structural')],
  ['CSS scoped to calendar content', css.includes('[data-cf-page-header-v2="calendar"] ~ *')],
  ['CSS no broad shell scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])')],
  ['CSS no sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css)],
  ['CSS row nowrap', css.includes('display: flex !important') && css.includes('flex-wrap: nowrap !important')],
  ['CSS badge fixed width', css.includes('flex: 0 0 34px !important')],
  ['CSS title ellipsis', css.includes('text-overflow: ellipsis !important')]
];

for (const [label, ok] of checks) {
  if (!ok) failures.push(label);
}

const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures,
  checks: Object.fromEntries(checks.map(([label, ok]) => [label, ok]))
};

fs.writeFileSync(
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT.generated.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = [
  '# CloseFlow — Calendar Month Entry Structural Fix V3 Repair2 Audit',
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
  path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT.generated.md'),
  md,
  'utf8'
);

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT_OK');
